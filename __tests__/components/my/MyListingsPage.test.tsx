import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import MyListingsPage from '@/app/my/listings/page';

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

describe('MyListingsPage', () => {
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

    render(<MyListingsPage />);

    expect(screen.getByText('My Listings')).toBeInTheDocument();
    // Check for loading skeletons
    const skeletons = document.querySelectorAll('.animate-pulse');
    expect(skeletons.length).toBeGreaterThan(0);
  });

  it('renders empty state when no listings', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [],
      })
    ) as any;

    render(<MyListingsPage />);

    await waitFor(() => {
      expect(screen.getByText('No listings yet')).toBeInTheDocument();
      expect(screen.getByText('Items you list for sale will appear here')).toBeInTheDocument();
    });
  });

  it('renders listings with proper status badges', async () => {
    const mockListings = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Taylor Swift: The Eras Tour',
        itemImageUrl: 'https://example.com/event.jpg',
        askPrice: 349.99,
        quantity: 2,
        status: 'active',
        referenceNumber: 'LIST-2026-00001',
        listedAt: '2026-03-20T10:00:00Z',
      },
      {
        id: '2',
        itemType: 'event',
        itemId: 'event-2',
        itemName: 'Brazil VS Germany',
        itemImageUrl: 'https://example.com/event2.jpg',
        askPrice: 150.0,
        quantity: 1,
        status: 'sold',
        referenceNumber: 'LIST-2026-00002',
        listedAt: '2026-03-17T12:00:00Z',
        soldAt: '2026-03-21T14:30:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockListings,
      })
    ) as any;

    render(<MyListingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Taylor Swift: The Eras Tour')).toBeInTheDocument();
      expect(screen.getByText('Brazil VS Germany')).toBeInTheDocument();
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getAllByText('Sold').length).toBeGreaterThan(0);
    });
  });

  it('displays listing status clearly for each listing', async () => {
    const mockListings = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: 'https://example.com/event.jpg',
        askPrice: 200.0,
        quantity: 3,
        status: 'active',
        referenceNumber: 'LIST-001',
        listedAt: '2026-03-20T10:00:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockListings,
      })
    ) as any;

    render(<MyListingsPage />);

    await waitFor(() => {
      // Check for listing status badge
      expect(screen.getByText('Active')).toBeInTheDocument();
      // Check for reference number
      expect(screen.getByText('LIST-001')).toBeInTheDocument();
      // Check for quantity and price
      expect(screen.getByText(/\$200\.00/)).toBeInTheDocument();
      expect(screen.getByText('× 3')).toBeInTheDocument();
    });
  });

  it('displays timestamps and references for listing history context', async () => {
    const mockListings = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: 'https://example.com/event.jpg',
        askPrice: 150.0,
        quantity: 1,
        status: 'sold',
        referenceNumber: 'LIST-2026-00002',
        listedAt: '2026-03-17T12:00:00Z',
        soldAt: '2026-03-21T14:30:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockListings,
      })
    ) as any;

    render(<MyListingsPage />);

    await waitFor(() => {
      // Check reference number
      expect(screen.getByText('LIST-2026-00002')).toBeInTheDocument();
      // Check listed date
      expect(screen.getByText('Mar 17, 2026')).toBeInTheDocument();
      // Check sold date
      expect(screen.getByText('Mar 21, 2026')).toBeInTheDocument();
    });
  });

  it('orders listings chronologically by listed date (newest first)', async () => {
    const mockListings = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Recent Listing',
        itemImageUrl: 'https://example.com/event1.jpg',
        askPrice: 100.0,
        quantity: 1,
        status: 'active',
        referenceNumber: 'LIST-001',
        listedAt: '2026-03-25T10:00:00Z',
      },
      {
        id: '2',
        itemType: 'event',
        itemId: 'event-2',
        itemName: 'Older Listing',
        itemImageUrl: 'https://example.com/event2.jpg',
        askPrice: 50.0,
        quantity: 1,
        status: 'sold',
        referenceNumber: 'LIST-002',
        listedAt: '2026-03-15T10:00:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockListings,
      })
    ) as any;

    render(<MyListingsPage />);

    await waitFor(() => {
      const listingCards = screen.getAllByRole('heading', { level: 3 });
      expect(listingCards[0]).toHaveTextContent('Recent Listing');
      expect(listingCards[1]).toHaveTextContent('Older Listing');
    });
  });

  it('shows item type (Event or Product) for each listing', async () => {
    const mockListings = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: 'https://example.com/event.jpg',
        askPrice: 100.0,
        quantity: 1,
        status: 'active',
        referenceNumber: 'LIST-001',
        listedAt: '2026-03-20T10:00:00Z',
      },
      {
        id: '2',
        itemType: 'product',
        itemId: 'product-1',
        itemName: 'Test Product',
        itemImageUrl: 'https://example.com/product.jpg',
        askPrice: 50.0,
        quantity: 1,
        status: 'active',
        referenceNumber: 'LIST-002',
        listedAt: '2026-03-22T10:00:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockListings,
      })
    ) as any;

    render(<MyListingsPage />);

    await waitFor(() => {
      const eventLabels = screen.getAllByText('Event');
      const productLabels = screen.getAllByText('Product');
      expect(eventLabels.length).toBeGreaterThan(0);
      expect(productLabels.length).toBeGreaterThan(0);
    });
  });

  it('displays multiple status types from seeded data', async () => {
    const mockListings = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Event 1',
        itemImageUrl: 'https://example.com/1.jpg',
        askPrice: 100.0,
        quantity: 1,
        status: 'active',
        referenceNumber: 'LIST-001',
        listedAt: '2026-03-25T10:00:00Z',
      },
      {
        id: '2',
        itemType: 'event',
        itemId: 'event-2',
        itemName: 'Event 2',
        itemImageUrl: 'https://example.com/2.jpg',
        askPrice: 100.0,
        quantity: 1,
        status: 'sold',
        referenceNumber: 'LIST-002',
        listedAt: '2026-03-20T10:00:00Z',
        soldAt: '2026-03-21T10:00:00Z',
      },
      {
        id: '3',
        itemType: 'event',
        itemId: 'event-3',
        itemName: 'Event 3',
        itemImageUrl: 'https://example.com/3.jpg',
        askPrice: 100.0,
        quantity: 1,
        status: 'cancelled',
        referenceNumber: 'LIST-003',
        listedAt: '2026-03-15T10:00:00Z',
        cancelledAt: '2026-03-16T10:00:00Z',
      },
      {
        id: '4',
        itemType: 'event',
        itemId: 'event-4',
        itemName: 'Event 4',
        itemImageUrl: 'https://example.com/4.jpg',
        askPrice: 100.0,
        quantity: 1,
        status: 'pending_sale',
        referenceNumber: 'LIST-004',
        listedAt: '2026-03-18T10:00:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockListings,
      })
    ) as any;

    render(<MyListingsPage />);

    await waitFor(() => {
      expect(screen.getByText('Active')).toBeInTheDocument();
      expect(screen.getAllByText('Sold').length).toBeGreaterThan(0);
      expect(screen.getAllByText('Cancelled').length).toBeGreaterThan(0);
      expect(screen.getByText('Pending Sale')).toBeInTheDocument();
    });
  });

  it('includes Buyer Protection messaging', async () => {
    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => [],
      })
    ) as any;

    render(<MyListingsPage />);

    await waitFor(() => {
      // BuyerProtection component should be rendered
      const buyerProtection = document.querySelector('[class*="buyer-protection"]') || 
                             document.body.textContent?.includes('Buyer Protection') ||
                             document.body.textContent?.includes('100% Buyer Guarantee');
      expect(buyerProtection).toBeTruthy();
    });
  });

  it('clearly distinguishes listings from owned tickets', async () => {
    const mockListings = [
      {
        id: '1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: 'https://example.com/event.jpg',
        askPrice: 200.0,
        quantity: 2,
        status: 'active',
        referenceNumber: 'LIST-001',
        listedAt: '2026-03-20T10:00:00Z',
      },
    ];

    global.fetch = vi.fn(() =>
      Promise.resolve({
        ok: true,
        json: async () => mockListings,
      })
    ) as any;

    render(<MyListingsPage />);

    // Page title clearly indicates listings
    expect(screen.getByText('My Listings')).toBeInTheDocument();

    await waitFor(() => {
      expect(screen.getByText('Test Event')).toBeInTheDocument();
    });
    
    // Status badge shows listing-specific status
    expect(screen.getByText('Active')).toBeInTheDocument();
    // Reference shows listing prefix
    expect(screen.getByText('LIST-001')).toBeInTheDocument();
  });
});
