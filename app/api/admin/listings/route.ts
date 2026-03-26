import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { ListingStatus } from '@prisma/client';

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

    // Get status filter from query params
    const { searchParams } = new URL(request.url);
    const statusParam = searchParams.get('status');

    // Build where clause based on status filter
    const whereClause: { status?: ListingStatus } = {};
    
    if (statusParam && statusParam !== 'all' && statusParam !== '') {
      // Validate status is a valid ListingStatus enum value
      const validStatuses: ListingStatus[] = [
        'draft',
        'active',
        'pending_sale',
        'sold',
        'cancelled',
        'expired',
      ];
      
      if (validStatuses.includes(statusParam as ListingStatus)) {
        whereClause.status = statusParam as ListingStatus;
      }
    }

    // Fetch listings with seller information
    const listings = await prisma.listing.findMany({
      where: whereClause,
      include: {
        seller: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { listedAt: 'desc' },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
