import { NextResponse } from 'next/server';
import { getHomeData } from '@/lib/data-source';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const categories = getHomeData();
    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching home data:', error);
    return NextResponse.json({ categories: [] });
  }
}

