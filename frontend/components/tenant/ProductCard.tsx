'use client';

import { Plus } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { siteConfig } from '@/config/site';

interface ProductCardProps {
  product: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number;
    imagen_url?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);

  return (
    <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden hover:shadow-lg hover:shadow-gray-200/50 transition-all duration-300 group">
      {/* Product Image */}
      <div className="relative aspect-square overflow-hidden bg-gray-50">
        {product.imagen_url ? (
          <img 
            src={product.imagen_url} 
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-gray-300 italic text-sm">
            Sin imagen
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-4">
        <h3 className="font-semibold text-gray-900 mb-1 line-clamp-1">{product.nombre}</h3>
        <p className="text-gray-500 text-sm line-clamp-2 mb-4 h-10">
          {product.descripcion}
        </p>
        
        <div className="flex items-center justify-between">
          <span className="text-lg font-bold text-gray-900">
            ${product.precio.toFixed(2)}
          </span>
          <button 
            onClick={() => addItem(product)}
            className="p-2.5 rounded-xl text-white shadow-lg shadow-gray-200 hover:scale-105 active:scale-95 transition-all"
            style={{ backgroundColor: siteConfig.colors.primary }}
          >
            <Plus className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
}
