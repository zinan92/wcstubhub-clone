import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET, POST } from '@/app/api/user/listings/route';
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
    listing: {
      findMany: vi.fn(),
      create: vi.fn(),
    },
    ownedAsset: {
      findFirst: vi.fn(),
      update: vi.fn(),
    },
    $transaction: vi.fn(),
  },
}));

describe('GET /api/user/listings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/user/listings');
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

    const request = new NextRequest('http://localhost:3100/api/user/listings');
    const response = await GET(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('User not found');
  });

  it('returns listings for authenticated user', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockListings = [
      {
        id: 'listing-1',
        sellerId: 'user-1',
        ownedAssetId: null,
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        askPrice: 120,
        quantity: 2,
        status: 'active',
        referenceNumber: 'LST-20260326-ABC123',
        listedAt: new Date(),
        soldAt: null,
        cancelledAt: null,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
    ];

    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    vi.mocked(prisma.listing.findMany).mockResolvedValue(mockListings as any);

    const request = new NextRequest('http://localhost:3100/api/user/listings');
    const response = await GET(request);

    expect(response.status).toBe(200);
    const data = await response.json();
    expect(data).toMatchObject(mockListings.map((listing) => ({
      ...listing,
      createdAt: expect.any(String),
      updatedAt: expect.any(String),
      listedAt: expect.any(String),
    })));
  });

  it('handles database errors gracefully', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3100/api/user/listings');
    const response = await GET(request);

    expect(response.status).toBe(500);
    const data = await response.json();
    expect(data.error).toBe('Failed to fetch listings');
  });
});

describe('POST /api/user/listings', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns 401 if user is not authenticated', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/user/listings', {
      method: 'POST',
      body: JSON.stringify({
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        askPrice: 120,
        quantity: 2,
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(401);
    const data = await response.json();
    expect(data.error).toBe('Unauthorized');
  });

  it('creates listing for authenticated user', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockListing = {
      id: 'listing-1',
      sellerId: 'user-1',
      ownedAssetId: null,
      itemType: 'event',
      itemId: 'event-1',
      itemName: 'Test Event',
      itemImageUrl: '/test.jpg',
      askPrice: 120,
      quantity: 2,
      status: 'active',
      referenceNumber: 'LST-20260326-ABC123',
      listedAt: new Date(),
      soldAt: null,
      cancelledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    
    // Mock $transaction to execute the callback with a transaction object
    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        listing: {
          create: vi.fn().mockResolvedValue(mockListing),
        },
        ownedAsset: {
          findFirst: vi.fn(),
          update: vi.fn(),
        },
      };
      return callback(tx);
    });

    const request = new NextRequest('http://localhost:3100/api/user/listings', {
      method: 'POST',
      body: JSON.stringify({
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        askPrice: 120,
        quantity: 2,
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBe('listing-1');
  });

  it('returns 400 for missing required fields', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-1' } as any);

    const request = new NextRequest('http://localhost:3100/api/user/listings', {
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
      askPrice: 120,
      quantity: 0, // invalid quantity
    };

    const request = new NextRequest('http://localhost:3100/api/user/listings', {
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

  it('returns 400 for invalid ask price', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue({ id: 'user-1' } as any);

    const request = new NextRequest('http://localhost:3100/api/user/listings', {
      method: 'POST',
      body: JSON.stringify({
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        askPrice: 0,
        quantity: 2,
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Ask price must be greater than 0');
  });

  it('creates listing with ownedAssetId and updates owned asset quantity', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockOwnedAsset = {
      id: 'asset-1',
      userId: 'user-1',
      quantityAvailable: 5,
      status: 'confirmed',
    };
    const mockListing = {
      id: 'listing-1',
      sellerId: 'user-1',
      ownedAssetId: 'asset-1',
      itemType: 'event',
      itemId: 'event-1',
      itemName: 'Test Event',
      itemImageUrl: '/test.jpg',
      askPrice: 120,
      quantity: 2,
      status: 'active',
      referenceNumber: 'LST-20260326-ABC123',
      listedAt: new Date(),
      soldAt: null,
      cancelledAt: null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    
    // Mock $transaction to execute the callback with proper owned asset validation
    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        listing: {
          create: vi.fn().mockResolvedValue(mockListing),
        },
        ownedAsset: {
          findFirst: vi.fn().mockResolvedValue(mockOwnedAsset),
          update: vi.fn().mockResolvedValue({
            ...mockOwnedAsset,
            quantityAvailable: 3,
          }),
        },
      };
      return callback(tx);
    });

    const request = new NextRequest('http://localhost:3100/api/user/listings', {
      method: 'POST',
      body: JSON.stringify({
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        askPrice: 120,
        quantity: 2,
        ownedAssetId: 'asset-1',
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(201);
    const data = await response.json();
    expect(data.id).toBe('listing-1');
    expect(data.ownedAssetId).toBe('asset-1');
  });

  it('returns 404 when ownedAssetId does not exist or does not belong to user', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };

    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    
    // Mock $transaction to simulate owned asset not found
    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        ownedAsset: {
          findFirst: vi.fn().mockResolvedValue(null),
        },
      };
      return callback(tx);
    });

    const request = new NextRequest('http://localhost:3100/api/user/listings', {
      method: 'POST',
      body: JSON.stringify({
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        askPrice: 120,
        quantity: 2,
        ownedAssetId: 'asset-999',
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(404);
    const data = await response.json();
    expect(data.error).toBe('Owned asset not found or does not belong to user');
  });

  it('returns 400 when insufficient quantity available in owned asset', async () => {
    const mockUser = { id: 'user-1', email: 'test@example.com' };
    const mockOwnedAsset = {
      id: 'asset-1',
      userId: 'user-1',
      quantityAvailable: 1, // Only 1 available, but trying to list 2
      status: 'confirmed',
    };

    vi.mocked(getServerSession).mockResolvedValue({
      user: { email: 'test@example.com' },
    } as any);
    vi.mocked(prisma.user.findUnique).mockResolvedValue(mockUser as any);
    
    // Mock $transaction to simulate insufficient quantity
    vi.mocked(prisma.$transaction).mockImplementation(async (callback: any) => {
      const tx = {
        ownedAsset: {
          findFirst: vi.fn().mockResolvedValue(mockOwnedAsset),
        },
      };
      return callback(tx);
    });

    const request = new NextRequest('http://localhost:3100/api/user/listings', {
      method: 'POST',
      body: JSON.stringify({
        itemType: 'event',
        itemId: 'event-1',
        itemName: 'Test Event',
        itemImageUrl: '/test.jpg',
        askPrice: 120,
        quantity: 2,
        ownedAssetId: 'asset-1',
      }),
    });
    const response = await POST(request);

    expect(response.status).toBe(400);
    const data = await response.json();
    expect(data.error).toBe('Insufficient quantity available for listing');
  });
});
