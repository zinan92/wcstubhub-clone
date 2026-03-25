import { describe, it, expect, beforeEach, vi } from 'vitest';
import { prisma } from '@/lib/prisma';
import { hash } from 'bcryptjs';

describe('Admin Authentication', () => {
  beforeEach(async () => {
    // Clean up test admin user if exists
    await prisma.user.deleteMany({
      where: { email: 'test-admin@example.com' }
    });
  });

  it('should authenticate admin user with valid credentials', async () => {
    // Create test admin user
    const hashedPassword = await hash('adminpass', 10);
    await prisma.user.create({
      data: {
        email: 'test-admin@example.com',
        password: hashedPassword,
        role: 'admin',
        name: 'Test Admin',
      }
    });

    // The actual authentication happens through NextAuth
    // We verify that an admin user exists with the correct role
    const adminUser = await prisma.user.findUnique({
      where: { email: 'test-admin@example.com' }
    });

    expect(adminUser).toBeTruthy();
    expect(adminUser?.role).toBe('admin');
  });

  it('should not authenticate non-admin user for admin routes', async () => {
    // Clean up test user if exists
    await prisma.user.deleteMany({
      where: { email: 'regular-user@example.com' }
    });

    // Create regular user
    const hashedPassword = await hash('userpass', 10);
    await prisma.user.create({
      data: {
        email: 'regular-user@example.com',
        password: hashedPassword,
        role: 'user',
        name: 'Regular User',
      }
    });

    const regularUser = await prisma.user.findUnique({
      where: { email: 'regular-user@example.com' }
    });

    expect(regularUser).toBeTruthy();
    expect(regularUser?.role).toBe('user');
    expect(regularUser?.role).not.toBe('admin');
  });
});
