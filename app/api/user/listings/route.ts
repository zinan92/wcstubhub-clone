import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/user/listings - Fetch authenticated user's listings
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const listings = await prisma.listing.findMany({
      where: { sellerId: user.id },
      orderBy: { listedAt: 'desc' },
    });

    return NextResponse.json(listings);
  } catch (error) {
    console.error('Error fetching listings:', error);
    return NextResponse.json(
      { error: 'Failed to fetch listings' },
      { status: 500 }
    );
  }
}

// POST /api/user/listings - Create a new listing
export async function POST(request: NextRequest) {
  try {
    const session = await getServerSession();

    if (!session?.user?.email) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const user = await prisma.user.findUnique({
      where: { email: session.user.email },
    });

    if (!user) {
      return NextResponse.json({ error: 'User not found' }, { status: 404 });
    }

    const body = await request.json();
    const { itemType, itemId, itemName, itemImageUrl, askPrice, quantity, ownedAssetId } = body;

    // Validate required fields
    if (!itemType || !itemId || !itemName || !itemImageUrl || askPrice === undefined || quantity === undefined) {
      return NextResponse.json(
        { error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Validate item type
    if (itemType !== 'product' && itemType !== 'event') {
      return NextResponse.json(
        { error: 'Invalid item type' },
        { status: 400 }
      );
    }

    // Validate quantity and price
    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    if (typeof askPrice !== 'number' || askPrice <= 0) {
      return NextResponse.json(
        { error: 'Ask price must be greater than 0' },
        { status: 400 }
      );
    }

    // If ownedAssetId is provided, validate ownership and update quantity
    if (ownedAssetId) {
      const ownedAsset = await prisma.ownedAsset.findFirst({
        where: {
          id: ownedAssetId,
          userId: user.id,
        },
      });

      if (!ownedAsset) {
        return NextResponse.json(
          { error: 'Owned asset not found or does not belong to user' },
          { status: 404 }
        );
      }

      if (ownedAsset.quantityAvailable < quantity) {
        return NextResponse.json(
          { error: 'Insufficient quantity available for listing' },
          { status: 400 }
        );
      }

      // Update owned asset to mark quantity as listed
      await prisma.ownedAsset.update({
        where: { id: ownedAssetId },
        data: {
          quantityAvailable: ownedAsset.quantityAvailable - quantity,
          status: ownedAsset.quantityAvailable - quantity === 0 ? 'listed' : ownedAsset.status,
        },
      });
    }

    // Generate a reference number (e.g., LST-20260326-ABC123)
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const referenceNumber = `LST-${timestamp}-${randomSuffix}`;

    // Create listing
    const listing = await prisma.listing.create({
      data: {
        sellerId: user.id,
        ownedAssetId: ownedAssetId || null,
        itemType: itemType as 'product' | 'event',
        itemId,
        itemName,
        itemImageUrl,
        askPrice,
        quantity,
        status: 'active',
        referenceNumber,
        listedAt: new Date(),
      },
    });

    return NextResponse.json(listing, { status: 201 });
  } catch (error) {
    console.error('Error creating listing:', error);
    
    // Handle Prisma unique constraint violation
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Reference number conflict. Please try again.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create listing' },
      { status: 500 }
    );
  }
}
