'use client';

import { useState, useEffect } from 'react';
import Header from './header';
import HeroBanner from './hero-banner';
import Marquee from './marquee';
import CategoryGrid from './category-grid';
import ProductSection from './product-section';
import Footer from './footer';
import CartDrawer from './cart-drawer';
import FloatingCart from './floating-cart';

const categoryColors: Record<string, string> = {
  'ofertas': 'from-red-500 to-orange-600',
  'cervejas': 'from-amber-500 to-yellow-600',
  'destilados': 'from-purple-500 to-indigo-600',
  'vinhos': 'from-rose-500 to-red-600',
  'churrasco': 'from-orange-500 to-red-600',
  'chopp': 'from-yellow-500 to-amber-600',
  'aguas-e-gelo': 'from-cyan-500 to-blue-600',
  'nao-alcoolicos': 'from-green-500 to-teal-600',
  'drinks-prontos': 'from-pink-500 to-purple-600',
  'sobremesas': 'from-pink-400 to-rose-500',
  'conveniencia': 'from-blue-500 to-indigo-600',
  'cigarros': 'from-gray-500 to-gray-700',
  'refrigerantes': 'from-red-500 to-pink-600',
  'energeticos': 'from-lime-500 to-green-600',
};

interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  imageUrl: string;
  slug: string;
}

interface Category {
  id: string;
  name: string;
  slug: string;
  products: Product[];
}

export default function HomeContent() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await fetch('/api/home-data');
        const data = await res.json();
        setCategories(data.categories || []);
      } catch (error) {
        console.error('Erro ao carregar dados:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-[#F7B731]"></div>
      </div>
    );
  }

  return (
    <main className="min-h-screen bg-gray-50">
      <Header />
      <CartDrawer />
      <FloatingCart />
      <HeroBanner />
      <Marquee />
      
      <div className="pb-24">
        <CategoryGrid />
        
        {categories.map((cat) => {
          if (cat.products.length === 0) return null;
          
          const iconBg = categoryColors[cat.slug] || 'from-gray-400 to-gray-600';
          
          return (
            <ProductSection
              key={cat.id}
              title={cat.name}
              categorySlug={cat.slug}
              iconBg={iconBg}
              products={cat.products.map((p) => ({
                id: p.id,
                name: p.name,
                price: p.price,
                discount: p.discount,
                imageUrl: p.imageUrl,
                slug: p.slug,
              }))}
            />
          );
        })}
      </div>
      
      <Footer />
    </main>
  );
}
