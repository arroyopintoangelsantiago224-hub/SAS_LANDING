'use client';

import { siteConfig } from '@/config/site';
import ProductCard from '@/components/tenant/ProductCard';

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
  return (
    <div className="pb-20">
      {/* Hero Section */}
      <section 
        className="py-12 md:py-20 text-white"
        style={{ backgroundColor: siteConfig.colors.primary }}
      >
        <div className="container mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-extrabold mb-4">
            {siteConfig.name}
          </h1>
          <p className="text-lg md:text-xl opacity-90 max-w-2xl mx-auto">
            {siteConfig.description}
          </p>
        </div>
      </section>

      {/* Main Content */}
      <div className="container mx-auto px-4 -mt-10">
        {/* Categories Bar (Static for now) */}
        <div className="flex space-x-2 overflow-x-auto pb-4 mb-8 no-scrollbar">
          {['Todos', 'Hamburguesas', 'Pizzas', 'Snacks', 'Bebidas'].map((cat, i) => (
            <button
              key={cat}
              className={`px-6 py-2.5 rounded-full text-sm font-medium whitespace-nowrap shadow-sm transition-all ${
                i === 0 
                ? 'bg-white text-gray-900 ring-2 ring-offset-2 ring-gray-200' 
                : 'bg-white/80 text-gray-600 hover:bg-white'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {MOCK_PRODUCTS.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      </div>
    </div>
  );
}
