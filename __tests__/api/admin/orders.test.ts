import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/admin/orders/route';
import { NextRequest } from 'next/server';

// Mock NextAuth
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

import { getServerSession } from 'next-auth';

describe('GET /api/admin/orders', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all orders for admin user', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/orders');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      const order = data[0];
      expect(order).toHaveProperty('id');
      expect(order).toHaveProperty('orderNumber');
      expect(order).toHaveProperty('itemName');
      expect(order).toHaveProperty('purchasePrice');
      expect(order).toHaveProperty('quantity');
      expect(order).toHaveProperty('status');
      expect(order).toHaveProperty('transactionTime');
      expect(order).toHaveProperty('user');
      expect(order.user).toHaveProperty('email');
    }
  });

  it('should filter orders by status when status query param is provided', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/orders?status=paid');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    
    // All returned orders should have status 'paid'
    data.forEach((order: any) => {
      expect(order.status).toBe('paid');
    });
  });

  it('should filter orders by to_be_paid status', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/orders?status=to_be_paid');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    
    // All returned orders should have status 'to_be_paid'
    data.forEach((order: any) => {
      expect(order.status).toBe('to_be_paid');
    });
  });

  it('should return all orders when status is "all" or empty', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request1 = new NextRequest('http://localhost:3100/api/admin/orders?status=all');
    const response1 = await GET(request1);
    const data1 = await response1.json();

    const request2 = new NextRequest('http://localhost:3100/api/admin/orders');
    const response2 = await GET(request2);
    const data2 = await response2.json();

    expect(response1.status).toBe(200);
    expect(response2.status).toBe(200);
    
    // Both should return the same number of orders (all orders)
    expect(data1.length).toBe(data2.length);
  });

  it('should return orders ordered by transaction time (newest first)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/orders');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);

    // Verify sorting if we have multiple orders
    if (data.length > 1) {
      const firstDate = new Date(data[0].transactionTime);
      const secondDate = new Date(data[1].transactionTime);
      expect(firstDate.getTime()).toBeGreaterThanOrEqual(secondDate.getTime());
    }
  });

  it('should include user email in order data', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/orders');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      const order = data[0];
      expect(order).toHaveProperty('user');
      expect(order.user).toHaveProperty('email');
      expect(typeof order.user.email).toBe('string');
    }
  });

  it('should return 401 for unauthenticated requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/admin/orders');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });

  it('should return 403 for non-admin users', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'user-id', email: 'user@example.com', role: 'user' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/orders');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden: Admin access required');
  });
});
