import { describe, it, expect, beforeEach, vi } from 'vitest';
import { GET, POST } from '@/app/api/admin/products/route';
import { GET as getById, PUT, DELETE } from '@/app/api/admin/products/[id]/route';
import { NextRequest } from 'next/server';
import { prisma } from '@/lib/prisma';

// Mock NextAuth
vi.mock('next-auth', () => ({
  default: vi.fn(),
  getServerSession: vi.fn(),
}));

import { getServerSession } from 'next-auth';

describe('GET /api/admin/products', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return all products for admin user', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest('http://localhost:3100/api/admin/products');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(Array.isArray(data)).toBe(true);
    if (data.length > 0) {
      expect(data[0]).toHaveProperty('id');
      expect(data[0]).toHaveProperty('name');
      expect(data[0]).toHaveProperty('price');
      expect(data[0]).toHaveProperty('category');
      expect(data[0]).toHaveProperty('stock');
    }
  });

  it('should return 401 for unauthenticated requests', async () => {
    vi.mocked(getServerSession).mockResolvedValue(null);

    const request = new NextRequest('http://localhost:3100/api/admin/products');
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

    const request = new NextRequest('http://localhost:3100/api/admin/products');
    const response = await GET(request);
    const data = await response.json();

    expect(response.status).toBe(403);
    expect(data.error).toBe('Forbidden: Admin access required');
  });
});

describe('POST /api/admin/products', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should create product with valid data', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const productData = {
      name: 'Test Product',
      description: 'Test description',
      imageUrl: 'https://via.placeholder.com/200',
      price: 99.99,
      category: 'jerseys',
      stock: 100,
    };

    const request = new NextRequest('http://localhost:3100/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(productData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(201);
    expect(data).toHaveProperty('id');
    expect(data.name).toBe(productData.name);
    expect(data.price).toBe(productData.price);
    expect(data.stock).toBe(productData.stock);

    // Cleanup
    await prisma.product.delete({ where: { id: data.id } });
  });

  it('should return 400 for missing required fields', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const invalidData = {
      description: 'Test description',
      imageUrl: 'https://via.placeholder.com/200',
    };

    const request = new NextRequest('http://localhost:3100/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(invalidData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should return 400 for negative price', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const invalidData = {
      name: 'Test Product',
      description: 'Test description',
      imageUrl: 'https://via.placeholder.com/200',
      price: -10,
      category: 'jerseys',
      stock: 100,
    };

    const request = new NextRequest('http://localhost:3100/api/admin/products', {
      method: 'POST',
      body: JSON.stringify(invalidData),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(400);
    expect(data.error).toBeDefined();
  });

  it('should return 400 for negative stock', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const invalidData = {
      name: 'Test Product',
      description: 'Test description',
      imageUrl: 'https://via.placeholder.com/200',
      price: 99.99,
      category: 'jerseys',
      stock: -5,
    };

    const request = new NextRequest('http://localhost:3100/api/admin/products', {
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

    const request = new NextRequest('http://localhost:3100/api/admin/products', {
      method: 'POST',
      body: JSON.stringify({ name: 'Test' }),
    });

    const response = await POST(request);
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});

describe('PUT /api/admin/products/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should update product with valid data', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    // Create a test product first
    const product = await prisma.product.create({
      data: {
        name: 'Original Product',
        description: 'Original description',
        imageUrl: 'https://via.placeholder.com/200',
        price: 50,
        category: 'jerseys',
        stock: 50,
        remainingQty: 50,
      },
    });

    const updateData = {
      name: 'Updated Product',
      price: 75,
      stock: 75,
    };

    const request = new NextRequest(
      `http://localhost:3100/api/admin/products/${product.id}`,
      {
        method: 'PUT',
        body: JSON.stringify(updateData),
      }
    );

    const response = await PUT(request, { params: Promise.resolve({ id: product.id }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.name).toBe(updateData.name);
    expect(data.price).toBe(updateData.price);
    expect(data.stock).toBe(updateData.stock);

    // Cleanup
    await prisma.product.delete({ where: { id: product.id } });
  });

  it('should return 404 for non-existent product', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest(
      'http://localhost:3100/api/admin/products/non-existent-id',
      {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
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
      'http://localhost:3100/api/admin/products/some-id',
      {
        method: 'PUT',
        body: JSON.stringify({ name: 'Updated' }),
      }
    );

    const response = await PUT(request, { params: Promise.resolve({ id: 'some-id' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});

describe('DELETE /api/admin/products/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should delete product successfully', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    // Create a test product first
    const product = await prisma.product.create({
      data: {
        name: 'Product to Delete',
        description: 'Will be deleted',
        imageUrl: 'https://via.placeholder.com/200',
        price: 50,
        category: 'jerseys',
        stock: 50,
        remainingQty: 50,
      },
    });

    const request = new NextRequest(
      `http://localhost:3100/api/admin/products/${product.id}`,
      { method: 'DELETE' }
    );

    const response = await DELETE(request, { params: Promise.resolve({ id: product.id }) });
    const data = await response.json();

    expect(response.status).toBe(200);
    expect(data.message).toBeDefined();

    // Verify product is deleted
    const deletedProduct = await prisma.product.findUnique({
      where: { id: product.id },
    });
    expect(deletedProduct).toBeNull();
  });

  it('should return 404 for non-existent product', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest(
      'http://localhost:3100/api/admin/products/non-existent-id',
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
      'http://localhost:3100/api/admin/products/some-id',
      { method: 'DELETE' }
    );

    const response = await DELETE(request, { params: Promise.resolve({ id: 'some-id' }) });
    const data = await response.json();

    expect(response.status).toBe(401);
    expect(data.error).toBe('Unauthorized');
  });
});

describe('GET /api/admin/products/[id]', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should return product by id for admin user', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    // Get a product from the database
    const product = await prisma.product.findFirst();
    
    if (product) {
      const request = new NextRequest(
        `http://localhost:3100/api/admin/products/${product.id}`
      );

      const response = await getById(request, { params: Promise.resolve({ id: product.id }) });
      const data = await response.json();

      expect(response.status).toBe(200);
      expect(data.id).toBe(product.id);
      expect(data.name).toBe(product.name);
    }
  });

  it('should return 404 for non-existent product', async () => {
    vi.mocked(getServerSession).mockResolvedValue({
      user: { id: 'admin-id', email: 'admin@example.com', role: 'admin' },
      expires: '2026-12-31',
    });

    const request = new NextRequest(
      'http://localhost:3100/api/admin/products/non-existent-id'
    );

    const response = await getById(request, { params: Promise.resolve({ id: 'non-existent-id' }) });
    const data = await response.json();

    expect(response.status).toBe(404);
    expect(data.error).toBeDefined();
  });
});
