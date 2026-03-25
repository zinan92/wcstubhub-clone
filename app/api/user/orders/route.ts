import { NextResponse, NextRequest } from 'next/server';
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

    // Get type parameter from query string
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type') || 'purchase';

    // For now, we only have purchase orders in the system
    // For sale orders would be a different table/relationship in a real system
    // Return empty array for 'sale' type
    if (type === 'sale') {
      return NextResponse.json([]);
    }

    // Fetch user's purchase orders
    const orders = await prisma.order.findMany({
      where: {
        userId: session.user.id,
      },
      orderBy: {
        transactionTime: 'desc',
      },
    });

    return NextResponse.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error);
    return NextResponse.json(
      { error: 'Failed to fetch orders' },
      { status: 500 }
    );
  }
}
