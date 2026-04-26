'use client';

import { Plus, ShoppingCart } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { siteConfig } from '@/config/site';

interface ProductCardProps {
  product: {
    id: number;
    nombre: string;
    descripcion: string;
    precio: number | string;
    imagen_url?: string;
  };
}

export default function ProductCard({ product }: ProductCardProps) {
  const addItem = useCartStore((state) => state.addItem);
  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;

  return (
    <div className="group relative bg-white dark:bg-[var(--card)] rounded-[var(--radius2)] border border-[var(--border)] overflow-hidden hover:shadow-2xl hover:shadow-[var(--accent)]/10 transition-all duration-500 hover:-translate-y-1">
      {/* Product Image Container */}
      <div className="relative aspect-[4/5] overflow-hidden bg-[var(--card2)]">
        {product.imagen_url ? (
          <img 
            src={product.imagen_url} 
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--muted2)] bg-[var(--card2)]">
            <ImageIcon className="w-12 h-12 opacity-10" />
          </div>
        )}
        
        {/* Floating Price Tag */}
        <div className="absolute top-4 left-4 glass px-3 py-1.5 rounded-full shadow-sm">
          <span className="text-sm font-black tracking-tight" style={{ color: primaryColor }}>
            ${Number(product.precio).toFixed(2)}
          </span>
        </div>

        {/* Quick Add Button Overlay */}
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center pointer-events-none">
          <button 
            onClick={(e) => { e.stopPropagation(); addItem(product); }}
            className="pointer-events-auto p-4 rounded-2xl text-black shadow-2xl scale-50 group-hover:scale-100 transition-all duration-500"
            style={{ backgroundColor: primaryColor }}
          >
            <ShoppingCart className="w-6 h-6" />
          </button>
        </div>
      </div>

      {/* Product Info */}
      <div className="p-6">
        <div className="mb-2">
          <h3 className="font-bold text-gray-900 dark:text-[var(--text)] text-lg line-clamp-1 group-hover:text-[var(--accent)] transition-colors">
            {product.nombre}
          </h3>
        </div>
        <p className="text-[var(--muted)] text-xs line-clamp-2 h-8 mb-6 leading-relaxed">
          {product.descripcion}
        </p>
        
        <button 
          onClick={() => addItem(product)}
          className="w-full py-3 rounded-xl border border-[var(--border2)] flex items-center justify-center gap-2 text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black hover:border-transparent transition-all"
        >
          <Plus className="w-4 h-4" />
          Añadir al Carrito
        </button>
      </div>
    </div>
  );
}

import { Image as ImageIcon } from 'lucide-react';
