import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { OwnedAssetStatus } from '@prisma/client';

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
    const whereClause: { status?: OwnedAssetStatus } = {};
    
    if (statusParam && statusParam !== 'all' && statusParam !== '') {
      // Validate status is a valid OwnedAssetStatus enum value
      const validStatuses: OwnedAssetStatus[] = [
        'pending',
        'confirmed',
        'delivered',
        'listed',
        'sold',
        'cancelled',
      ];
      
      if (validStatuses.includes(statusParam as OwnedAssetStatus)) {
        whereClause.status = statusParam as OwnedAssetStatus;
      }
    }

    // Fetch owned assets with user information
    const ownedAssets = await prisma.ownedAsset.findMany({
      where: whereClause,
      include: {
        user: {
          select: {
            email: true,
            name: true,
          },
        },
      },
      orderBy: { purchasedAt: 'desc' },
    });

    return NextResponse.json(ownedAssets);
  } catch (error) {
    console.error('Error fetching owned assets:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
