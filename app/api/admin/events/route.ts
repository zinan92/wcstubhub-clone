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

    // Fetch all events
    const events = await prisma.event.findMany({
      orderBy: { createdAt: 'desc' },
    });

    return NextResponse.json(events);
  } catch (error) {
    console.error('Error fetching events:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
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

    // Parse request body
    const body = await request.json();
    const {
      title,
      type,
      team1,
      team2,
      team1Flag,
      team2Flag,
      artistName,
      artistImageUrl,
      date,
      venue,
      price,
      description,
      remainingQty,
    } = body;

    // Validation
    const errors: Record<string, string> = {};

    if (!title || title.trim() === '') {
      errors.title = 'Title is required';
    }

    if (!type || !['football', 'basketball', 'concert'].includes(type)) {
      errors.type = 'Type must be football, basketball, or concert';
    }

    if (!date) {
      errors.date = 'Date is required';
    }

    if (!venue || venue.trim() === '') {
      errors.venue = 'Venue is required';
    }

    if (!price || typeof price !== 'number') {
      errors.price = 'Price is required';
    } else if (price <= 0) {
      errors.price = 'Price must be greater than 0';
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Create event
    const eventData: any = {
      title: title.trim(),
      type,
      date: new Date(date),
      venue: venue.trim(),
      price,
      description: description || '',
      remainingQty: remainingQty || 1000,
    };

    // Add type-specific fields
    if (type === 'football' || type === 'basketball') {
      eventData.team1 = team1 || null;
      eventData.team2 = team2 || null;
      if (type === 'football') {
        eventData.team1Flag = team1Flag || null;
        eventData.team2Flag = team2Flag || null;
      }
    } else if (type === 'concert') {
      eventData.artistName = artistName || null;
      eventData.artistImageUrl = artistImageUrl || null;
    }

    const event = await prisma.event.create({
      data: eventData,
    });

    return NextResponse.json(event, { status: 201 });
  } catch (error) {
    console.error('Error creating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
