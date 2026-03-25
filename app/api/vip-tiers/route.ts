import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const vipTiers = await prisma.vipTier.findMany({
      orderBy: {
        level: 'asc',
      },
    });

    return NextResponse.json(vipTiers);
  } catch (error) {
    console.error('Error fetching VIP tiers:', error);
    return NextResponse.json(
      { error: 'Failed to fetch VIP tiers' },
      { status: 500 }
    );
  }
}
