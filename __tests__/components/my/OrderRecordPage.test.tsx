import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, waitFor, fireEvent } from '@testing-library/react';
import { useSession } from 'next-auth/react';
import OrderRecordPage from '@/app/my/orders/page';

// Mock next-auth
vi.mock('next-auth/react', () => ({
  useSession: vi.fn(),
}));

// Mock next/navigation
vi.mock('next/navigation', () => ({
  useRouter: () => ({
    push: vi.fn(),
    back: vi.fn(),
  }),
}));

// Mock fetch
global.fetch = vi.fn();

describe('OrderRecordPage', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    vi.mocked(useSession).mockReturnValue({
      data: { user: { id: 'user-1', email: 'test@example.com' }, expires: '2026-12-31' },
      status: 'authenticated',
      update: vi.fn(),
    });
  });

  it('renders header with back button and title', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(<OrderRecordPage />);

    expect(screen.getByText('Order Records')).toBeInTheDocument();
  });

  it('renders Purchase and For sale tabs', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(<OrderRecordPage />);

    await waitFor(() => {
      expect(screen.getByText('Purchase')).toBeInTheDocument();
      expect(screen.getByText('For Sale')).toBeInTheDocument();
    });
  });

  it('Purchase tab is active by default with blue underline', async () => {
    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => [],
    } as Response);

    render(<OrderRecordPage />);

    await waitFor(() => {
      const purchaseTab = screen.getByText('Purchase').closest('button');
      expect(purchaseTab).toHaveClass('bg-primary-500');
    });
  });

  it('displays order cards with all required fields on Purchase tab', async () => {
    const mockOrders = [
      {
        id: 'order-1',
        userId: 'user-1',
        itemType: 'product',
        itemId: 'product-1',
        itemName: 'Lionel Messi #10 Argentina Jersey',
        itemImageUrl: 'https://flagcdn.com/w640/ar.png',
        purchasePrice: 149.99,
        currentPrice: 155.00,
        quantity: 2,
        sharesHeld: 150,
        status: 'paid',
        orderNumber: 'ORD-2026-001234',
        transactionTime: '2026-03-10T14:30:00.000Z',
        createdAt: '2026-03-10T14:30:00.000Z',
      },
    ];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrders,
    } as Response);

    render(<OrderRecordPage />);

    await waitFor(() => {
      expect(screen.getByText('Lionel Messi #10 Argentina Jersey')).toBeInTheDocument();
      expect(screen.getByText('ORD-2026-001234')).toBeInTheDocument();
      expect(screen.getByText('Paid')).toBeInTheDocument();
      expect(screen.getByText('$149.99')).toBeInTheDocument();
      expect(screen.getByText('$155.00')).toBeInTheDocument();
    });
  });

  it('displays "To be paid" status label distinctly from "Paid"', async () => {
    const mockOrders = [
      {
        id: 'order-1',
        userId: 'user-1',
        itemType: 'event',
        itemId: 'evt-1',
        itemName: '[Beijing] Phoenix Suns VS Lakers',
        itemImageUrl: '',
        purchasePrice: 145.00,
        currentPrice: 145.00,
        quantity: 1,
        sharesHeld: 150,
        status: 'to_be_paid',
        orderNumber: 'ORD-2026-001235',
        transactionTime: '2026-03-24T10:15:00.000Z',
        createdAt: '2026-03-24T10:15:00.000Z',
      },
    ];

    vi.mocked(fetch).mockResolvedValueOnce({
      ok: true,
      json: async () => mockOrders,
    } as Response);

    render(<OrderRecordPage />);

    await waitFor(() => {
      const statusLabel = screen.getByText('To be paid');
      expect(statusLabel).toBeInTheDocument();
      expect(statusLabel).toHaveClass('bg-orange-100', 'text-orange-600');
    });
  });

  it('switches to For sale tab and shows empty state', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 'order-1',
            userId: 'user-1',
            itemType: 'product',
            itemId: 'product-1',
            itemName: 'Test Product',
            itemImageUrl: '',
            purchasePrice: 100.00,
            currentPrice: 105.00,
            quantity: 1,
            sharesHeld: 50,
            status: 'paid',
            orderNumber: 'ORD-001',
            transactionTime: '2026-03-10T14:30:00.000Z',
            createdAt: '2026-03-10T14:30:00.000Z',
          },
        ],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response);

    render(<OrderRecordPage />);

    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    const forSaleTab = screen.getByText('For Sale');
    fireEvent.click(forSaleTab);

    await waitFor(() => {
      expect(screen.getByText('No orders yet')).toBeInTheDocument();
    });
  });

  it('switches back to Purchase tab bidirectionally', async () => {
    vi.mocked(fetch)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 'order-1',
            userId: 'user-1',
            itemType: 'product',
            itemId: 'product-1',
            itemName: 'Test Product',
            itemImageUrl: '',
            purchasePrice: 100.00,
            currentPrice: 105.00,
            quantity: 1,
            sharesHeld: 50,
            status: 'paid',
            orderNumber: 'ORD-001',
            transactionTime: '2026-03-10T14:30:00.000Z',
            createdAt: '2026-03-10T14:30:00.000Z',
          },
        ],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [],
      } as Response)
      .mockResolvedValueOnce({
        ok: true,
        json: async () => [
          {
            id: 'order-1',
            userId: 'user-1',
            itemType: 'product',
            itemId: 'product-1',
            itemName: 'Test Product',
            itemImageUrl: '',
            purchasePrice: 100.00,
            currentPrice: 105.00,
            quantity: 1,
            sharesHeld: 50,
            status: 'paid',
            orderNumber: 'ORD-001',
            transactionTime: '2026-03-10T14:30:00.000Z',
            createdAt: '2026-03-10T14:30:00.000Z',
          },
        ],
      } as Response);

    render(<OrderRecordPage />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });

    // Switch to For Sale
    fireEvent.click(screen.getByText('For Sale'));
    await waitFor(() => {
      expect(screen.getByText('No orders yet')).toBeInTheDocument();
    });

    // Switch back to Purchase
    fireEvent.click(screen.getByText('Purchase'));
    await waitFor(() => {
      expect(screen.getByText('Test Product')).toBeInTheDocument();
    });
  });

  it('displays loading state initially', () => {
    vi.mocked(fetch).mockImplementation(
      () => new Promise(() => {}) // Never resolves
    );

    render(<OrderRecordPage />);

    expect(screen.getByText('Loading...')).toBeInTheDocument();
  });

  it('handles fetch errors gracefully', async () => {
    vi.mocked(fetch).mockRejectedValueOnce(new Error('Network error'));

    render(<OrderRecordPage />);

    await waitFor(() => {
      expect(screen.getByText('No orders yet')).toBeInTheDocument();
    });
  });
});
