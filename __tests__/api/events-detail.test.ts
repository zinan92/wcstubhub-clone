import { describe, it, expect, beforeAll } from 'vitest';
import { GET as getEventById } from '@/app/api/events/[id]/route';
import { GET as getEvents } from '@/app/api/events/route';
import { NextRequest } from 'next/server';

// Helper to create mock request
function createMockRequest(url: string): NextRequest {
  return {
    nextUrl: new URL(url),
  } as NextRequest;
}

describe('GET /api/events/[id]', () => {
  let footballEventId: string;
  let basketballEventId: string;
  let concertEventId: string;

  beforeAll(async () => {
    // Get sample event IDs for testing
    const footballRequest = createMockRequest('http://localhost:3100/api/events?type=football');
    const footballResponse = await getEvents(footballRequest);
    const footballEvents = await footballResponse.json();
    footballEventId = footballEvents[0].id;

    const basketballRequest = createMockRequest('http://localhost:3100/api/events?type=basketball');
    const basketballResponse = await getEvents(basketballRequest);
    const basketballEvents = await basketballResponse.json();
    basketballEventId = basketballEvents[0].id;

    const concertRequest = createMockRequest('http://localhost:3100/api/events?type=concert');
    const concertResponse = await getEvents(concertRequest);
    const concertEvents = await concertResponse.json();
    concertEventId = concertEvents[0].id;
  });

  it('returns event details for valid football event ID', async () => {
    const request = createMockRequest(`http://localhost:3100/api/events/${footballEventId}`);
    const params = Promise.resolve({ id: footballEventId });
    const response = await getEventById(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id', footballEventId);
    expect(data).toHaveProperty('title');
    expect(data).toHaveProperty('type', 'football');
    expect(data).toHaveProperty('team1');
    expect(data).toHaveProperty('team2');
    expect(data).toHaveProperty('team1Flag');
    expect(data).toHaveProperty('team2Flag');
    expect(data).toHaveProperty('date');
    expect(data).toHaveProperty('venue');
    expect(data).toHaveProperty('price');
    expect(data).toHaveProperty('remainingQty');
  });

  it('returns event details for valid basketball event ID', async () => {
    const request = createMockRequest(`http://localhost:3100/api/events/${basketballEventId}`);
    const params = Promise.resolve({ id: basketballEventId });
    const response = await getEventById(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id', basketballEventId);
    expect(data).toHaveProperty('type', 'basketball');
    expect(data).toHaveProperty('team1');
    expect(data).toHaveProperty('team2');
  });

  it('returns event details for valid concert event ID', async () => {
    const request = createMockRequest(`http://localhost:3100/api/events/${concertEventId}`);
    const params = Promise.resolve({ id: concertEventId });
    const response = await getEventById(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id', concertEventId);
    expect(data).toHaveProperty('type', 'concert');
    expect(data).toHaveProperty('artistName');
    expect(data).toHaveProperty('artistImageUrl');
  });

  it('returns 404 for non-existent event ID', async () => {
    const request = createMockRequest('http://localhost:3100/api/events/nonexistent123');
    const params = Promise.resolve({ id: 'nonexistent123' });
    const response = await getEventById(request, { params });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data).toHaveProperty('error');
  });

  it('includes description field if present', async () => {
    const request = createMockRequest(`http://localhost:3100/api/events/${footballEventId}`);
    const params = Promise.resolve({ id: footballEventId });
    const response = await getEventById(request, { params });
    const data = await response.json();

    expect(response.status).toBe(200);
    // Description may be null or string
    expect(data).toHaveProperty('description');
  });
});
