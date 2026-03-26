import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/user/owned-assets/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getServerSession } from 'next-auth';

vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

vi.mock('@/lib/prisma', () => ({
  prisma: {
    user: {
      findUnique: vi.fn(),
    },
    ownedAsset: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
  },
}));

describe('GET /api/user/owned-assets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/user/owned-assets');
    const response = await GET(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('returns 404 if user not found', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/user/owned-assets');
    const response = await GET(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('User not found');
  });

  it('returns owned assets for authenticated user', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockAssets = [
      {
        id: 'asset-1',
        userId: 'user-1',
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        purchasePrice: 100,
        quantity: 2,
        quantityAvailable: 2,
        status: 'confirmed',
        referenceNumber: 'OA-20260326-ABC123',
        purchasedAt: new Date(),
        deliveredAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.ownedAsset.findMany).mockResolvedValue(mockAssets as any);

    const request = new NextRequest('http://localhost:3100/api/user/owned-assets');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject(mockAssets.map((asset) => ({
      ...asset,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      purchasedAt: expect.any(String),
    })));
  });

  it('handles database errors gracefully', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3100/api/user/owned-assets');
    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch owned assets');
  });
});

describe('POST /api/user/owned-assets', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/user/owned-assets', {
      method: 'POST',
      body: JSON.stringify({
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        purchasePrice: 100,
        quantity: 2,
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('creates owned asset for authenticated user', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockAsset = {
      id: 'asset-1',
      userId: 'user-1',
      itemType: 'event',
      itemId: 'event-1',
      itemName: 'Test Event',
      itemImageUrl: '/test.jpg',
      purchasePrice: 100,
      quantity: 2,
      quantityAvailable: 2,
      status: 'confirmed',
      referenceNumber: 'OA-20260326-ABC123',
      purchasedAt: new Date(),
      deliveredAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.ownedAsset.create).mockResolvedValue(mockAsset as any);

    const request = new NextRequest('http://localhost:3100/api/user/owned-assets', {
      method: 'POST',
      body: JSON.stringify({
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        purchasePrice: 100,
        quantity: 2,
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBe('asset-1');
  });

  it('returns 400 for missing required fields', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-1' } as any);

    const request = new NextRequest('http://localhost:3100/api/user/owned-assets', {
      method: 'POST',
      body: JSON.stringify({
        itemType: 'event',
        // missing required fields
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Missing required fields');
  });

  it('returns 400 for invalid item type', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-1' } as any);

    const request = new NextRequest('http://localhost:3100/api/user/owned-assets', {
      method: 'POST',
      body: JSON.stringify({
        itemType: 'invalid',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        purchasePrice: 100,
        quantity: 2,
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Invalid item type');
  });

  it('returns 400 for invalid quantity', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-1' } as any);

    const requestBody = {
      itemType: 'event',
      itemId: 'event-1',
      itemName: 'Test Event',
      itemImageUrl: '/test.jpg',
      purchasePrice: 100,
      quantity: 0, // invalid quantity
    };

    const request = new NextRequest('http://localhost:3100/api/user/owned-assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Quantity must be greater than 0');
  });

  it('returns 400 for invalid purchase price', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-1' } as any);

    const requestBody = {
      itemType: 'event',
      itemId: 'event-1',
      itemName: 'Test Event',
      itemImageUrl: '/test.jpg',
      purchasePrice: 0, // invalid purchase price
      quantity: 2,
    };

    const request = new NextRequest('http://localhost:3100/api/user/owned-assets', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(requestBody),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Purchase price must be greater than 0');
  });
});
