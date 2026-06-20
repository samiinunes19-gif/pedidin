import { NextResponse } from 'next/server';
import { getHomeData } from '@/lib/data-source';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    // Tentar banco primeiro, fallback para JSON local
    let categories;
    try {
      const { prisma } = await import('@/lib/prisma');
      const dbCategories = await prisma.category.findMany({
        orderBy: { order: 'asc' },
        include: {
          products: {
            where: { inStock: true },
            orderBy: { salesCount: 'desc' },
            take: 12,
          },
        },
      });
      categories = dbCategories;
    } catch {
      // Fallback para JSON local
      categories = getHomeData();
    }

    return NextResponse.json({ categories });
  } catch (error) {
    console.error('Error fetching home data:', error);
    const categories = getHomeData();
    return NextResponse.json({ categories });
  }
}
