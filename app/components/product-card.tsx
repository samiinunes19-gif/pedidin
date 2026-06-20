'use client';

import { Plus, ImageOff } from 'lucide-react';
import Image from 'next/image';
import { useCart } from '@/app/context/cart-context';
import { useState, useEffect, memo } from 'react';

interface ProductCardProps {
  id: string;
  name: string;
  price: number;
  discount: number;
  imageUrl: string;
  slug: string;
  compact?: boolean;
  index?: number;
}

function ProductCard({ id, name, price, discount, imageUrl, slug, compact = false, index = 0 }: ProductCardProps) {
  const { items, addItem, updateQuantity } = useCart();
  const [mounted, setMounted] = useState(false);
  const [imgError, setImgError] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const finalPrice = discount > 0 ? price * (1 - discount / 100) : price;
  const cartItem = mounted ? items.find((item) => item.id === id) : undefined;
  const quantity = cartItem?.quantity ?? 0;

  const handleAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({ id, name, price: finalPrice, imageUrl });
  };

  const handleDecrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(id, quantity - 1);
  };

  const handleIncrease = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    updateQuantity(id, quantity + 1);
  };

  return (
    <div className={`bg-white rounded-xl border border-gray-100 overflow-hidden flex flex-col ${
      compact ? 'flex-shrink-0 w-[160px]' : 'w-full'
    }`}>
      <figure className="w-full aspect-square relative" style={{ backgroundColor: '#f9fafb' }}>
        {imgError ? (
          <div className="w-full h-full flex items-center justify-center bg-gray-100">
            <ImageOff className="w-8 h-8 text-gray-300" />
          </div>
        ) : (
          <Image
            src={imageUrl || '/placeholder.png'}
            alt={name || 'Produto'}
            fill
            className="object-contain p-3"
            sizes={compact ? '140px' : '(max-width: 640px) 50vw, 180px'}
            loading={index < 4 ? 'eager' : 'lazy'}
            placeholder="blur"
            blurDataURL="data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAQAAAC1HAwCAAAAC0lEQVR42mNkqAcAAIUAgUCsPZQAAAAASUVORK5CYII="
            onError={() => setImgError(true)}
          />
        )}
        {discount > 0 && (
          <div className="absolute top-2 left-2">
            <span className="text-[10px] font-medium px-1.5 py-0.5 rounded bg-red-500 text-white">
              -{discount}%
            </span>
          </div>
        )}
      </figure>
      <div className="p-2.5 flex flex-col flex-grow">
        <h3 
          className="font-medium text-gray-700 leading-tight text-[11px] line-clamp-3 min-h-[40px]"
          title={name || 'Produto'}
        >
          {name || 'Produto'}
        </h3>
        <div className="mt-2 flex justify-between items-end">
          <div>
            {discount > 0 && (
              <p className="text-xs text-red-400 line-through font-medium">
                R$ {price.toFixed(2).replace('.', ',')}
              </p>
            )}
            <p className="text-base font-bold text-emerald-600">
              R$ {finalPrice.toFixed(2).replace('.', ',')}
            </p>
          </div>
          {quantity === 0 ? (
            <button
              onClick={handleAdd}
              className="w-9 h-9 bg-emerald-500 text-white rounded-full flex items-center justify-center hover:bg-emerald-600 transition-all hover:scale-105 shadow-md shrink-0 active:scale-95"
              aria-label="Adicionar ao carrinho"
            >
              <Plus className="w-5 h-5" strokeWidth={2.5} />
            </button>
          ) : (
            <div className="flex items-center gap-1 bg-emerald-500 rounded-full px-1.5 py-1">
              <button
                onClick={handleDecrease}
                className="w-7 h-7 text-white flex items-center justify-center hover:bg-emerald-600 rounded-full text-lg font-bold active:scale-95"
                aria-label="Diminuir quantidade"
              >
                −
              </button>
              <span className="text-white font-bold text-sm min-w-[20px] text-center">{quantity}</span>
              <button
                onClick={handleIncrease}
                className="w-7 h-7 text-white flex items-center justify-center hover:bg-emerald-600 rounded-full text-lg font-bold active:scale-95"
                aria-label="Aumentar quantidade"
              >
                +
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default memo(ProductCard);
