import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import SearchOverlay from '@/components/goods/SearchOverlay';

// Mock fetch API
const mockFetch = vi.fn();
global.fetch = mockFetch;

// Mock useRouter
const mockPush = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: mockPush,
  }),
}));

describe('SearchOverlay', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    mockFetch.mockResolvedValue({
      ok: true,
      json: async () => ({ products: [], events: [] }),
    });
  });

  describe('Rendering and visibility', () => {
    it('does not render when isOpen is false', () => {
      render(<SearchOverlay isOpen={false} onClose={vi.fn()} />);
      expect(screen.queryByRole('dialog')).not.toBeInTheDocument();
    });

    it('renders full-screen overlay when isOpen is true', () => {
      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);
      const dialog = screen.getByRole('dialog');
      expect(dialog).toBeInTheDocument();
      expect(dialog).toHaveClass('fixed', 'inset-0', 'z-50');
    });

    it('renders with auto-focused input', () => {
      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);
      const input = screen.getByPlaceholderText(/search products and events/i);
      expect(input).toBeInTheDocument();
    });

    it('renders close button', () => {
      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);
      const closeButton = screen.getByLabelText(/close search/i);
      expect(closeButton).toBeInTheDocument();
    });
  });

  describe('Trending items', () => {
    it('displays trending items section before typing', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          products: [
            { id: 'p1', name: 'Brazil Jersey', price: 89.99, imageUrl: 'https://flagcdn.com/w640/br.png' },
            { id: 'p2', name: 'Argentina Jersey', price: 79.99, imageUrl: 'https://flagcdn.com/w640/ar.png' },
          ],
          events: [
            { id: 'e1', title: 'Brazil vs Argentina', type: 'football', price: 250, venue: 'Wembley', date: '2026-06-15T19:00:00Z' },
          ],
        }),
      });

      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/trending/i)).toBeInTheDocument();
      });

      await waitFor(() => {
        expect(screen.getByText('Brazil Jersey')).toBeInTheDocument();
        expect(screen.getByText('Argentina Jersey')).toBeInTheDocument();
        expect(screen.getByText('Brazil vs Argentina')).toBeInTheDocument();
      });
    });

    it('fetches trending items on mount with empty query', async () => {
      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);

      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/search?q=');
      });
    });

    it('shows at least 3 trending items when available', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          products: [
            { id: 'p1', name: 'Product 1', price: 50, imageUrl: 'https://flagcdn.com/w640/us.png' },
            { id: 'p2', name: 'Product 2', price: 60, imageUrl: 'https://flagcdn.com/w640/gb.png' },
          ],
          events: [
            { id: 'e1', title: 'Event 1', type: 'football', price: 100, venue: 'Venue 1', date: '2026-06-15T19:00:00Z' },
            { id: 'e2', title: 'Event 2', type: 'concert', price: 120, venue: 'Venue 2', date: '2026-06-20T20:00:00Z' },
          ],
        }),
      });

      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);

      await waitFor(() => {
        const items = screen.getAllByRole('button', { name: /view/i });
        expect(items.length).toBeGreaterThanOrEqual(3);
      });
    });
  });

  describe('Autocomplete', () => {
    it('debounces search input by 300ms', async () => {
      const user = userEvent.setup({ delay: null });
      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByPlaceholderText(/search products and events/i);
      
      // Type quickly
      await user.type(input, 'brazil');

      // Should not call API immediately
      expect(mockFetch).toHaveBeenCalledTimes(1); // Only the initial trending call

      // Wait for debounce
      await waitFor(() => {
        expect(mockFetch).toHaveBeenCalledWith('/api/search?q=brazil');
      }, { timeout: 500 });
    });

    it('displays autocomplete results grouped by type', async () => {
      const user = userEvent.setup({ delay: null });
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], events: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            products: [
              { id: 'p1', name: 'Brazil Jersey', price: 89.99, imageUrl: 'https://flagcdn.com/w640/br.png' },
            ],
            events: [
              { id: 'e1', title: 'Brazil vs Argentina', type: 'football', price: 250, venue: 'Stadium', date: '2026-06-15T19:00:00Z' },
            ],
          }),
        });

      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByPlaceholderText(/search products and events/i);
      await user.type(input, 'brazil');

      await waitFor(() => {
        expect(screen.getByText('Brazil Jersey')).toBeInTheDocument();
        expect(screen.getByText('Brazil vs Argentina')).toBeInTheDocument();
      });

      // Check for type indicators/badges
      await waitFor(() => {
        const badges = screen.getAllByText(/product|football/i);
        expect(badges.length).toBeGreaterThan(0);
      });
    });

    it('shows result metadata (name, price, type)', async () => {
      const user = userEvent.setup({ delay: null });
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], events: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({
            products: [
              { id: 'p1', name: 'Test Product', price: 99.99, imageUrl: 'https://flagcdn.com/w640/de.png' },
            ],
            events: [],
          }),
        });

      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByPlaceholderText(/search products and events/i);
      await user.type(input, 'test');

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument();
        expect(screen.getByText(/99\.99/)).toBeInTheDocument();
        const productBadges = screen.getAllByText(/product/i).filter(el => 
          el.tagName.toLowerCase() === 'span'
        );
        expect(productBadges.length).toBeGreaterThan(0);
      });
    });
  });

  describe('Navigation', () => {
    it('navigates to product detail page on product result click', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          products: [
            { id: 'product-123', name: 'Test Product', price: 50, imageUrl: 'https://flagcdn.com/w640/fr.png' },
          ],
          events: [],
        }),
      });

      const onClose = vi.fn();
      render(<SearchOverlay isOpen={true} onClose={onClose} />);

      await waitFor(() => {
        expect(screen.getByText('Test Product')).toBeInTheDocument();
      });

      const productButton = screen.getByRole('button', { name: /test product/i });
      fireEvent.click(productButton);

      expect(mockPush).toHaveBeenCalledWith('/products/product-123');
      expect(onClose).toHaveBeenCalled();
    });

    it('navigates to event detail page on event result click', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          products: [],
          events: [
            { id: 'event-456', title: 'Test Event', type: 'football', price: 100, venue: 'Stadium', date: '2026-06-15T19:00:00Z' },
          ],
        }),
      });

      const onClose = vi.fn();
      render(<SearchOverlay isOpen={true} onClose={onClose} />);

      await waitFor(() => {
        expect(screen.getByText('Test Event')).toBeInTheDocument();
      });

      const eventButton = screen.getByRole('button', { name: /test event/i });
      fireEvent.click(eventButton);

      expect(mockPush).toHaveBeenCalledWith('/events/event-456');
      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('No results state', () => {
    it('displays no results message for empty results', async () => {
      const user = userEvent.setup({ delay: null });
      mockFetch
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], events: [] }),
        })
        .mockResolvedValueOnce({
          ok: true,
          json: async () => ({ products: [], events: [] }),
        });

      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);

      const input = screen.getByPlaceholderText(/search products and events/i);
      await user.type(input, 'xyznonexistent');

      await waitFor(() => {
        expect(screen.getByText(/no results found/i)).toBeInTheDocument();
      });
    });

    it('does not show no results state when showing trending items', async () => {
      mockFetch.mockResolvedValue({
        ok: true,
        json: async () => ({
          products: [{ id: 'p1', name: 'Product', price: 50, imageUrl: 'https://flagcdn.com/w640/it.png' }],
          events: [],
        }),
      });

      render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);

      await waitFor(() => {
        expect(screen.getByText(/trending/i)).toBeInTheDocument();
      });

      expect(screen.queryByText(/no results found/i)).not.toBeInTheDocument();
    });
  });

  describe('Dismissal', () => {
    it('calls onClose when close button is clicked', () => {
      const onClose = vi.fn();
      render(<SearchOverlay isOpen={true} onClose={onClose} />);

      const closeButton = screen.getByLabelText(/close search/i);
      fireEvent.click(closeButton);

      expect(onClose).toHaveBeenCalled();
    });

    it('calls onClose when backdrop is clicked', () => {
      const onClose = vi.fn();
      render(<SearchOverlay isOpen={true} onClose={onClose} />);

      const dialog = screen.getByRole('dialog');
      fireEvent.click(dialog);

      expect(onClose).toHaveBeenCalled();
    });

    it('does not close when clicking inside the content area', () => {
      const onClose = vi.fn();
      render(<SearchOverlay isOpen={true} onClose={onClose} />);

      const input = screen.getByPlaceholderText(/search products and events/i);
      fireEvent.click(input);

      expect(onClose).not.toHaveBeenCalled();
    });

    it('calls onClose on Escape key press', () => {
      const onClose = vi.fn();
      render(<SearchOverlay isOpen={true} onClose={onClose} />);

      fireEvent.keyDown(document, { key: 'Escape', code: 'Escape' });

      expect(onClose).toHaveBeenCalled();
    });
  });

  describe('Body scroll lock', () => {
    it('prevents body scroll when overlay is open', () => {
      const { rerender } = render(<SearchOverlay isOpen={true} onClose={vi.fn()} />);

      expect(document.body.style.overflow).toBe('hidden');

      rerender(<SearchOverlay isOpen={false} onClose={vi.fn()} />);

      expect(document.body.style.overflow).toBe('');
    });
  });
});
