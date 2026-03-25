import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import ProductDetailPage from '@/app/products/[id]/page';

// Mock next/navigation
const mockBack = vi.fn();
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    back: mockBack,
  }),
}));

// Mock fetch
global.fetch = vi.fn();

const mockProduct = {
  id: 'prod123',
  name: 'Messi #10 Argentina Jersey',
  price: 199.99,
  imageUrl: 'https://picsum.photos/seed/messi/400/400',
  description: 'Official Argentina national team jersey with Messi #10. Authentic FIFA World Cup edition. Made from premium breathable fabric.',
  remainingQty: 25,
};

describe('ProductDetailPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    (global.fetch as any).mockResolvedValue({
      ok: true,
      json: async () => mockProduct,
    });
  });

  it('renders product details after loading', async () => {
    render(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    // Wait for product to load
    await waitFor(() => {
      expect(screen.getByText('Messi #10 Argentina Jersey')).toBeDefined();
    });

    expect(screen.getByText('$199.99')).toBeDefined();
    expect(screen.getByText('25 units')).toBeDefined();
    expect(screen.getByText(/Official Argentina national team jersey/)).toBeDefined();
  });

  it('displays product image with correct alt text', async () => {
    render(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      const img = screen.getByAltText('Messi #10 Argentina Jersey');
      expect(img).toBeDefined();
      expect(img.getAttribute('src')).toBe('https://picsum.photos/seed/messi/400/400');
    });
  });

  it('shows Purchase and For sale buttons', async () => {
    render(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByText('Purchase')).toBeDefined();
      expect(screen.getByText('For sale')).toBeDefined();
    });
  });

  it('opens Purchase dialog when Purchase button clicked', async () => {
    render(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByText('Purchase')).toBeDefined();
    });

    const purchaseButton = screen.getByText('Purchase');
    fireEvent.click(purchaseButton);

    await waitFor(() => {
      expect(screen.getByText('Purchase request submitted successfully')).toBeDefined();
    });
  });

  it('opens For sale dialog when For sale button clicked', async () => {
    render(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByText('For sale')).toBeDefined();
    });

    const forSaleButton = screen.getByText('For sale');
    fireEvent.click(forSaleButton);

    await waitFor(() => {
      expect(screen.getByText('Listing request submitted successfully')).toBeDefined();
    });
  });

  it('closes Purchase dialog when OK clicked', async () => {
    render(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByText('Purchase')).toBeDefined();
    });

    // Open dialog
    fireEvent.click(screen.getByText('Purchase'));

    await waitFor(() => {
      expect(screen.getByText('Purchase request submitted successfully')).toBeDefined();
    });

    // Close dialog
    const okButtons = screen.getAllByText('OK');
    fireEvent.click(okButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Purchase request submitted successfully')).toBeNull();
    });
  });

  it('closes For sale dialog when OK clicked', async () => {
    render(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByText('For sale')).toBeDefined();
    });

    // Open dialog
    fireEvent.click(screen.getByText('For sale'));

    await waitFor(() => {
      expect(screen.getByText('Listing request submitted successfully')).toBeDefined();
    });

    // Close dialog
    const okButtons = screen.getAllByText('OK');
    fireEvent.click(okButtons[0]);

    await waitFor(() => {
      expect(screen.queryByText('Listing request submitted successfully')).toBeNull();
    });
  });

  it('calls router.back() when back button clicked', async () => {
    render(<ProductDetailPage params={Promise.resolve({ id: 'prod123' })} />);

    await waitFor(() => {
      expect(screen.getByLabelText('Go back')).toBeDefined();
    });

    const backButton = screen.getByLabelText('Go back');
    fireEvent.click(backButton);

    expect(mockBack).toHaveBeenCalledTimes(1);
  });

  it('shows not found message when product does not exist', async () => {
    (global.fetch as any).mockResolvedValue({
      ok: false,
      json: async () => ({ error: 'Product not found' }),
    });

    render(<ProductDetailPage params={Promise.resolve({ id: 'invalid' })} />);

    await waitFor(() => {
      expect(screen.getByText('Product not found')).toBeDefined();
    });
  });
});
