'use client';

import { Plus, ShoppingCart, Image as ImageIcon } from 'lucide-react';
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
    <div className="group relative bg-white dark:bg-[var(--card)] rounded-[var(--radius2)] border border-[var(--border)] overflow-hidden hover:shadow-2xl hover:shadow-[var(--accent)]/10 transition-all duration-500 md:hover:-translate-y-1">
      {/* Product Image Container */}
      <div className="relative aspect-[1/1.1] md:aspect-[4/5] overflow-hidden bg-[var(--card2)]">
        {product.imagen_url ? (
          <img 
            src={product.imagen_url} 
            alt={product.nombre}
            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-[var(--muted2)] bg-[var(--card2)]">
            <ImageIcon className="w-8 h-8 md:w-12 md:h-12 opacity-10" />
          </div>
        )}
        
        {/* Quick Add Button Overlay (Desktop Only for better UX) */}
        <div className="hidden md:flex absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 items-center justify-center pointer-events-none">
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
      <div className="p-3 md:p-6">
        <div className="mb-1 md:mb-2 flex items-center justify-between gap-2">
          <h3 className="font-bold text-gray-900 dark:text-[var(--text)] text-xs md:text-lg line-clamp-1 group-hover:text-[var(--accent)] transition-colors flex-grow">
            {product.nombre}
          </h3>
          <span className="text-[10px] md:text-sm font-black whitespace-nowrap" style={{ color: primaryColor }}>
            ${Number(product.precio).toLocaleString('es-CO')}
          </span>
        </div>
        <p className="text-[var(--muted)] text-[9px] md:text-xs line-clamp-2 h-6 md:h-8 mb-3 md:mb-6 leading-tight md:leading-relaxed">
          {product.descripcion}
        </p>
        
        <button 
          onClick={() => addItem(product)}
          className="w-full py-2 md:py-3 rounded-lg md:rounded-xl border border-[var(--border2)] flex items-center justify-center gap-1 md:gap-2 text-[9px] md:text-xs font-bold uppercase tracking-widest hover:bg-[var(--accent)] hover:text-black hover:border-transparent transition-all"
        >
          <Plus className="w-3 h-3 md:w-4 md:h-4" />
          <span className="hidden xs:inline">Añadir</span>
          <span className="xs:hidden">Agregar</span>
        </button>
      </div>
    </div>
  );
}
