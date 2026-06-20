'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import CartDrawer from '@/app/components/cart-drawer';
import FloatingCart from '@/app/components/floating-cart';
import ProductDetailClient from './product-detail-client';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  discount: number;
  imageUrl: string;
  category?: { name: string };
}

export default function ProductPageClient({ productId }: { productId: string }) {
  const [product, setProduct] = useState<Product | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  useEffect(() => {
    if (!productId) return;
    fetch(`/api/products?slug=${encodeURIComponent(productId)}`)
      .then(res => res.json())
      .then(data => {
        const products = data.products || data;
        const found = Array.isArray(products) ? products[0] : null;
        if (found) {
          setProduct(found);
        } else {
          setNotFound(true);
        }
      })
      .catch(() => setNotFound(true))
      .finally(() => setLoading(false));
  }, [productId]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white">
        <div className="w-10 h-10 border-4 border-[#F7B731] border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (notFound || !product) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center bg-white gap-4">
        <p className="text-xl text-gray-500">Produto não encontrado</p>
        <Link href="/" className="text-[#F7B731] font-semibold hover:underline">Voltar ao início</Link>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <CartDrawer />
      <FloatingCart />
      <main className="flex-1">
        <div className="max-w-7xl mx-auto px-4 py-6">
          <Link href="/" className="inline-flex items-center gap-2 text-[#F7B731] hover:text-[#E5A623] mb-6 transition-colors">
            <ChevronLeft className="w-5 h-5" />
            Voltar
          </Link>
          <ProductDetailClient
            product={{
              id: product.id,
              name: product.name,
              description: product.description || '',
              price: product.price,
              discount: product.discount || 0,
              imageUrl: product.imageUrl || '',
              categoryName: product.category?.name || '',
            }}
          />
        </div>
      </main>
      <Footer />
    </div>
  );
}
