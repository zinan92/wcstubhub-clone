import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from '@/app/api/admin/events/route';
import { GET as getById, PUT, DELETE } from '@/app/api/admin/events/[id]/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock NextAuth
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

import { getServerSession } from 'next-auth';

describe('GET /api/admin/events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all events for admin user', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/events');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('title');
      expect(data[0]).toHaveProperty('type');
      expect(data[0]).toHaveProperty('date');
      expect(data[0]).toHaveProperty('venue');
      expect(data[0]).toHaveProperty('price');
    }
  });

  it('should return 401 for unauthenticated requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/admin/events');
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

    const request = new NextRequest('http://localhost:3100/api/admin/events');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden: Admin access required');
  });
});

describe('POST /api/admin/events', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create football event with valid data', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const eventData = {
      title: 'Test Match: USA VS Canada',
      type: 'football',
      team1: 'USA',
      team2: 'Canada',
      team1Flag: 'https://flagcdn.com/w40/us.png',
      team2Flag: 'https://flagcdn.com/w40/ca.png',
      date: new Date('2026-06-15T20:00:00Z').toISOString(),
      venue: 'Test Stadium',
      price: 150,
      description: 'Test football match',
      remainingQty: 1000,
    };

    const request = new NextRequest('http://localhost:3100/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data.title).toBe(eventData.title);
    expect(data.type).toBe(eventData.type);
    expect(data.team1).toBe(eventData.team1);
    expect(data.team2).toBe(eventData.team2);
    expect(data.price).toBe(eventData.price);

    // Cleanup
    await prisma.event.delete({ where: { id: data.id } });
  });

  it('should create basketball event with valid data', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const eventData = {
      title: 'Lakers VS Warriors',
      type: 'basketball',
      team1: 'Lakers',
      team2: 'Warriors',
      date: new Date('2026-07-20T19:30:00Z').toISOString(),
      venue: 'Crypto.com Arena',
      price: 200,
      description: 'NBA game',
      remainingQty: 800,
    };

    const request = new NextRequest('http://localhost:3100/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data.title).toBe(eventData.title);
    expect(data.type).toBe(eventData.type);
    expect(data.team1).toBe(eventData.team1);
    expect(data.team2).toBe(eventData.team2);

    // Cleanup
    await prisma.event.delete({ where: { id: data.id } });
  });

  it('should create concert event with valid data', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const eventData = {
      title: 'Taylor Swift Live',
      type: 'concert',
      artistName: 'Taylor Swift',
      artistImageUrl: 'https://via.placeholder.com/200',
      date: new Date('2026-08-10T20:00:00Z').toISOString(),
      venue: 'Madison Square Garden',
      price: 250,
      description: 'Concert event',
      remainingQty: 5000,
    };

    const request = new NextRequest('http://localhost:3100/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(eventData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data.title).toBe(eventData.title);
    expect(data.type).toBe(eventData.type);
    expect(data.artistName).toBe(eventData.artistName);

    // Cleanup
    await prisma.event.delete({ where: { id: data.id } });
  });

  it('should return 400 for missing required fields', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const invalidData = {
      description: 'Missing required fields',
    };

    const request = new NextRequest('http://localhost:3100/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(invalidData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should return 400 for invalid price (negative or zero)', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const invalidData = {
      title: 'Test Event',
      type: 'football',
      team1: 'TeamA',
      team2: 'TeamB',
      date: new Date('2026-06-15T20:00:00Z').toISOString(),
      venue: 'Test Venue',
      price: -50,
      remainingQty: 100,
    };

    const request = new NextRequest('http://localhost:3100/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(invalidData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should return 400 for invalid event type', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const invalidData = {
      title: 'Test Event',
      type: 'invalid_type',
      date: new Date('2026-06-15T20:00:00Z').toISOString(),
      venue: 'Test Venue',
      price: 100,
      remainingQty: 100,
    };

    const request = new NextRequest('http://localhost:3100/api/admin/events', {
      method: 'POST',
      body: JSON.stringify(invalidData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should return 401 for unauthenticated requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/admin/events', {
      method: 'POST',
      body: JSON.stringify({ title: 'Test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});

describe('PUT /api/admin/events/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update event with valid data', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    // Create a test event first
    const event = await prisma.event.create({
      data: {
        title: 'Original Event',
        type: 'football',
        team1: 'TeamA',
        team2: 'TeamB',
        date: new Date('2026-06-15T20:00:00Z'),
        venue: 'Original Stadium',
        price: 100,
        remainingQty: 500,
      },
    });

    const updateData = {
      title: 'Updated Event',
      price: 150,
      venue: 'Updated Stadium',
    };

    const request = new NextRequest(
      `http://localhost:3100/api/admin/events/${event.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updateData),
      }
    );

    const response = await PUT(request, { params: Promise.resolve({ id: event.id }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.title).toBe(updateData.title);
    expect(data.price).toBe(updateData.price);
    expect(data.venue).toBe(updateData.venue);

    // Cleanup
    await prisma.event.delete({ where: { id: event.id } });
  });

  it('should return 404 for non-existent event', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest(
      'http://localhost:3100/api/admin/events/non-existent-id',
      {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated' }),
      }
    );

    const response = await PUT(request, { params: Promise.resolve({ id: 'non-existent-id' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBeDefined();
  });

  it('should return 401 for unauthenticated requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest(
      'http://localhost:3100/api/admin/events/some-id',
      {
        method: 'PUT',
        body: JSON.stringify({ title: 'Updated' }),
      }
    );

    const response = await PUT(request, { params: Promise.resolve({ id: 'some-id' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});

describe('DELETE /api/admin/events/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete event successfully', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    // Create a test event first
    const event = await prisma.event.create({
      data: {
        title: 'Event to Delete',
        type: 'football',
        team1: 'TeamA',
        team2: 'TeamB',
        date: new Date('2026-06-15T20:00:00Z'),
        venue: 'Test Stadium',
        price: 100,
        remainingQty: 500,
      },
    });

    const request = new NextRequest(
      `http://localhost:3100/api/admin/events/${event.id}`,
      { method: 'DELETE' }
    );

    const response = await DELETE(request, { params: Promise.resolve({ id: event.id }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBeDefined();

    // Verify event is deleted
    const deletedEvent = await prisma.event.findUnique({
      where: { id: event.id },
    });
    expect(deletedEvent).toBeNull();
  });

  it('should return 404 for non-existent event', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest(
      'http://localhost:3100/api/admin/events/non-existent-id',
      { method: 'DELETE' }
    );

    const response = await DELETE(request, { params: Promise.resolve({ id: 'non-existent-id' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBeDefined();
  });

  it('should return 401 for unauthenticated requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest(
      'http://localhost:3100/api/admin/events/some-id',
      { method: 'DELETE' }
    );

    const response = await DELETE(request, { params: Promise.resolve({ id: 'some-id' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});

describe('GET /api/admin/events/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return event by id for admin user', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    // Get an event from the database
    const event = await prisma.event.findFirst();
    
    if (event) {
      const request = new NextRequest(
        `http://localhost:3100/api/admin/events/${event.id}`
      );

      const response = await getById(request, { params: Promise.resolve({ id: event.id }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(event.id);
      expect(data.title).toBe(event.title);
    }
  });

  it('should return 404 for non-existent event', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest(
      'http://localhost:3100/api/admin/events/non-existent-id'
    );

    const response = await getById(request, { params: Promise.resolve({ id: 'non-existent-id' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBeDefined();
  });
});
