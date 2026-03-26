import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    // Check authentication
    const session = await getServerSession(authOptions);
    
    if (!session || !session.user) {
      return NextResponse.json(
        { error: 'Unauthorized' },
        { status: 401 }
      );
    }

    // Check admin role
    if (session.user.role !== 'admin') {
      return NextResponse.json(
        { error: 'Forbidden: Admin access required' },
        { status: 403 }
      );
    }

    // Fetch stats from database
    const [users, products, events, orders, ownedAssets, listings] = await Promise.all([
      prisma.user.count(),
      prisma.product.count(),
      prisma.event.count(),
      prisma.order.count(),
      prisma.ownedAsset.count(),
      prisma.listing.count(),
    ]);

    return NextResponse.json({
      users,
      products,
      events,
      orders,
      ownedAssets,
      listings,
    });
  } catch (error) {
    console.error('Error fetching admin stats:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
