'use client';

import { useRef } from 'react';
import { ChevronRight } from 'lucide-react';
import Link from 'next/link';
import ProductCard from './product-card';

interface Product {
  id: string;
  name: string;
  price: number;
  discount: number;
  imageUrl: string;
  slug: string;
}

interface ProductSectionProps {
  title: string;
  products: Product[];
  categorySlug?: string;
  showAll?: boolean;
  iconBg?: string;
}

export default function ProductSection({ 
  title, 
  products, 
  categorySlug,
  showAll = true,
  iconBg = 'from-amber-500 to-orange-600'
}: ProductSectionProps) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const displayProducts = products.slice(0, 12);

  if (displayProducts.length === 0) return null;

  return (
    <section className="mb-6 bg-white py-4">
      <div className="flex justify-between items-center mb-3 px-4">
        <div className="flex items-center gap-2">
          <div className={`w-2 h-6 bg-gradient-to-b ${iconBg} rounded-full`} />
          <h2 className="text-lg font-bold text-gray-900">{title}</h2>
        </div>
        {showAll && categorySlug && (
          <Link
            href={`/categoria/${categorySlug}`}
            className="text-amber-600 font-semibold text-sm hover:underline flex items-center gap-1"
          >
            Ver mais
            <ChevronRight className="w-4 h-4" />
          </Link>
        )}
      </div>
      <div
        ref={scrollRef}
        className="flex overflow-x-auto scrollbar-hide gap-3 pb-2 px-4"
      >
        {displayProducts.map((product, index) => (
          <ProductCard 
            key={product.id} 
            {...product} 
            compact 
            index={index}
          />
        ))}
        {showAll && categorySlug && (
          <Link
            href={`/categoria/${categorySlug}`}
            className={`flex-shrink-0 w-[160px] min-h-[240px] bg-gradient-to-br ${iconBg} rounded-xl flex flex-col items-center justify-center text-center p-4 hover:opacity-90 transition-all shadow-lg`}
          >
            <div className="w-14 h-14 rounded-full bg-white/20 flex items-center justify-center mb-3">
              <ChevronRight className="w-8 h-8 text-white" />
            </div>
            <p className="font-bold text-lg text-white">Ver mais</p>
            <p className="text-white/90 text-xs mt-1">Clique aqui</p>
          </Link>
        )}
      </div>
    </section>
  );
}
