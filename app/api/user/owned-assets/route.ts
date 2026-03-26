import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { prisma } from '@/lib/prisma';
import { Prisma } from '@prisma/client';

// GET /api/user/owned-assets - Fetch authenticated user's owned assets
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

    const ownedAssets = await prisma.ownedAsset.findMany({
      where: { userId: user.id },
      orderBy: { purchasedAt: 'desc' },
    });

    return NextResponse.json(ownedAssets);
  } catch (error) {
    console.error('Error fetching owned assets:', error);
    return NextResponse.json(
      { error: 'Failed to fetch owned assets' },
      { status: 500 }
    );
  }
}

// POST /api/user/owned-assets - Create a new owned asset (pseudo purchase)
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
    const { itemType, itemId, itemName, itemImageUrl, purchasePrice, quantity } = body;

    // Validate required fields
    if (!itemType || !itemId || !itemName || !itemImageUrl || purchasePrice === undefined || quantity === undefined) {
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

    // Validate quantity
    if (typeof quantity !== 'number' || quantity <= 0) {
      return NextResponse.json(
        { error: 'Quantity must be greater than 0' },
        { status: 400 }
      );
    }

    // Generate a reference number (e.g., OA-20260326-ABC123)
    const timestamp = new Date().toISOString().split('T')[0].replace(/-/g, '');
    const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
    const referenceNumber = `OA-${timestamp}-${randomSuffix}`;

    // Create owned asset
    const ownedAsset = await prisma.ownedAsset.create({
      data: {
        userId: user.id,
        itemType: itemType as 'product' | 'event',
        itemId,
        itemName,
        itemImageUrl,
        purchasePrice,
        quantity,
        quantityAvailable: quantity,
        status: 'confirmed',
        referenceNumber,
        purchasedAt: new Date(),
      },
    });

    return NextResponse.json(ownedAsset, { status: 201 });
  } catch (error) {
    console.error('Error creating owned asset:', error);
    
    // Handle Prisma unique constraint violation
    if (error instanceof Prisma.PrismaClientKnownRequestError && error.code === 'P2002') {
      return NextResponse.json(
        { error: 'Reference number conflict. Please try again.' },
        { status: 409 }
      );
    }

    return NextResponse.json(
      { error: 'Failed to create owned asset' },
      { status: 500 }
    );
  }
}
