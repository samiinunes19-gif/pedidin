import { NextResponse } from 'next/server';
import { getProductsByCategory, searchProducts, getProductBySlugOrId } from '@/lib/data-source';

export const dynamic = 'force-dynamic';

export async function GET(request: Request) {
  try {
    const { searchParams } = new URL(request.url);
    const category = searchParams.get('category');
    const search = searchParams.get('search');
    const slug = searchParams.get('slug');

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

