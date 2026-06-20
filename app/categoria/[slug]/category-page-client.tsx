'use client';

import { useState, useEffect } from 'react';
import Header from '@/app/components/header';
import Footer from '@/app/components/footer';
import CartDrawer from '@/app/components/cart-drawer';
import FloatingCart from '@/app/components/floating-cart';
import ProductCard from '@/app/components/product-card';
import Link from 'next/link';
import { ChevronLeft } from 'lucide-react';

interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  imageUrl: string;
  slug: string;
}

export default function CategoryPageClient({ slug }: { slug: string }) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categoryName, setCategoryName] = useState('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!slug) return;
    fetch(`/api/products?category=${encodeURIComponent(slug)}`)
      .then(res => res.json())
      .then(data => {
        const prods = data.products || data;
        setProducts(Array.isArray(prods) ? prods : []);
        if (Array.isArray(prods) && prods.length > 0 && prods[0].category) {
          setCategoryName(prods[0].category.name);
        } else {
          setCategoryName(slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, ' '));
        }
      })
      .catch(() => setProducts([]))
      .finally(() => setLoading(false));
  }, [slug]);

  return (
    <div className="min-h-screen flex flex-col bg-gray-50">
      <Header />
      <CartDrawer />
      <FloatingCart />
      <main className="flex-1">
        <div className="bg-white border-b border-gray-100 py-4 sticky top-14 z-10">
          <div className="max-w-7xl mx-auto px-4">
            <Link href="/" className="inline-flex items-center gap-2 text-emerald-600 hover:text-emerald-700 mb-2 transition-colors text-sm font-medium">
              <ChevronLeft className="w-4 h-4" />
              Voltar
            </Link>
            <div className="flex items-center justify-between">
              <h1 className="text-xl font-bold text-gray-900">{categoryName}</h1>
              <span className="text-sm text-gray-500">{products.length} produtos</span>
            </div>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-4 py-4">
          {loading ? (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {[...Array(12)].map((_, i) => (
                <div key={i} className="bg-white rounded-xl p-3 animate-pulse">
                  <div className="aspect-square bg-gray-200 rounded-lg mb-2" />
                  <div className="h-3 bg-gray-200 rounded mb-1" />
                  <div className="h-3 bg-gray-200 rounded w-2/3" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-16 text-gray-500">
              <p className="text-lg">Nenhum produto encontrado nesta categoria.</p>
            </div>
          ) : (
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 xl:grid-cols-6 gap-3">
              {products.map((product, index) => (
                <ProductCard
                  key={product.id}
                  id={product.id}
                  name={product.name}
                  price={product.price}
                  discount={product.discount}
                  imageUrl={product.imageUrl}
                  slug={product.slug}
                  index={index}
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
