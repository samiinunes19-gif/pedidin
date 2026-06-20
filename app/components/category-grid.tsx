'use client';

import { useState, useRef } from 'react';
import Image from 'next/image';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

// 14 categorias na ordem exata do backup original
const categories = [
  { name: 'Ofertas', slug: 'ofertas', icon: '/categories/ofertas.webp' },
  { name: 'Cervejas', slug: 'cervejas', icon: '/categories/cervejas.webp' },
  { name: 'Destilados', slug: 'destilados', icon: '/categories/destilados.webp' },
  { name: 'Vinhos', slug: 'vinhos', icon: '/categories/vinhos.webp' },
  { name: 'Churrasco', slug: 'churrasco', icon: '/categories/churrasco.webp' },
  { name: 'Chopp', slug: 'chopp', icon: '/categories/chopp.webp' },
  { name: 'Águas e Gelo', slug: 'aguas-e-gelo', icon: '/categories/aguas_gelo.webp' },
  { name: 'Não alcoólicos', slug: 'nao-alcoolicos', icon: '/categories/nao_alcoolicos.webp' },
  { name: 'Drinks Prontos', slug: 'drinks-prontos', icon: '/categories/drinks.webp' },
  { name: 'Sobremesas', slug: 'sobremesas', icon: '/categories/sobremesas.webp' },
  { name: 'Conveniência', slug: 'conveniencia', icon: '/categories/conveniencia.webp' },
  { name: 'Cigarros', slug: 'cigarros', icon: '/categories/cigarros.png' },
  { name: 'Refrigerantes', slug: 'refrigerantes', icon: '/categories/refrigerantes.png' },
  { name: 'Energéticos', slug: 'energeticos', icon: '/categories/energeticos.png' },
];

export default function CategoryGrid() {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [showArrow, setShowArrow] = useState(true);
  const [imgErrors, setImgErrors] = useState<Record<string, boolean>>({});

  const handleScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setShowArrow(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  const scrollRight = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollBy({ left: 150, behavior: 'smooth' });
    }
  };

  const handleImageError = (slug: string) => {
    setImgErrors(prev => ({ ...prev, [slug]: true }));
  };

  return (
    <section className="bg-white px-4 py-5">
      {/* Categorias com scroll horizontal */}
      <div className="relative">
        <div 
          ref={scrollRef}
          onScroll={handleScroll}
          className="flex gap-4 overflow-x-auto pb-2 scrollbar-hide"
        >
          {categories.map((cat, index) => (
            <Link
              key={cat.slug}
              href={`/categoria/${cat.slug}`}
              className="flex flex-col items-center cursor-pointer flex-shrink-0"
            >
              <div className="bg-white rounded-2xl w-16 h-16 flex items-center justify-center overflow-hidden mb-2 transition-all duration-200 shadow-sm border border-gray-100 hover:ring-2 hover:ring-[#FF6B00]">
                <div className="relative w-12 h-12">
                  {!imgErrors[cat.slug] ? (
                    <Image
                      src={cat.icon}
                      alt={cat.name}
                      fill
                      className="object-contain"
                      sizes="48px"
                      loading={index < 7 ? 'eager' : 'lazy'}
                      onError={() => handleImageError(cat.slug)}
                    />
                  ) : (
                    <div className="w-full h-full bg-gray-200 rounded-lg" />
                  )}
                </div>
              </div>
              <p 
                className="text-xs font-semibold text-center text-gray-700 leading-tight hover:text-[#FF6B00] transition-colors"
                style={{ maxWidth: '72px', wordBreak: 'break-word' }}
              >
                {cat.name}
              </p>
            </Link>
          ))}
        </div>
        
        {/* Seta de navegação */}
        {showArrow && (
          <button
            onClick={scrollRight}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white/95 rounded-full p-2 shadow-lg border border-gray-100 hover:bg-gray-50 transition-colors z-10"
          >
            <ChevronRight className="w-5 h-5 text-[#FF6B00]" />
          </button>
        )}
      </div>
    </section>
  );
}
