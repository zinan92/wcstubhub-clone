import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/admin/stats/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock NextAuth
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

import { getServerSession } from 'next-auth';

describe('GET /api/admin/stats', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return stats for authenticated admin user', async () => {
    // Mock admin session
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/stats');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('users');
    expect(data).toHaveProperty('products');
    expect(data).toHaveProperty('events');
    expect(data).toHaveProperty('orders');
    expect(typeof data.users).toBe('number');
    expect(typeof data.products).toBe('number');
    expect(typeof data.events).toBe('number');
    expect(typeof data.orders).toBe('number');
  });

  it('should return 401 for unauthenticated requests', async () => {
    // Mock no session
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/admin/stats');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 403 for non-admin users', async () => {
    // Mock regular user session
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-id', email: 'user@example.com', role: 'user' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/stats');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden: Admin access required');
  });

  it('should return correct counts from database', async () => {
    // Mock admin session
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    // Get actual counts from database
    const userCount = await prisma.user.count();
    const productCount = await prisma.product.count();
    const eventCount = await prisma.event.count();
    const orderCount = await prisma.order.count();

    const request = new NextRequest('http://localhost:3100/api/admin/stats');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.users).toBe(userCount);
    expect(data.products).toBe(productCount);
    expect(data.events).toBe(eventCount);
    expect(data.orders).toBe(orderCount);
  });

  it('should handle database errors gracefully', async () => {
    // Mock admin session
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    // Mock prisma to throw error
    const originalCount = prisma.user.count;
    prisma.user.count = vi.fn().mockRejectedValue(new Error('Database error'));

    const request = new NextRequest('http://localhost:3100/api/admin/stats');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(500);
    expect(data.error).toBe('Internal server error');

    // Restore original function
    prisma.user.count = originalCount;
  });
});
