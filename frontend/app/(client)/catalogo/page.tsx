'use client';

import { siteConfig } from '@/config/site';
import ProductCard from '@/components/tenant/ProductCard';
import BannerCarousel from '@/components/tenant/BannerCarousel';
import { cn } from '@/lib/utils';
import { useState, useEffect } from 'react';
import { fetchCategories, fetchProducts } from '@/lib/api';
import { LayoutGrid, ListFilter } from 'lucide-react';

export default function CatalogoPage() {
  const [activeCategoryId, setActiveCategoryId] = useState<number | 'Todos'>('Todos');
  const [categories, setCategories] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;

  useEffect(() => {
    async function loadInitialData() {
      try {
        const [cats, prods] = await Promise.all([
          fetchCategories(),
          fetchProducts()
        ]);
        setCategories(cats);
        setProducts(prods);
      } catch (error) {
        console.error('Error loading catalog data:', error);
      } finally {
        setLoading(false);
      }
    }
    loadInitialData();
  }, []);

  useEffect(() => {
    async function filterProducts() {
      setLoading(true);
      try {
        const prods = await fetchProducts(activeCategoryId === 'Todos' ? undefined : activeCategoryId);
        setProducts(prods);
      } catch (error) {
        console.error('Error filtering products:', error);
      } finally {
        setLoading(false);
      }
    }
    if (categories.length > 0) {
      filterProducts();
    }
  }, [activeCategoryId]);

  return (
    <div className="pb-20 bg-[var(--bg)] min-h-screen">
      {/* Carrusel de Banners */}
      <BannerCarousel />

      <div className="container mx-auto px-4 mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-12">
          <div>
            <h1 className="text-3xl font-black tracking-tight mb-2">Nuestra Selección</h1>
            <p className="text-[var(--muted)] text-sm">Explora nuestros productos exclusivos y ofertas especiales</p>
          </div>
          
          <div className="flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--card2)] rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid View
            </div>
          </div>
        </div>

        {/* Categorías Modernas (Pills con diseño App-like) */}
        <div className="sticky top-20 z-40 py-6 -mx-4 px-4 mb-10 overflow-x-auto no-scrollbar flex items-center space-x-4 bg-[var(--bg)]/80 backdrop-blur-xl">
          <button
            onClick={() => setActiveCategoryId('Todos')}
            className={cn(
              "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap border-2",
              activeCategoryId === 'Todos'
                ? "text-black border-transparent shadow-2xl shadow-[var(--accent)]/20 scale-105"
                : "bg-transparent text-[var(--muted)] border-[var(--border2)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            )}
            style={{ 
              backgroundColor: activeCategoryId === 'Todos' ? primaryColor : undefined,
            }}
          >
            Todos los productos
          </button>
          
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={cn(
                "px-8 py-3 rounded-full text-xs font-black uppercase tracking-widest transition-all duration-300 whitespace-nowrap border-2",
                activeCategoryId === cat.id
                  ? "text-black border-transparent shadow-2xl shadow-[var(--accent)]/20 scale-105"
                  : "bg-transparent text-[var(--muted)] border-[var(--border2)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              )}
              style={{ 
                backgroundColor: activeCategoryId === cat.id ? primaryColor : undefined,
              }}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Product Grid */}
        {loading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[4/6] bg-[var(--card2)] rounded-[var(--radius2)] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-32 border-2 border-dashed border-[var(--border2)] rounded-[var(--radius2)]">
                <ListFilter className="w-12 h-12 text-[var(--muted2)] mx-auto mb-4 opacity-20" />
                <p className="text-[var(--muted)] font-medium">No se encontraron productos en esta categoría.</p>
                <button 
                  onClick={() => setActiveCategoryId('Todos')}
                  className="mt-4 text-xs font-bold uppercase tracking-widest"
                  style={{ color: primaryColor }}
                >
                  Ver todo el catálogo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
