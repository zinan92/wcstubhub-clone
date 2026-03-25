import { describe, it, expect, vi, beforeEach } from 'vitest';
import { GET } from '@/app/api/user/profile/route';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';

// Mock next-auth
vi.mock('next-auth', () => ({
  getServerSession: vi.fn(),
}));

describe('GET /api/user/profile', () => {
  let testUserId: string;

  beforeEach(async () => {
    // Get the seeded test user ID
    const testUser = await prisma.user.findUnique({
      where: { email: 'test@example.com' },
    });
    testUserId = testUser?.id || '';
  });

  it('returns user profile data when authenticated', async () => {
    // Mock authenticated session with actual test user
    vi.mocked(getServerSession).mockResolvedValue({
      user: {
        id: testUserId,
        email: 'test@example.com',
        role: 'user',
      },
      expires: '2025-01-01',
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('email');
    expect(data.email).toBe('test@example.com');
    expect(data).toHaveProperty('vipLevel');
    expect(data.vipLevel).toBe(2);
    expect(data).toHaveProperty('inviteCode');
    expect(data).toHaveProperty('creditPoints');
    expect(data).toHaveProperty('balance');
    expect(data.balance).toBe(35640);
    expect(data).toHaveProperty('sharesHeld');
    expect(data.sharesHeld).toBe(300);
    expect(data).toHaveProperty('integrationPoints');
    expect(data.integrationPoints).toBe(3240);
    expect(data).toHaveProperty('avatarUrl');
    expect(typeof data.balance).toBe('number');
    expect(typeof data.vipLevel).toBe('number');
  });

  it('returns 401 when not authenticated', async () => {
    // Mock unauthenticated session
    vi.mocked(getServerSession).mockResolvedValue(null);

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data).toHaveProperty('error');
  });

  it('returns 404 when user not found in database', async () => {
    // Mock session with non-existent user
    vi.mocked(getServerSession).mockResolvedValue({
      user: {
        id: 'non-existent-user-id',
        email: 'nonexistent@example.com',
        role: 'user',
      },
      expires: '2025-01-01',
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
  });

  it('does not include sensitive password field', async () => {
    // Mock authenticated session with actual test user
    vi.mocked(getServerSession).mockResolvedValue({
      user: {
        id: testUserId,
        email: 'test@example.com',
        role: 'user',
      },
      expires: '2025-01-01',
    });

    const response = await GET();
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).not.toHaveProperty('password');
  });
});
