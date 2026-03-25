import { describe, it, expect, beforeEach } from 'vitest';
import { GET } from '@/app/api/events/route';
import { NextRequest } from 'next/server';

// Helper to create mock request
function createMockRequest(url: string): NextRequest {
  return {
    nextUrl: new URL(url),
  } as NextRequest;
}

describe('GET /api/events', () => {
  it('returns all events when no filters applied', async () => {
    const request = createMockRequest('http://localhost:3100/api/events');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThan(0);
    
    // Should have events of all types
    const types = data.map((event: any) => event.type);
    expect(types).toContain('football');
  });

  it('filters events by type=football', async () => {
    const request = createMockRequest('http://localhost:3100/api/events?type=football');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    
    // All events should be football type
    data.forEach((event: any) => {
      expect(event.type).toBe('football');
      expect(event).toHaveProperty('team1');
      expect(event).toHaveProperty('team2');
      expect(event).toHaveProperty('team1Flag');
      expect(event).toHaveProperty('team2Flag');
    });
  });

  it('filters events by type=basketball', async () => {
    const request = createMockRequest('http://localhost:3100/api/events?type=basketball');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    
    // All events should be basketball type
    data.forEach((event: any) => {
      expect(event.type).toBe('basketball');
    });
  });

  it('filters events by type=concert', async () => {
    const request = createMockRequest('http://localhost:3100/api/events?type=concert');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    
    // All events should be concert type
    data.forEach((event: any) => {
      expect(event.type).toBe('concert');
      expect(event).toHaveProperty('artistName');
    });
  });

  it('searches football events by team name with q parameter', async () => {
    const request = createMockRequest('http://localhost:3100/api/events?type=football&q=Argentina');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    
    // Should find Jordan VS Argentina match
    const argentineMatch = data.find((event: any) => 
      event.team1?.toLowerCase().includes('argentina') || 
      event.team2?.toLowerCase().includes('argentina')
    );
    expect(argentineMatch).toBeDefined();
  });

  it('returns empty array when no events match search', async () => {
    const request = createMockRequest('http://localhost:3100/api/events?type=football&q=NonexistentTeam');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  it('search is case-insensitive', async () => {
    const request = createMockRequest('http://localhost:3100/api/events?type=football&q=jordan');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.length).toBeGreaterThan(0);
    
    const jordanMatch = data.find((event: any) => 
      event.team1?.toLowerCase().includes('jordan') || 
      event.team2?.toLowerCase().includes('jordan')
    );
    expect(jordanMatch).toBeDefined();
  });
});
