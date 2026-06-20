'use client';

import { useState, useEffect, Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import CartDrawer from '@/app/components/cart-drawer';
import FloatingCart from '@/app/components/floating-cart';
import ProductCard from '@/app/components/product-card';
import Link from 'next/link';
import { ChevronLeft, Search } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  imageUrl: string;
  slug: string;
}

function SearchContent() {
  const searchParams = useSearchParams();
  const query = searchParams?.get('q') || '';
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!query) {
      setLoading(false);
      return;
    }
    setLoading(true);
    fetch(`/api/products?search=${encodeURIComponent(query)}`)
      .then(res => res.json())
      .then(data => {
        const prods = Array.isArray(data) ? data : data.products || [];
        setProducts(prods);
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [query]);

  return (
    <div className="min-h-screen flex flex-col bg-white">
      <Header />
      <CartDrawer />
      <FloatingCart />
      <main className="flex-1">
        <div className="bg-gradient-to-r from-[#1a1a1a] via-gray-900 to-[#1a1a1a] py-8">
          <div className="max-w-7xl mx-auto px-4">
            <Link href="/" className="inline-flex items-center gap-2 text-[#F7B731] hover:text-[#E5A623] mb-4 transition-colors">
              <ChevronLeft className="w-5 h-5" />
              Voltar
            </Link>
            <div className="flex items-center gap-3">
              <Search className="w-8 h-8 text-[#F7B731]" />
              <h1 className="text-3xl md:text-4xl font-bold text-white font-oswald">
                Busca: &ldquo;{query}&rdquo;
              </h1>
            </div>
            <p className="text-gray-400 mt-2">
              {loading ? 'Buscando...' : `${products.length} resultado(s) encontrado(s)`}
            </p>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-8">
          {loading ? (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {[...Array(8)].map((_, i) => (
                <div key={i} className="bg-gray-100 rounded-xl p-3 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <Search className="w-16 h-16 mx-auto mb-4 opacity-50" />
              <p className="text-xl">Nenhum produto encontrado para &ldquo;{query}&rdquo;</p>
              <p className="mt-2">Tente buscar por outro termo.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
              {products.map((product) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  discount={product.discount}
                  imageUrl={product.imageUrl}
                  slug={product.slug}
                />
              ))}
            </div>
          )}
        </div>
      </main>
      <Footer />
    </div>
  );
}

export default function SearchPageContent() {
  return (
    <Suspense fallback={<div className="min-h-screen flex items-center justify-center"><div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7B731]"></div></div>}>
      <SearchContent />
    </Suspense>
  );
}
