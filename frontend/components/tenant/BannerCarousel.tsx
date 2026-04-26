'use client';

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { siteConfig } from '@/config/site';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface Banner {
  id: number;
  title: string;
  subtitle: string;
  image: string;
}

// Estos datos se podrán configurar luego desde el backend/env
const DEFAULT_BANNERS: Banner[] = [
  {
    id: 1,
    title: 'Sabores que Enamoran',
    subtitle: 'Descubre nuestra selección premium de platos artesanales.',
    image: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?q=80&w=2070&auto=format&fit=crop',
  },
  {
    id: 2,
    title: 'Directo a tu Puerta',
    subtitle: 'Pedidos rápidos, calientes y con la mejor calidad.',
    image: 'https://images.unsplash.com/photo-1513104890138-7c749659a591?q=80&w=2070&auto=format&fit=crop',
  },
];

export default function BannerCarousel() {
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 5000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  return (
    <div className="relative overflow-hidden bg-gray-900 h-[400px] md:h-[600px] -mt-24">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {DEFAULT_BANNERS.map((banner) => (
            <div key={banner.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              {/* Overlay con gradiente */}
              <div className="absolute inset-0 bg-gradient-to-r from-black/80 via-black/40 to-transparent z-10" />
              
              <img
                src={banner.image}
                alt={banner.title}
                className="absolute inset-0 w-full h-full object-cover"
              />
              
              <div className="relative z-20 h-full container mx-auto px-4 flex flex-col justify-center items-start pt-16 md:pt-0">
                <div className="max-w-2xl animate-in fade-in slide-in-from-left-8 duration-1000">
                  <h2 className="text-3xl md:text-7xl font-black text-white mb-4 sm:mb-6 leading-tight">
                    {banner.title}
                  </h2>
                  <p className="text-base md:text-xl text-white/80 mb-8 sm:mb-10 leading-relaxed max-w-lg line-clamp-3 sm:line-clamp-none">
                    {banner.subtitle}
                  </p>
                  <div className="flex flex-wrap gap-3 sm:gap-4">
                    <button 
                      className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl text-white font-bold text-sm sm:text-lg transition-all hover:scale-105 active:scale-95 shadow-xl"
                      style={{ 
                        backgroundColor: siteConfig.colors.primary,
                        boxShadow: `0 12px 24px -6px ${siteConfig.colors.primary}60`
                      }}
                    >
                      Ordenar Ahora
                    </button>
                    <button className="px-6 py-3 sm:px-8 sm:py-4 rounded-xl sm:rounded-2xl bg-white/10 backdrop-blur-md text-white border border-white/20 font-bold text-sm sm:text-lg transition-all hover:bg-white/20 active:scale-95">
                      Ver Menú
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Indicadores */}
      <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 flex space-x-3">
        {DEFAULT_BANNERS.map((_, index) => (
          <button
            key={index}
            onClick={() => emblaApi?.scrollTo(index)}
            className={cn(
              "h-1.5 rounded-full transition-all duration-300",
              selectedIndex === index ? "w-8" : "w-2 bg-white/40 hover:bg-white/60"
            )}
            style={{ 
              backgroundColor: selectedIndex === index ? siteConfig.colors.primary : undefined 
            }}
          />
        ))}
      </div>

      {/* Controles laterales */}
      <button 
        onClick={() => emblaApi?.scrollPrev()}
        className="absolute left-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hidden md:block"
      >
        <ChevronLeft className="w-6 h-6" />
      </button>
      <button 
        onClick={() => emblaApi?.scrollNext()}
        className="absolute right-4 top-1/2 -translate-y-1/2 z-30 p-3 rounded-full bg-white/10 backdrop-blur-md border border-white/10 text-white hover:bg-white/20 transition-all hidden md:block"
      >
        <ChevronRight className="w-6 h-6" />
      </button>
    </div>
  );
}

// Necesitamos importar 'cn' ya que no se pasó automáticamente
function cn(...inputs: any[]) {
  return inputs.filter(Boolean).join(' ');
}
