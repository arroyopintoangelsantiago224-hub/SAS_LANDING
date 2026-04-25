'use client';

import { siteConfig } from '@/config/site';
import ProductCard from '@/components/tenant/ProductCard';
import BannerCarousel from '@/components/tenant/BannerCarousel';
import { cn } from '@/lib/utils';
import { useState } from 'react';

// Datos de prueba (estos vendrán del Backend después)
const MOCK_PRODUCTS = [
  {
    id: 1,
    nombre: 'Hamburguesa Clásica',
    descripcion: 'Deliciosa carne de res con queso cheddar, lechuga fresca y tomate.',
    precio: 8.50,
    imagen_url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 2,
    nombre: 'Pizza Margherita',
    descripcion: 'Pizza artesanal con salsa de tomate natural, mozzarella y albahaca fresca.',
    precio: 12.00,
    imagen_url: 'https://images.unsplash.com/photo-1604382354936-07c5d9983bd3?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 3,
    nombre: 'Papas Fritas XL',
    descripcion: 'Papas cortadas a mano, doble fritura para una crocancia perfecta.',
    precio: 4.50,
    imagen_url: 'https://images.unsplash.com/photo-1573080496219-bb080dd4f877?auto=format&fit=crop&q=80&w=800',
  },
  {
    id: 4,
    nombre: 'Malteada de Oreo',
    descripcion: 'Helado cremoso de vainilla mezclado con trozos de galleta Oreo original.',
    precio: 5.50,
    imagen_url: 'https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&q=80&w=800',
  },
];

export default function CatalogoPage() {
  const [activeCategory, setActiveCategory] = useState('Todos');

  return (
    <div className="pb-20">
      {/* Carrusel de Banners Personalizable */}
      <BannerCarousel />

      {/* Main Content */}
      <div className="container mx-auto px-4 mt-12">
        {/* Barra de Categorías Moderna */}
        <div className="sticky top-20 z-40 bg-gray-50/80 backdrop-blur-md py-4 -mx-4 px-4 mb-10 overflow-x-auto no-scrollbar flex items-center space-x-3">
          {['Todos', 'Hamburguesas', 'Pizzas', 'Snacks', 'Bebidas'].map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={cn(
                "px-8 py-3 rounded-2xl text-sm font-bold transition-all duration-300 whitespace-nowrap",
                activeCategory === cat
                  ? "text-white shadow-xl shadow-gray-200 scale-105"
                  : "bg-white text-gray-500 hover:text-gray-900 hover:bg-gray-100"
              )}
              style={{ 
                backgroundColor: activeCategory === cat ? siteConfig.colors.primary : undefined,
                boxShadow: activeCategory === cat ? `0 10px 20px -5px ${siteConfig.colors.primary}40` : undefined
              }}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
