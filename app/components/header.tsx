'use client';

import { ShoppingCart, Search } from 'lucide-react';
import { useCart } from '../context/cart-context';
import Link from 'next/link';

export default function Header() {
  const { itemCount, setIsOpen } = useCart();

  return (
    <header className="sticky top-0 z-50 bg-black/90 backdrop-blur-sm border-b border-gray-800">
      <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
        <Link href="/" className="text-[#F7B731] font-oswald text-2xl font-bold italic">
          ZÉ PEDIDOS
        </Link>
        <div className="flex items-center gap-4">
          <button
            onClick={() => setIsOpen(true)}
            className="relative p-2 text-white hover:text-[#F7B731] transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {itemCount > 0 && (
              <span className="absolute -top-1 -right-1 bg-[#F7B731] text-black text-xs font-bold w-5 h-5 rounded-full flex items-center justify-center">
                {itemCount}
              </span>
            )}
          </button>
        </div>
      </div>
    </header>
  );
}
