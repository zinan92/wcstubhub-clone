import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Fetch event by ID
    const event = await prisma.event.findUnique({
      where: { id },
    });

    if (!event) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error fetching event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
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

    if (title !== undefined && title.trim() === '') {
      errors.title = 'Title cannot be empty';
    }

    if (type !== undefined && !['football', 'basketball', 'concert'].includes(type)) {
      errors.type = 'Type must be football, basketball, or concert';
    }

    if (venue !== undefined && venue.trim() === '') {
      errors.venue = 'Venue cannot be empty';
    }

    if (price !== undefined) {
      if (typeof price !== 'number') {
        errors.price = 'Price must be a number';
      } else if (price <= 0) {
        errors.price = 'Price must be greater than 0';
      }
    }

    if (Object.keys(errors).length > 0) {
      return NextResponse.json(
        { error: 'Validation failed', errors },
        { status: 400 }
      );
    }

    // Build update data
    const updateData: any = {};
    
    if (title !== undefined) updateData.title = title.trim();
    if (type !== undefined) updateData.type = type;
    if (team1 !== undefined) updateData.team1 = team1;
    if (team2 !== undefined) updateData.team2 = team2;
    if (team1Flag !== undefined) updateData.team1Flag = team1Flag;
    if (team2Flag !== undefined) updateData.team2Flag = team2Flag;
    if (artistName !== undefined) updateData.artistName = artistName;
    if (artistImageUrl !== undefined) updateData.artistImageUrl = artistImageUrl;
    if (date !== undefined) updateData.date = new Date(date);
    if (venue !== undefined) updateData.venue = venue.trim();
    if (price !== undefined) updateData.price = price;
    if (description !== undefined) updateData.description = description;
    if (remainingQty !== undefined) updateData.remainingQty = remainingQty;

    // Update event
    const event = await prisma.event.update({
      where: { id },
      data: updateData,
    });

    return NextResponse.json(event);
  } catch (error) {
    console.error('Error updating event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
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

    const { id } = await params;

    // Check if event exists
    const existingEvent = await prisma.event.findUnique({
      where: { id },
    });

    if (!existingEvent) {
      return NextResponse.json(
        { error: 'Event not found' },
        { status: 404 }
      );
    }

    // Delete event
    await prisma.event.delete({
      where: { id },
    });

    return NextResponse.json({
      message: 'Event deleted successfully',
    });
  } catch (error) {
    console.error('Error deleting event:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}
