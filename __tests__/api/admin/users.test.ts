import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET } from '@/app/api/admin/users/route';
import { NextRequest } from 'next/server';

// Mock NextAuth
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

import { getServerSession } from 'next-auth';

describe('GET /api/admin/users', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all users for admin user', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/users');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      const user = data[0];
      expect(user).toHaveProperty('id');
      expect(user).toHaveProperty('email');
      expect(user).toHaveProperty('name');
      expect(user).toHaveProperty('role');
      expect(user).toHaveProperty('vipLevel');
      expect(user).toHaveProperty('createdAt');
      // Password should NOT be returned
      expect(user).not.toHaveProperty('password');
    }
  });

  it('should return users ordered by creation date (newest first)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/users');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);

    // Verify sorting if we have multiple users
    if (data.length > 1) {
      const firstDate = new Date(data[0].createdAt);
      const secondDate = new Date(data[1].createdAt);
      expect(firstDate.getTime()).toBeGreaterThanOrEqual(secondDate.getTime());
    }
  });

  it('should return 401 for unauthenticated requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/admin/users');
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

    const request = new NextRequest('http://localhost:3100/api/admin/users');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden: Admin access required');
  });

  it('should exclude password field from user objects', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/users');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);

    // Verify no user object contains password
    data.forEach((user: any) => {
      expect(user).not.toHaveProperty('password');
    });
  });

  it('should include VIP level and account status fields', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/users');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);

    if (data.length > 0) {
      const user = data[0];
      expect(user).toHaveProperty('vipLevel');
      expect(typeof user.vipLevel).toBe('number');
      expect(user).toHaveProperty('role');
    }
  });
});
