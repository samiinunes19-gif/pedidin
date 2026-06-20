'use client';

import { useCart } from '../context/cart-context';
import { X, Minus, Plus, Trash2, ShoppingBag } from 'lucide-react';
import Image from 'next/image';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function CartDrawer() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, total, itemCount } = useCart();

  const freeDeliveryThreshold = 20;
  const deliveryFee = total >= freeDeliveryThreshold ? 0 : 5;
  const remaining = freeDeliveryThreshold - total;

  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-black/60 z-[100]"
          />
          <motion.div
            initial={{ x: '100%' }}
            animate={{ x: 0 }}
            exit={{ x: '100%' }}
            transition={{ type: 'spring', damping: 25, stiffness: 200 }}
            className="fixed right-0 top-0 h-full w-full max-w-md bg-white shadow-2xl z-[150] flex flex-col"
          >
            <div className="p-4 border-b border-gray-200 flex items-center justify-between bg-gray-50">
              <div className="flex items-center gap-2">
                <ShoppingBag className="w-6 h-6 text-[#F7B731]" />
                <h2 className="text-lg font-bold">Carrinho ({itemCount})</h2>
              </div>
              <button onClick={() => setIsOpen(false)} className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                <X className="w-5 h-5" />
              </button>
            </div>

            {remaining > 0 && (
              <div className="px-4 py-2 bg-yellow-50 border-b border-yellow-200">
                <p className="text-sm text-yellow-800">
                  Faltam <strong>R$ {remaining?.toFixed(2)?.replace('.', ',')}</strong> para frete grátis!
                </p>
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
              {(items?.length ?? 0) === 0 ? (
                <div className="flex flex-col items-center justify-center h-full text-gray-400">
                  <ShoppingBag className="w-16 h-16 mb-4" />
                  <p className="text-lg">Seu carrinho está vazio</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {items?.map((item) => (
                    <div key={item?.id} className="flex gap-3 p-3 bg-gray-50 rounded-xl">
                      <div className="relative w-20 h-20 bg-white rounded-lg overflow-hidden flex-shrink-0">
                        {item?.imageUrl && (
                          <Image src={item?.imageUrl} alt={item?.name ?? ''} fill className="object-contain p-1" />
                        )}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-semibold text-sm line-clamp-2">{item?.name}</h3>
                        <p className="text-[#F7B731] font-bold mt-1">
                          R$ {item?.price?.toFixed(2)?.replace('.', ',')}
                        </p>
                        <div className="flex items-center gap-2 mt-2">
                          <button
                            onClick={() => updateQuantity(item?.id, (item?.quantity ?? 1) - 1)}
                            className="w-7 h-7 flex items-center justify-center bg-gray-200 hover:bg-gray-300 rounded-full transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </button>
                          <span className="font-semibold w-6 text-center">{item?.quantity}</span>
                          <button
                            onClick={() => updateQuantity(item?.id, (item?.quantity ?? 0) + 1)}
                            className="w-7 h-7 flex items-center justify-center bg-[#F7B731] hover:bg-[#E5A623] rounded-full transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => removeItem(item?.id)}
                            className="ml-auto p-1.5 text-red-500 hover:bg-red-50 rounded-full transition-colors"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {(items?.length ?? 0) > 0 && (
              <div className="p-4 border-t border-gray-200 bg-gray-50 space-y-3">
                <div className="flex justify-between text-sm">
                  <span>Subtotal</span>
                  <span>R$ {total?.toFixed(2)?.replace('.', ',')}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span>Frete</span>
                  <span className={deliveryFee === 0 ? 'text-green-600 font-semibold' : ''}>
                    {deliveryFee === 0 ? 'Grátis' : `R$ ${deliveryFee?.toFixed(2)?.replace('.', ',')}`}
                  </span>
                </div>
                <div className="flex justify-between font-bold text-lg border-t pt-3">
                  <span>Total</span>
                  <span className="text-[#F7B731]">
                    R$ {(total + deliveryFee)?.toFixed(2)?.replace('.', ',')}
                  </span>
                </div>
                <Link
                  href="/checkout"
                  onClick={() => setIsOpen(false)}
                  className="block w-full bg-[#F7B731] hover:bg-[#E5A623] text-black font-bold py-3 rounded-full text-center transition-colors shadow-lg"
                >
                  Finalizar Pedido
                </Link>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
