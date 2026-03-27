import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/search/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock the prisma client
vi.mock('@/lib/prisma', () => ({
  prisma: {
    product: {
      findMany: vi.fn(),
    },
    event: {
      findMany: vi.fn(),
    },
  },
}));

describe('GET /api/search', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('returns products matching query by name', async () => {
    const mockProducts = [
      { id: 'p1', name: 'Brazil Jersey 2026', price: 89.99, imageUrl: 'https://example.com/jersey.png' },
      { id: 'p2', name: 'Team Brazil Scarf', price: 29.99, imageUrl: 'https://example.com/scarf.png' },
    ];
    const mockEvents = [
      { id: 'e1', title: 'Brazil vs Argentina', team1: 'Brazil', team2: 'Argentina', type: 'football' },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=jersey');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('products');
    expect(data).toHaveProperty('events');
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toContain('Jersey');
    expect(data.events).toHaveLength(0);
  });

  it('returns events matching query by team1', async () => {
    const mockProducts = [
      { id: 'p1', name: 'Spain Jersey', price: 89.99 },
    ];
    const mockEvents = [
      { id: 'e1', title: 'Brazil vs Argentina', team1: 'Brazil', team2: 'Argentina', type: 'football' },
      { id: 'e2', title: 'Brazil vs France', team1: 'Brazil', team2: 'France', type: 'football' },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=brazil');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.products).toHaveLength(0);
    expect(data.events).toHaveLength(2);
    expect(data.events[0].team1).toBe('Brazil');
  });

  it('returns events matching query by team2', async () => {
    const mockProducts: any[] = [];
    const mockEvents = [
      { id: 'e1', title: 'Brazil vs Argentina', team1: 'Brazil', team2: 'Argentina', type: 'football' },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=argentina');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.events).toHaveLength(1);
    expect(data.events[0].team2).toBe('Argentina');
  });

  it('returns events matching query by artistName', async () => {
    const mockProducts: any[] = [];
    const mockEvents = [
      { id: 'e1', title: 'Taylor Swift Live', artistName: 'Taylor Swift', type: 'concert' },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=taylor');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.events).toHaveLength(1);
    expect(data.events[0].artistName).toContain('Taylor');
  });

  it('returns events matching query by title', async () => {
    const mockProducts: any[] = [];
    const mockEvents = [
      { id: 'e1', title: 'Rock Festival 2026', artistName: 'Various Artists', type: 'concert' },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=festival');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.events).toHaveLength(1);
    expect(data.events[0].title).toContain('Festival');
  });

  it('is case insensitive', async () => {
    const mockProducts = [
      { id: 'p1', name: 'Brazil Jersey 2026', price: 89.99 },
    ];
    const mockEvents: any[] = [];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=JERSEY');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.products).toHaveLength(1);
    expect(data.products[0].name).toContain('Jersey');
  });

  it('returns empty arrays for no matches', async () => {
    const mockProducts = [
      { id: 'p1', name: 'Brazil Jersey', price: 89.99 },
    ];
    const mockEvents = [
      { id: 'e1', title: 'Brazil vs Argentina', team1: 'Brazil', team2: 'Argentina' },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=xyznonexistent');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ products: [], events: [] });
  });

  it('returns trending items for empty query', async () => {
    const mockProducts = [
      { id: 'p1', name: 'Product 1', price: 89.99, isBestValue: true },
      { id: 'p2', name: 'Product 2', price: 79.99, isSellingFast: true },
      { id: 'p3', name: 'Product 3', price: 69.99, isBestValue: false },
    ];
    const mockEvents = [
      { id: 'e1', title: 'Event 1', isBestValue: true, date: new Date() },
      { id: 'e2', title: 'Event 2', isSellingFast: true, date: new Date() },
      { id: 'e3', title: 'Event 3', isBestValue: false, date: new Date() },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.events.length).toBeGreaterThan(0);
    // Should prioritize items with isBestValue or isSellingFast
  });

  it('returns trending items for whitespace-only query', async () => {
    const mockProducts = [
      { id: 'p1', name: 'Product 1', price: 89.99, isBestValue: true },
    ];
    const mockEvents = [
      { id: 'e1', title: 'Event 1', isBestValue: true, date: new Date() },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=%20%20%20');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.products.length).toBeGreaterThan(0);
    expect(data.events.length).toBeGreaterThan(0);
  });

  it('handles special characters safely', async () => {
    const mockProducts = [
      { id: 'p1', name: 'Brazil Jersey', price: 89.99 },
    ];
    const mockEvents: any[] = [];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=%24%26%2A%28%29');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('products');
    expect(data).toHaveProperty('events');
  });

  it('handles very long query strings', async () => {
    const mockProducts: any[] = [];
    const mockEvents: any[] = [];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const longQuery = 'a'.repeat(500);
    const request = new NextRequest(`http://localhost:3000/api/search?q=${longQuery}`);
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toEqual({ products: [], events: [] });
  });

  it('handles database errors gracefully', async () => {
    vi.mocked(prisma.product.findMany).mockRejectedValue(new Error('Database error'));
    vi.mocked(prisma.event.findMany).mockResolvedValue([]);

    const request = new NextRequest('http://localhost:3000/api/search?q=jersey');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data).toHaveProperty('error');
  });

  it('returns both products and events matching the same query', async () => {
    const mockProducts = [
      { id: 'p1', name: 'Brazil Home Jersey', price: 89.99 },
    ];
    const mockEvents = [
      { id: 'e1', title: 'Brazil vs Argentina', team1: 'Brazil', team2: 'Argentina', type: 'football' },
    ];

    vi.mocked(prisma.product.findMany).mockResolvedValue(mockProducts as any);
    vi.mocked(prisma.event.findMany).mockResolvedValue(mockEvents as any);

    const request = new NextRequest('http://localhost:3000/api/search?q=brazil');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.products).toHaveLength(1);
    expect(data.events).toHaveLength(1);
    expect(data.products[0].name).toContain('Brazil');
    expect(data.events[0].team1).toBe('Brazil');
  });
});
