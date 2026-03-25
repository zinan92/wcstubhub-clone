import { describe, it, expect, beforeEach, vi } from 'vitest';
import { POST } from '@/app/api/auth/register/route';
import { prisma } from '@/lib/prisma';
import { NextRequest } from 'next/server';

// Mock bcryptjs
vi.mock('bcryptjs', () => ({
  hash: vi.fn(() => Promise.resolve('hashed_password'))
}));

// Helper to create mock request
function createMockRequest(body: any): NextRequest {
  return {
    json: async () => body,
  } as NextRequest;
}

describe('POST /api/auth/register', () => {
  beforeEach(async () => {
    // Clean up test users
    await prisma.user.deleteMany({
      where: {
        OR: [
          { email: 'newuser@example.com' },
          { phone: '+1234567890' }
        ]
      }
    });
  });

  it('creates a new user with valid email and password', async () => {
    const request = createMockRequest({
      emailOrPhone: 'newuser@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe('Account created successfully');
    expect(data.user.email).toBe('newuser@example.com');
  });

  it('creates a new user with valid phone and password', async () => {
    const request = createMockRequest({
      emailOrPhone: '+1234567890',
      password: 'password123',
      confirmPassword: 'password123'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data.message).toBe('Account created successfully');
    expect(data.user.phone).toBe('+1234567890');
  });

  it('returns 400 for missing email/phone', async () => {
    const request = createMockRequest({
      password: 'password123',
      confirmPassword: 'password123'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email/phone and password are required');
  });

  it('returns 400 for missing password', async () => {
    const request = createMockRequest({
      emailOrPhone: 'newuser@example.com',
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Email/phone and password are required');
  });

  it('returns 400 for password mismatch', async () => {
    const request = createMockRequest({
      emailOrPhone: 'newuser@example.com',
      password: 'password123',
      confirmPassword: 'different123'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Passwords do not match');
  });

  it('returns 400 for short password', async () => {
    const request = createMockRequest({
      emailOrPhone: 'newuser@example.com',
      password: '12345',
      confirmPassword: '12345'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Password must be at least 6 characters long');
  });

  it('returns 400 for invalid email/phone format', async () => {
    const request = createMockRequest({
      emailOrPhone: 'notanemail',
      password: 'password123',
      confirmPassword: 'password123'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBe('Invalid email or phone format');
  });

  it('returns 409 for duplicate email', async () => {
    // First registration
    await POST(createMockRequest({
      emailOrPhone: 'newuser@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    }));

    // Duplicate registration
    const request = createMockRequest({
      emailOrPhone: 'newuser@example.com',
      password: 'password123',
      confirmPassword: 'password123'
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(409);
    expect(data.error).toBe('Account already exists with this email or phone');
  });
});
