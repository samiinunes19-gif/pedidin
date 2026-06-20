'use client';

import Image from 'next/image';
import { ShoppingCart, Minus, Plus } from 'lucide-react';
import { useState } from 'react';
import { useCart } from '@/app/context/cart-context';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface ProductDetailClientProps {
  product: {
    id: string;
    name: string;
    description: string;
    price: number;
    discount: number;
    imageUrl: string;
    categoryName: string;
  };
}

export default function ProductDetailClient({ product }: ProductDetailClientProps) {
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCart();

  const finalPrice = product?.discount && product?.discount > 0
    ? (product?.price ?? 0) * (1 - (product?.discount ?? 0) / 100)
    : product?.price ?? 0;

  const handleAddToCart = () => {
    for (let i = 0; i < quantity; i++) {
      addItem({
        id: product?.id ?? '',
        name: product?.name ?? '',
        price: finalPrice,
        imageUrl: product?.imageUrl ?? '',
      });
    }
    toast.success(`${quantity}x ${product?.name} adicionado ao carrinho!`);
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="grid md:grid-cols-2 gap-8"
    >
      <div className="relative aspect-square bg-gray-100 rounded-2xl overflow-hidden">
        {product?.imageUrl && (
          <Image
            src={product?.imageUrl}
            alt={product?.name ?? ''}
            fill
            className="object-contain p-4"
          />
        )}
        {product?.discount && product?.discount > 0 && (
          <span className="absolute top-4 left-4 bg-red-500 text-white text-lg font-bold px-3 py-1 rounded-full">
            -{product?.discount}%
          </span>
        )}
      </div>

      <div className="flex flex-col">
        <span className="text-[#F7B731] text-sm font-semibold uppercase tracking-wide">
          {product?.categoryName}
        </span>
        <h1 className="text-2xl md:text-3xl font-bold text-gray-900 mt-2">
          {product?.name}
        </h1>
        {product?.description && (
          <p className="text-gray-600 mt-4">{product?.description}</p>
        )}

        <div className="mt-6">
          {product?.discount && product?.discount > 0 && (
            <p className="text-gray-400 line-through text-lg">
              R$ {product?.price?.toFixed(2)?.replace('.', ',')}
            </p>
          )}
          <p className="text-3xl font-bold text-[#F7B731]">
            R$ {finalPrice?.toFixed(2)?.replace('.', ',')}
          </p>
        </div>

        <div className="flex items-center gap-4 mt-8">
          <div className="flex items-center gap-3 bg-gray-100 rounded-full px-3 py-2">
            <button
              onClick={() => setQuantity(Math.max(1, quantity - 1))}
              className="w-8 h-8 flex items-center justify-center bg-white rounded-full shadow hover:bg-gray-50 transition-colors"
            >
              <Minus className="w-4 h-4" />
            </button>
            <span className="w-8 text-center font-bold text-lg">{quantity}</span>
            <button
              onClick={() => setQuantity(quantity + 1)}
              className="w-8 h-8 flex items-center justify-center bg-[#F7B731] rounded-full shadow hover:bg-[#E5A623] transition-colors"
            >
              <Plus className="w-4 h-4" />
            </button>
          </div>
          <button
            onClick={handleAddToCart}
            className="flex-1 flex items-center justify-center gap-2 bg-[#F7B731] hover:bg-[#E5A623] text-black font-bold py-3 px-6 rounded-full transition-colors shadow-lg"
          >
            <ShoppingCart className="w-5 h-5" />
            Adicionar ao Carrinho
          </button>
        </div>
      </div>
    </motion.div>
  );
}
