import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';

    let products;
    
    if (query.trim() === '') {
      // No search query - return all products
      products = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
    } else {
      // Filter by name (case-insensitive) - SQLite doesn't support mode, so we get all and filter
      const allProducts = await prisma.product.findMany({
        orderBy: {
          createdAt: 'desc'
        }
      });
      products = allProducts.filter(product => 
        product.name.toLowerCase().includes(query.toLowerCase())
      );
    }

    return NextResponse.json(products);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json(
      { error: 'Failed to fetch products' },
      { status: 500 }
    );
  }
}
