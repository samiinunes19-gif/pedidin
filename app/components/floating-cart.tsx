'use client';

import { useCart } from '@/app/context/cart-context';
import { ShoppingBag, ChevronRight } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';

export default function FloatingCart() {
  const { items, total, itemCount, setIsOpen } = useCart();

  if (itemCount === 0) return null;

  return (
    <AnimatePresence>
      <motion.div
        initial={{ y: 100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        exit={{ y: 100, opacity: 0 }}
        transition={{ type: 'spring', stiffness: 300, damping: 30 }}
        className="fixed bottom-0 left-0 right-0 z-50 p-3 bg-transparent"
      >
        <button
          onClick={() => setIsOpen(true)}
          className="w-full max-w-md mx-auto flex items-center justify-between bg-[#F7B731] hover:bg-[#E5A623] text-black rounded-full px-5 py-3.5 shadow-lg transition-all active:scale-[0.98]"
        >
          <div className="flex items-center gap-3">
            <div className="relative">
              <ShoppingBag className="w-6 h-6" />
              <span className="absolute -top-2 -right-2 bg-black text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center">
                {itemCount}
              </span>
            </div>
            <span className="font-semibold text-sm">Ver carrinho</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-bold text-lg">
              R$ {total.toFixed(2).replace('.', ',')}
            </span>
            <ChevronRight className="w-5 h-5" />
          </div>
        </button>
      </motion.div>
    </AnimatePresence>
  );
}
