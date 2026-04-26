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
  const [isScrolled, setIsScrolled] = useState(false);

  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 400);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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

      <div className="container mx-auto px-4 mt-8 md:mt-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 md:gap-6 mb-8 md:mb-12">
          <div>
            <h1 className="text-2xl md:text-3xl font-black tracking-tight mb-1 md:mb-2 text-gray-900 dark:text-white">Nuestra Selección</h1>
            <p className="text-[var(--muted)] text-xs md:text-sm">Explora nuestros productos exclusivos</p>
          </div>

          <div className="hidden md:flex items-center gap-3">
            <div className="flex items-center gap-2 px-4 py-2 bg-[var(--card2)] rounded-full text-[10px] font-bold uppercase tracking-widest text-[var(--muted)]">
              <LayoutGrid className="w-3.5 h-3.5" />
              Grid View
            </div>
          </div>
        </div>

        {/* Categorías Modernas (Sticky Refined) */}
        <div className={cn(
          "sticky top-16 z-40 py-4 md:py-6 -mx-4 px-4 mb-8 md:mb-10 overflow-x-auto no-scrollbar flex items-center space-x-3 md:space-x-4 transition-all duration-500",
          isScrolled
            ? "bg-white/80 dark:bg-[#0A0A0C]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 shadow-xl"
            : "bg-transparent"
        )}>
          <button
            onClick={() => setActiveCategoryId('Todos')}
            className={cn(
              "px-5 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 whitespace-nowrap border-2",
              activeCategoryId === 'Todos'
                ? "text-black border-transparent shadow-2xl scale-105"
                : "bg-transparent text-[var(--muted)] border-[var(--border2)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
            )}
            style={{
              backgroundColor: activeCategoryId === 'Todos' ? primaryColor : undefined,
              boxShadow: activeCategoryId === 'Todos' ? `0 10px 20px -5px ${primaryColor}60` : 'none'
            }}
          >
            Todos
          </button>

          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setActiveCategoryId(cat.id)}
              className={cn(
                "px-5 md:px-8 py-2 md:py-3 rounded-full text-[9px] md:text-[10px] font-black uppercase tracking-[0.15em] transition-all duration-500 whitespace-nowrap border-2",
                activeCategoryId === cat.id
                  ? "text-black border-transparent shadow-2xl scale-105"
                  : "bg-transparent text-[var(--muted)] border-[var(--border2)] hover:border-[var(--accent)] hover:text-[var(--accent)]"
              )}
              style={{
                backgroundColor: activeCategoryId === cat.id ? primaryColor : undefined,
                boxShadow: activeCategoryId === cat.id ? `0 10px 20px -5px ${primaryColor}60` : 'none'
              }}
            >
              {cat.nombre}
            </button>
          ))}
        </div>

        {/* Product Grid - 2 columns on mobile */}
        {loading ? (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {[1, 2, 3, 4, 5, 6, 7, 8].map((i) => (
              <div key={i} className="aspect-[3/4] md:aspect-[4/6] bg-[var(--card2)] rounded-[var(--radius2)] animate-pulse" />
            ))}
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3 md:gap-8">
            {products.length > 0 ? (
              products.map((product) => (
                <ProductCard key={product.id} product={product} />
              ))
            ) : (
              <div className="col-span-full text-center py-20 md:py-32 border-2 border-dashed border-[var(--border2)] rounded-[var(--radius2)]">
                <ListFilter className="w-8 h-8 md:w-12 md:h-12 text-[var(--muted2)] mx-auto mb-4 opacity-20" />
                <p className="text-[var(--muted)] text-sm font-medium">No se encontraron productos.</p>
                <button
                  onClick={() => setActiveCategoryId('Todos')}
                  className="mt-4 text-[10px] md:text-xs font-bold uppercase tracking-widest underline decoration-2 underline-offset-4"
                  style={{ color: primaryColor }}
                >
                  Ver todo
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
