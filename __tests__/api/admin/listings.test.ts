import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/admin/listings/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    listing: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/admin/listings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new Request('http://localhost:3100/api/admin/listings');
    const response = await GET(request as any);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 403 when user is not an admin', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user1', email: 'user@example.com', role: 'user' },
      expires: '2026-12-31',
    });

    const request = new Request('http://localhost:3100/api/admin/listings');
    const response = await GET(request as any);

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe('Forbidden: Admin access required');
  });

  it('returns all listings when no status filter is applied', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin1', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const mockListings = [
      {
        id: '1',
        sellerId: 'user1',
        ownedAssetId: 'asset1',
        itemType: 'event',
        itemId: 'event1',
        itemName: 'Concert',
        itemImageUrl: 'image.jpg',
        askPrice: 150,
        quantity: 2,
        status: 'active',
        referenceNumber: 'LIST-001',
        listedAt: new Date(),
        soldAt: null,
        cancelledAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
        seller: { email: 'seller@example.com', name: 'Seller' },
      },
    ];

    vi.mocked(prisma.listing.findMany).mockResolvedValue(mockListings as any);

    const request = new Request('http://localhost:3100/api/admin/listings');
    const response = await GET(request as any);

    expect(response.status).toBe(200);
    const data = await response.json();
    // Dates are serialized as strings in JSON
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe('1');
    expect(data[0].status).toBe('active');
    expect(prisma.listing.findMany).toHaveBeenCalledWith({
      where: {},
      include: {
        seller: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { listedAt: 'desc' },
    });
  });

  it('filters listings by status when status parameter is provided', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin1', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    vi.mocked(prisma.listing.findMany).mockResolvedValue([]);

    const request = new Request('http://localhost:3100/api/admin/listings?status=active');
    const response = await GET(request as any);

    expect(response.status).toBe(200);
    expect(prisma.listing.findMany).toHaveBeenCalledWith({
      where: { status: 'active' },
      include: {
        seller: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { listedAt: 'desc' },
    });
  });

  it('ignores invalid status values', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin1', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    vi.mocked(prisma.listing.findMany).mockResolvedValue([]);

    const request = new Request('http://localhost:3100/api/admin/listings?status=invalid');
    const response = await GET(request as any);

    expect(response.status).toBe(200);
    expect(prisma.listing.findMany).toHaveBeenCalledWith({
      where: {},
      include: {
        seller: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { listedAt: 'desc' },
    });
  });

  it('handles database errors gracefully', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin1', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    vi.mocked(prisma.listing.findMany).mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost:3100/api/admin/listings');
    const response = await GET(request as any);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Internal server error');
  });
});
