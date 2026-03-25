import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/user/orders/route';
import { NextRequest } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    order: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/user/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/user/orders');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('returns all purchase orders when type=purchase', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: '2026-12-31',
    });

    const mockOrders = [
      {
        id: 'order-1',
        userId: 'user-1',
        itemType: 'product',
        itemId: 'product-1',
        itemName: 'Lionel Messi #10 Argentina Jersey',
        itemImageUrl: 'https://picsum.photos/seed/messi/400/400',
        purchasePrice: 149.99,
        currentPrice: 155.00,
        quantity: 2,
        sharesHeld: 150,
        status: 'paid',
        orderNumber: 'ORD-2026-001234',
        transactionTime: new Date('2026-03-10T14:30:00Z'),
        createdAt: new Date(),
      },
    ];

    vi.mocked(prisma.order.findMany).mockResolvedValue(mockOrders as any);

    const request = new NextRequest('http://localhost:3100/api/user/orders?type=purchase');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(1);
    expect(data[0].orderNumber).toBe('ORD-2026-001234');
    expect(prisma.order.findMany).toHaveBeenCalledWith({
      where: { userId: 'user-1' },
      orderBy: { transactionTime: 'desc' },
    });
  });

  it('returns empty array for for-sale orders when type=sale', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: '2026-12-31',
    });

    vi.mocked(prisma.order.findMany).mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3100/api/user/orders?type=sale');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveLength(0);
  });

  it('defaults to purchase orders when no type specified', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: '2026-12-31',
    });

    vi.mocked(prisma.order.findMany).mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3100/api/user/orders');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
  });

  it('handles database errors gracefully', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-1', email: 'test@example.com' },
      expires: '2026-12-31',
    });

    vi.mocked(prisma.order.findMany).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3100/api/user/orders');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Failed to fetch orders');
  });
});
