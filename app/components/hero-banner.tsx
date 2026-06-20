'use client';

import { useState } from 'react';
import { Search, MapPin, Clock } from 'lucide-react';
import Image from 'next/image';
import { useRouter } from 'next/navigation';

export default function HeroBanner() {
  const [search, setSearch] = useState('');
  const router = useRouter();

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    if (search?.trim()) {
      router.push(`/busca?q=${encodeURIComponent(search)}`);
    }
  };

  return (
    <>
      {/* Faixa amarela - Entregamos na sua localização */}
      <div className="bg-[#F7B731] py-2 px-4">
        <div className="flex items-center justify-center gap-2">
          <MapPin className="w-4 h-4 text-black" />
          <span className="text-black font-bold text-xs uppercase tracking-wider">Entregamos na sua localização</span>
        </div>
      </div>

      <div className="relative h-[280px] md:h-[350px]">
        <Image
          src="/banner-hero.webp"
          alt="Zé Pedidos - Delivery de Bebidas"
          fill
          className="object-cover object-center"
          priority
        />
        
        {/* Gradiente escuro na parte inferior para texto legível */}
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent" />
        
        {/* Textos na parte inferior, acima da busca */}
        <div className="absolute bottom-20 left-0 right-0 text-center px-4">
          <div className="inline-flex items-center gap-2 bg-black/60 backdrop-blur-sm rounded-full px-4 py-2 mb-2">
            <MapPin className="w-4 h-4 text-[#F7B731]" />
            <span className="text-white text-sm md:text-base font-bold">Distribuidora a 2,3km de você</span>
          </div>
          <div className="flex items-center justify-center gap-2">
            <Clock className="w-4 h-4 text-[#F7B731]" />
            <span className="text-white text-sm md:text-base font-medium">entrega em até <span className="text-[#F7B731] font-bold">30min</span></span>
          </div>
        </div>
        
        {/* Barra de busca posicionada na parte inferior */}
        <div className="absolute bottom-0 left-0 right-0 px-4 pb-4">
          <form onSubmit={handleSearch} className="w-full max-w-md mx-auto">
            <div className="relative flex items-center bg-white rounded-full border-2 border-gray-200 shadow-xl hover:border-[#F7B731] transition-all">
              <Search className="absolute left-4 text-gray-400 w-5 h-5" />
              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Buscar bebidas, combos, snacks..."
                className="w-full pl-12 pr-4 py-3.5 bg-transparent text-gray-900 placeholder:text-gray-500 outline-none font-medium rounded-full text-base"
              />
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
