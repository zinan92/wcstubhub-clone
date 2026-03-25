import { describe, it, expect, beforeAll, afterAll } from 'vitest';
import { GET } from '@/app/api/products/[id]/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

describe('GET /api/products/[id]', () => {
  let testProductId: string;

  beforeAll(async () => {
    // Create a test product
    const product = await prisma.product.create({
      data: {
        name: 'Test Product for Detail View',
        description: 'This is a detailed description of the test product with all the information a customer needs.',
        imageUrl: 'https://picsum.photos/seed/testproduct/400/400',
        price: 149.99,
        category: 'jersey',
        stock: 50,
        remainingQty: 50,
      },
    });
    testProductId = product.id;
  });

  afterAll(async () => {
    // Clean up test product
    await prisma.product.delete({
      where: { id: testProductId },
    });
  });

  it('should return product details for valid ID', async () => {
    const request = {} as NextRequest;
    const response = await GET(request, { params: Promise.resolve({ id: testProductId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toMatchObject({
      id: testProductId,
      name: 'Test Product for Detail View',
      description: 'This is a detailed description of the test product with all the information a customer needs.',
      price: 149.99,
      remainingQty: 50,
    });
    expect(data.imageUrl).toBeDefined();
  });

  it('should return 404 for non-existent product ID', async () => {
    const request = {} as NextRequest;
    const response = await GET(request, { params: Promise.resolve({ id: 'nonexistent123' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBeDefined();
  });

  it('should include all required fields in response', async () => {
    const request = {} as NextRequest;
    const response = await GET(request, { params: Promise.resolve({ id: testProductId }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data).toHaveProperty('id');
    expect(data).toHaveProperty('name');
    expect(data).toHaveProperty('description');
    expect(data).toHaveProperty('price');
    expect(data).toHaveProperty('imageUrl');
    expect(data).toHaveProperty('remainingQty');
  });
});
