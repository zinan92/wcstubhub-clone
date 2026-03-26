import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MyTicketsPage from '@/app/my/tickets/page';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: vi.fn(),
}));

// Mock Image component
vi.mock('next/image', () => ({
  default: ({ src, alt }: { src: string; alt: string }) => <img src={src} alt={alt} />,
}));

describe('MyTicketsPage', () => {
  const mockRouter = {
    back: vi.fn(),
    push: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useRouter as any).mockReturnValue(mockRouter);
    (useSession as any).mockReturnValue({
      data: { user: { email: 'test@example.com' } },
      status: 'authenticated',
    });
  });

  it('renders loading state initially', () => {
    global.fetch = vi.fn(() =>
      new Promise(() => {}) // Never resolves
    ) as any;

    render(<MyTicketsPage />);

    expect(screen.getByText('My Tickets')).toBeInTheDocument();
    // Check for loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders empty state when no owned assets', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [],
      })
    ) as any;

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('No tickets yet')).toBeInTheDocument();
      expect(screen.getByText('Your purchased tickets will appear here')).toBeInTheDocument();
    });
  });

  it('renders owned assets with proper status badges', async () => {
    const mockOwnedAssets = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Brazil VS Germany',
        itemImageUrl: 'https://example.com/event.jpg',
        purchasePrice: 120.0,
        quantity: 2,
        quantityAvailable: 2,
        status: 'delivered',
        referenceNumber: 'ASSET-2026-00001',
        purchasedAt: '2026-03-15T10:00:00Z',
        deliveredAt: '2026-03-16T14:30:00Z',
      },
      {
        id: '2',
        itemType: 'product',
        itemId: 'product-1',
        itemName: 'France National Team #10 Jersey 2026',
        itemImageUrl: 'https://example.com/product.jpg',
        purchasePrice: 34.99,
        quantity: 3,
        quantityAvailable: 3,
        status: 'confirmed',
        referenceNumber: 'ASSET-2026-00003',
        purchasedAt: '2026-03-22T11:15:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockOwnedAssets,
      })
    ) as any;

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('Brazil VS Germany')).toBeInTheDocument();
      expect(screen.getByText('France National Team #10 Jersey 2026')).toBeInTheDocument();
      expect(screen.getAllByText('Delivered').length).toBeGreaterThan(0);
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
    });
  });

  it('displays ownership status clearly for each asset', async () => {
    const mockOwnedAssets = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: 'https://example.com/event.jpg',
        purchasePrice: 100.0,
        quantity: 5,
        quantityAvailable: 3,
        status: 'delivered',
        referenceNumber: 'ASSET-001',
        purchasedAt: '2026-03-15T10:00:00Z',
        deliveredAt: '2026-03-16T14:30:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockOwnedAssets,
      })
    ) as any;

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Check for ownership status badge
    expect(screen.getAllByText('Delivered').length).toBeGreaterThan(0);
    // Check for quantity display - match the full text
    expect(screen.getByText((content, element) => {
      return element?.textContent === '3 of 5 available';
    })).toBeInTheDocument();
    // Check for reference number
    expect(screen.getByText('ASSET-001')).toBeInTheDocument();
  });

  it('displays timestamps and references for order history context', async () => {
    const mockOwnedAssets = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: 'https://example.com/event.jpg',
        purchasePrice: 100.0,
        quantity: 2,
        quantityAvailable: 2,
        status: 'delivered',
        referenceNumber: 'ASSET-2026-00001',
        purchasedAt: '2026-03-15T10:00:00Z',
        deliveredAt: '2026-03-16T14:30:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockOwnedAssets,
      })
    ) as any;

    render(<MyTicketsPage />);

    await waitFor(() => {
      // Check reference number
      expect(screen.getByText('ASSET-2026-00001')).toBeInTheDocument();
      // Check purchased date
      expect(screen.getByText('Mar 15, 2026')).toBeInTheDocument();
      // Check delivered date
      expect(screen.getByText('Mar 16, 2026')).toBeInTheDocument();
    });
  });

  it('orders assets chronologically by purchase date (newest first)', async () => {
    const mockOwnedAssets = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Recent Purchase',
        itemImageUrl: 'https://example.com/event1.jpg',
        purchasePrice: 100.0,
        quantity: 1,
        quantityAvailable: 1,
        status: 'confirmed',
        referenceNumber: 'ASSET-001',
        purchasedAt: '2026-03-25T10:00:00Z',
      },
      {
        id: '2',
        itemType: 'event',
        itemId: 'event-2',
        itemName: 'Older Purchase',
        itemImageUrl: 'https://example.com/event2.jpg',
        purchasePrice: 50.0,
        quantity: 1,
        quantityAvailable: 1,
        status: 'delivered',
        referenceNumber: 'ASSET-002',
        purchasedAt: '2026-03-15T10:00:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockOwnedAssets,
      })
    ) as any;

    render(<MyTicketsPage />);

    await waitFor(() => {
      const assetCards = screen.getAllByRole('heading', { level: 3 });
      expect(assetCards[0]).toHaveTextContent('Recent Purchase');
      expect(assetCards[1]).toHaveTextContent('Older Purchase');
    });
  });

  it('shows item type (Event or Product) for each asset', async () => {
    const mockOwnedAssets = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: 'https://example.com/event.jpg',
        purchasePrice: 100.0,
        quantity: 1,
        quantityAvailable: 1,
        status: 'delivered',
        referenceNumber: 'ASSET-001',
        purchasedAt: '2026-03-15T10:00:00Z',
      },
      {
        id: '2',
        itemType: 'product',
        itemId: 'product-1',
        itemName: 'Test Product',
        itemImageUrl: 'https://example.com/product.jpg',
        purchasePrice: 50.0,
        quantity: 1,
        quantityAvailable: 1,
        status: 'confirmed',
        referenceNumber: 'ASSET-002',
        purchasedAt: '2026-03-20T10:00:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockOwnedAssets,
      })
    ) as any;

    render(<MyTicketsPage />);

    await waitFor(() => {
      const eventLabels = screen.getAllByText('Event');
      const productLabels = screen.getAllByText('Product');
      expect(eventLabels.length).toBeGreaterThan(0);
      expect(productLabels.length).toBeGreaterThan(0);
    });
  });

  it('displays multiple status types from seeded data', async () => {
    const mockOwnedAssets = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Event 1',
        itemImageUrl: 'https://example.com/1.jpg',
        purchasePrice: 100.0,
        quantity: 1,
        quantityAvailable: 1,
        status: 'pending',
        referenceNumber: 'ASSET-001',
        purchasedAt: '2026-03-25T10:00:00Z',
      },
      {
        id: '2',
        itemType: 'event',
        itemId: 'event-2',
        itemName: 'Event 2',
        itemImageUrl: 'https://example.com/2.jpg',
        purchasePrice: 100.0,
        quantity: 1,
        quantityAvailable: 1,
        status: 'confirmed',
        referenceNumber: 'ASSET-002',
        purchasedAt: '2026-03-20T10:00:00Z',
      },
      {
        id: '3',
        itemType: 'event',
        itemId: 'event-3',
        itemName: 'Event 3',
        itemImageUrl: 'https://example.com/3.jpg',
        purchasePrice: 100.0,
        quantity: 1,
        quantityAvailable: 1,
        status: 'delivered',
        referenceNumber: 'ASSET-003',
        purchasedAt: '2026-03-15T10:00:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockOwnedAssets,
      })
    ) as any;

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('Pending')).toBeInTheDocument();
      expect(screen.getByText('Confirmed')).toBeInTheDocument();
      expect(screen.getByText('Delivered')).toBeInTheDocument();
    });
  });

  it('includes Buyer Protection messaging', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [],
      })
    ) as any;

    render(<MyTicketsPage />);

    await waitFor(() => {
      // BuyerProtection component should be rendered with specific elements
      expect(screen.getByText('Buyer Protection')).toBeInTheDocument();
      expect(screen.getByText('100% Money-Back Guarantee. Every purchase is protected.')).toBeInTheDocument();
      expect(screen.getByRole('button', { name: /learn more/i })).toBeInTheDocument();
    });
  });

  it('displays error state when fetch fails with HTTP error', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: false,
        status: 500,
      })
    ) as any;

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Tickets')).toBeInTheDocument();
      expect(screen.getByText('Failed to load tickets. Please try again.')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });

  it('displays error state when fetch fails with network error', async () => {
    global.fetch = vi.fn(() =>
      Promise.reject(new Error('Network error'))
    ) as any;

    render(<MyTicketsPage />);

    await waitFor(() => {
      expect(screen.getByText('Unable to Load Tickets')).toBeInTheDocument();
      expect(screen.getByText('Unable to connect. Please check your connection and try again.')).toBeInTheDocument();
      expect(screen.getByText('Try Again')).toBeInTheDocument();
    });
  });
});
