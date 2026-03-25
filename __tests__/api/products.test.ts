import { describe, it, expect } from 'vitest';
import { GET } from '@/app/api/products/route';
import { NextRequest } from 'next/server';

// Helper to create mock request
function createMockRequest(url: string): NextRequest {
  return {
    nextUrl: new URL(url),
  } as NextRequest;
}

describe('GET /api/products', () => {
  it('returns all products when no search query', async () => {
    const request = createMockRequest('http://localhost:3100/api/products');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(4); // Per VAL-SEED-001
    
    // Check product structure
    if (data.length > 0) {
      const product = data[0];
      expect(product).toHaveProperty('id');
      expect(product).toHaveProperty('name');
      expect(product).toHaveProperty('price');
      expect(product).toHaveProperty('imageUrl');
      expect(typeof product.price).toBe('number');
    }
  });

  it('filters products by name with search query (case-insensitive)', async () => {
    const request = createMockRequest('http://localhost:3100/api/products?q=messi');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    
    // All returned products should contain 'messi' in the name (case-insensitive)
    data.forEach((product: any) => {
      expect(product.name.toLowerCase()).toContain('messi');
    });
  });

  it('returns empty array when no products match search query', async () => {
    const request = createMockRequest('http://localhost:3100/api/products?q=zzzzzzzzz');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBe(0);
  });

  it('handles empty search query parameter', async () => {
    const request = createMockRequest('http://localhost:3100/api/products?q=');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    expect(data.length).toBeGreaterThanOrEqual(4); // Should return all products
  });
});
