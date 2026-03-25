import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams;
    const type = searchParams.get('type');
    const searchQuery = searchParams.get('q') || '';

    // Build where clause for type filter
    const where: any = {};
    
    if (type && (type === 'football' || type === 'basketball' || type === 'concert')) {
      where.type = type;
    }

    // Fetch events with type filter
    let events = await prisma.event.findMany({
      where,
      orderBy: {
        date: 'asc',
      },
    });

    // Client-side search filtering (SQLite doesn't support case-insensitive mode)
    if (searchQuery.trim() !== '') {
      const query = searchQuery.trim().toLowerCase();
      events = events.filter(event => {
        // For sports events: search in team1 or team2
        // For concerts: search in artistName
        const team1Match = event.team1?.toLowerCase().includes(query);
        const team2Match = event.team2?.toLowerCase().includes(query);
        const artistMatch = event.artistName?.toLowerCase().includes(query);
        
        return team1Match || team2Match || artistMatch;
      });
    }

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Failed to fetch events' },
      { status: 500 }
    );
  }
}
