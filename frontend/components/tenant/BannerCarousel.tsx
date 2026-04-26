'use client';

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import { siteConfig } from '@/config/site';
import { ChevronLeft, ChevronRight, ArrowRight } from 'lucide-react';
import { fetchBanners } from '@/lib/api';
import { cn } from '@/lib/utils';

interface Banner {
  id: number;
  titulo: string;
  subtitulo: string;
  imagen_url: string;
}

export default function BannerCarousel() {
  const [banners, setBanners] = useState<Banner[]>([]);
  const [emblaRef, emblaApi] = useEmblaCarousel({ loop: true }, [Autoplay({ delay: 6000 })]);
  const [selectedIndex, setSelectedIndex] = useState(0);

  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;

  useEffect(() => {
    async function loadBanners() {
      try {
        const data = await fetchBanners();
        setBanners(data);
      } catch (error) {
        console.error('Error fetching banners:', error);
      }
    }
    loadBanners();
  }, []);

  useEffect(() => {
    if (!emblaApi) return;
    emblaApi.on('select', () => {
      setSelectedIndex(emblaApi.selectedScrollSnap());
    });
  }, [emblaApi]);

  if (banners.length === 0) {
    return <div className="h-[400px] md:h-[650px] bg-[var(--card2)] animate-pulse rounded-[var(--radius2)] mx-4 mt-4" />;
  }

  return (
    <div className="relative overflow-hidden h-[450px] md:h-[650px] md:rounded-[var(--radius2)] md:mx-4 md:mt-4 group shadow-2xl">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((banner) => (
            <div key={banner.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              {/* Image with Parallax Effect (Simulated) */}
              <img
                src={banner.imagen_url}
                alt={banner.titulo}
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ease-linear group-hover:scale-110"
              />
              
              {/* Modern Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
              
              <div className="relative z-20 h-full container mx-auto px-6 md:px-16 flex flex-col justify-end pb-20 md:pb-32">
                <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  <span className="inline-block px-4 py-1 rounded-full bg-[var(--accent)] text-black text-[10px] font-black uppercase tracking-[0.2em] mb-6">
                    Destacado
                  </span>
                  <h2 className="text-4xl md:text-8xl font-black text-white mb-6 leading-[0.9] tracking-tighter">
                    {banner.titulo}
                  </h2>
                  <p className="text-sm md:text-lg text-white/70 mb-10 leading-relaxed max-w-lg">
                    {banner.subtitulo}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      className="group px-8 py-4 rounded-full text-black font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 flex items-center gap-3"
                      style={{ 
                        backgroundColor: primaryColor,
                        boxShadow: `0 20px 40px -10px ${primaryColor}60`
                      }}
                    >
                      Ordenar Ahora
                      <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                    </button>
                    <button className="px-8 py-4 rounded-full bg-white/10 backdrop-blur-xl text-white border border-white/20 font-black text-xs uppercase tracking-widest transition-all hover:bg-white/20 active:scale-95">
                      Explorar Menú
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Navigation Controls */}
      <div className="absolute bottom-10 right-6 md:right-16 z-30 flex items-center gap-6">
        <div className="flex space-x-2">
          {banners.map((_, index) => (
            <button
              key={index}
              onClick={() => emblaApi?.scrollTo(index)}
              className={cn(
                "h-1 rounded-full transition-all duration-500",
                selectedIndex === index ? "w-12" : "w-4 bg-white/20 hover:bg-white/40"
              )}
              style={{ 
                backgroundColor: selectedIndex === index ? primaryColor : undefined 
              }}
            />
          ))}
        </div>
        <div className="flex gap-2">
          <button 
            onClick={() => emblaApi?.scrollPrev()}
            className="p-3 rounded-full glass hover:bg-[var(--accent)] hover:text-black transition-all border-white/10"
          >
            <ChevronLeft className="w-5 h-5 text-white group-hover:text-inherit" />
          </button>
          <button 
            onClick={() => emblaApi?.scrollNext()}
            className="p-3 rounded-full glass hover:bg-[var(--accent)] hover:text-black transition-all border-white/10"
          >
            <ChevronRight className="w-5 h-5 text-white group-hover:text-inherit" />
          </button>
        </div>
      </div>
    </div>
  );
}
