'use client';

import React, { useEffect, useState } from 'react';
import useEmblaCarousel from 'embla-carousel-react';
import Autoplay from 'embla-carousel-autoplay';
import Link from 'next/link';
import { siteConfig } from '@/config/site';
import { ChevronLeft, ChevronRight } from 'lucide-react';
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
    return <div className="h-[250px] md:h-[650px] bg-[var(--card2)] animate-pulse rounded-[var(--radius2)] mx-4 mt-4" />;
  }

  return (
    <>
      <div className="relative overflow-hidden h-[250px] md:h-[650px] rounded-[var(--radius2)] mx-4 mt-4 group shadow-2xl">
      <div className="overflow-hidden h-full" ref={emblaRef}>
        <div className="flex h-full">
          {banners.map((banner) => (
            <div key={banner.id} className="relative flex-[0_0_100%] min-w-0 h-full">
              {/* Image with Parallax Effect (Simulated) */}
              <img
                src={banner.imagen_url}
                alt={banner.titulo}
                loading="eager"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-[10000ms] ease-linear group-hover:scale-110"
              />

              
              {/* Modern Overlay */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent z-10" />
              <div className="absolute inset-0 bg-gradient-to-r from-black/60 via-transparent to-transparent z-10" />
              
              <div className="relative z-20 h-full container mx-auto px-6 md:px-16 flex flex-col justify-end pb-10 md:pb-32">
                <div className="max-w-3xl animate-in fade-in slide-in-from-bottom-12 duration-1000">
                  <h2 className="text-2xl md:text-8xl font-black text-white mb-2 md:mb-6 leading-[0.9] tracking-tighter">
                    {banner.titulo}
                  </h2>
                  <p className="text-[10px] md:text-lg text-white/70 mb-4 md:mb-10 leading-relaxed max-w-lg">
                    {banner.subtitulo}
                  </p>
                  <div className="flex flex-wrap gap-4">
                    <button 
                      onClick={() => {
                        const element = document.getElementById('menu-catalogo');
                        if (element) {
                          const offset = 80;
                          const elementPosition = element.getBoundingClientRect().top + window.pageYOffset;
                          const startPosition = window.pageYOffset;
                          const distance = elementPosition - startPosition - offset;
                          let startTime: number | null = null;
                          const duration = 1200; // 1.2 seconds for a slower feel

                          function animation(currentTime: number) {
                            if (startTime === null) startTime = currentTime;
                            const timeElapsed = currentTime - startTime;
                            const run = ease(timeElapsed, startPosition, distance, duration);
                            window.scrollTo(0, run);
                            if (timeElapsed < duration) requestAnimationFrame(animation);
                          }

                          function ease(t: number, b: number, c: number, d: number) {
                            t /= d / 2;
                            if (t < 1) return c / 2 * t * t + b;
                            t--;
                            return -c / 2 * (t * (t - 2) - 1) + b;
                          }

                          requestAnimationFrame(animation);
                        }
                      }}
                      className="px-8 py-3 md:px-10 md:py-4 rounded-full text-black font-black text-[10px] md:text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95 shadow-xl"
                      style={{ 
                        backgroundColor: primaryColor,
                        boxShadow: `0 10px 30px -5px ${primaryColor}60`
                      }}
                    >
                      Ver Menú
                    </button>
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Modern Navigation Controls */}
      <div className="absolute bottom-6 md:bottom-10 right-0 left-0 md:left-auto md:right-16 z-30 flex flex-col md:flex-row items-center gap-6 px-6">
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
      </div>

      {/* Side Arrows - Only if more than 1 banner */}
      {banners.length > 1 && (
        <>
          <button 
            onClick={() => emblaApi?.scrollPrev()}
            className="absolute left-2 md:left-8 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full glass hover:bg-[var(--accent)] hover:text-black transition-all border-white/10"
          >
            <ChevronLeft className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-inherit" />
          </button>
          <button 
            onClick={() => emblaApi?.scrollNext()}
            className="absolute right-2 md:right-8 top-1/2 -translate-y-1/2 z-40 p-2 md:p-3 rounded-full glass hover:bg-[var(--accent)] hover:text-black transition-all border-white/10"
          >
            <ChevronRight className="w-4 h-4 md:w-5 md:h-5 text-white group-hover:text-inherit" />
          </button>
        </>
      )}
    </div>

    {/* Mobile Navigation Links (Below Carousel) */}
    <div className="md:hidden flex items-center justify-center gap-6 py-6 border-b border-black/5 dark:border-white/5">
      {['Catálogo', 'Nosotros', 'Contacto'].map((item) => (
        <Link 
          key={item} 
          href={item === 'Catálogo' ? '/catalogo' : `/${item.toLowerCase()}`}
          className="text-[10px] font-black uppercase tracking-widest text-gray-500 hover:text-black dark:hover:text-white transition-colors"
        >
          {item}
        </Link>
      ))}
    </div>
    </>
  );
}
