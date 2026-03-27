import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const query = searchParams.get('q') || '';
    const trimmedQuery = query.trim();

    // Handle empty or whitespace-only queries - return trending items
    if (trimmedQuery === '') {
      const [products, events] = await Promise.all([
        // Get trending products (prioritize isBestValue and isSellingFast)
        prisma.product.findMany({
          orderBy: [
            { isBestValue: 'desc' },
            { isSellingFast: 'desc' },
            { createdAt: 'desc' },
          ],
          take: 6,
        }),
        // Get trending events (prioritize isBestValue and isSellingFast, then upcoming dates)
        prisma.event.findMany({
          orderBy: [
            { isBestValue: 'desc' },
            { isSellingFast: 'desc' },
            { date: 'asc' },
          ],
          take: 6,
        }),
      ]);

      return NextResponse.json({ products, events });
    }

    // Fetch all products and events
    const [allProducts, allEvents] = await Promise.all([
      prisma.product.findMany({
        orderBy: {
          createdAt: 'desc',
        },
      }),
      prisma.event.findMany({
        orderBy: {
          date: 'asc',
        },
      }),
    ]);

    // Filter products by name (case-insensitive)
    const lowerQuery = trimmedQuery.toLowerCase();
    const products = allProducts.filter(product =>
      product.name.toLowerCase().includes(lowerQuery)
    );

    // Filter events by title, team1, team2, or artistName (case-insensitive)
    const events = allEvents.filter(event => {
      const titleMatch = event.title.toLowerCase().includes(lowerQuery);
      const team1Match = event.team1?.toLowerCase().includes(lowerQuery);
      const team2Match = event.team2?.toLowerCase().includes(lowerQuery);
      const artistMatch = event.artistName?.toLowerCase().includes(lowerQuery);
      
      return titleMatch || team1Match || team2Match || artistMatch;
    });

    return NextResponse.json({ products, events });
  } catch (error) {
    console.error('Error searching:', error);
    return NextResponse.json(
      { error: 'Failed to search' },
      { status: 500 }
    );
  }
}
