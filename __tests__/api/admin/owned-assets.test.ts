import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/admin/owned-assets/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

// Mock prisma
vi.mock('@/lib/prisma', () => ({
  prisma: {
    ownedAsset: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/admin/owned-assets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 when user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new Request('http://localhost:3100/api/admin/owned-assets');
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

    const request = new Request('http://localhost:3100/api/admin/owned-assets');
    const response = await GET(request as any);

    expect(response.status).toBe(403);
    const data = await response.json();
    expect(data.error).toBe('Forbidden: Admin access required');
  });

  it('returns all owned assets when no status filter is applied', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin1', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const mockOwnedAssets = [
      {
        id: '1',
        userId: 'user1',
        itemType: 'event',
        itemId: 'event1',
        itemName: 'Concert',
        itemImageUrl: 'image.jpg',
        purchasePrice: 100,
        quantity: 2,
        quantityAvailable: 2,
        status: 'delivered',
        referenceNumber: 'ASSET-001',
        purchasedAt: new Date(),
        deliveredAt: new Date(),
        createdAt: new Date(),
        updatedAt: new Date(),
        user: { email: 'user@example.com', name: 'User' },
      },
    ];

    vi.mocked(prisma.ownedAsset.findMany).mockResolvedValue(mockOwnedAssets as any);

    const request = new Request('http://localhost:3100/api/admin/owned-assets');
    const response = await GET(request as any);

    expect(response.status).toBe(200);
    const data = await response.json();
    // Dates are serialized as strings in JSON
    expect(data).toHaveLength(1);
    expect(data[0].id).toBe('1');
    expect(data[0].status).toBe('delivered');
    expect(prisma.ownedAsset.findMany).toHaveBeenCalledWith({
      where: {},
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { purchasedAt: 'desc' },
    });
  });

  it('filters owned assets by status when status parameter is provided', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin1', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    vi.mocked(prisma.ownedAsset.findMany).mockResolvedValue([]);

    const request = new Request('http://localhost:3100/api/admin/owned-assets?status=delivered');
    const response = await GET(request as any);

    expect(response.status).toBe(200);
    expect(prisma.ownedAsset.findMany).toHaveBeenCalledWith({
      where: { status: 'delivered' },
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { purchasedAt: 'desc' },
    });
  });

  it('ignores invalid status values', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin1', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    vi.mocked(prisma.ownedAsset.findMany).mockResolvedValue([]);

    const request = new Request('http://localhost:3100/api/admin/owned-assets?status=invalid');
    const response = await GET(request as any);

    expect(response.status).toBe(200);
    expect(prisma.ownedAsset.findMany).toHaveBeenCalledWith({
      where: {},
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { purchasedAt: 'desc' },
    });
  });

  it('handles database errors gracefully', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin1', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    vi.mocked(prisma.ownedAsset.findMany).mockRejectedValue(new Error('Database error'));

    const request = new Request('http://localhost:3100/api/admin/owned-assets');
    const response = await GET(request as any);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Internal server error');
  });
});
