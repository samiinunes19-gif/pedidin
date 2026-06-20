import { NextResponse } from 'next/server';
import { getProductsByCategory, searchProducts, getProductBySlugOrId } from '@/lib/data-source';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');

    // Tentar banco primeiro
    try {
      const { prisma } = await import('@/lib/prisma');
      
      if (slug) {
        const product = await prisma.product.findFirst({
          where: { OR: [{ slug }, { id: slug }] },
          include: { category: true },
        });
        return NextResponse.json(product ? [product] : []);
      }

      const where: Record<string, unknown> = {};
      if (category) where.category = { slug: category };
      if (search) {
        where.OR = [
          { name: { contains: search, mode: 'insensitive' } },
          { description: { contains: search, mode: 'insensitive' } },
        ];
      }

      const products = await prisma.product.findMany({
        where,
        include: { category: true },
        orderBy: { salesCount: 'desc' },
      });
      return NextResponse.json(products);
    } catch {
      // Fallback para JSON local
    }

    // JSON fallback
    if (slug) {
      const product = getProductBySlugOrId(slug);
      return NextResponse.json(product ? [product] : []);
    }
    if (category) {
      const products = getProductsByCategory(category);
      return NextResponse.json(products);
    }
    if (search) {
      const products = searchProducts(search);
      return NextResponse.json(products);
    }

    return NextResponse.json([]);
  } catch (error) {
    console.error('Error fetching products:', error);
    return NextResponse.json({ error: 'Erro ao buscar produtos' }, { status: 500 });
  }
}
