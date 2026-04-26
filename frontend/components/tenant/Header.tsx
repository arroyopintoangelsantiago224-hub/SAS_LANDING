'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search, User, X } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Cerrar menú al cambiar de tamaño de pantalla
  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-300",
          isScrolled || isMenuOpen
            ? "bg-white/95 backdrop-blur-xl border-b border-gray-100 py-2 shadow-sm" 
            : "bg-transparent py-4"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo & Name */}
          <Link href="/" className="flex items-center group flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
            <div 
              className="w-9 h-9 sm:w-11 sm:h-11 rounded-xl sm:rounded-2xl flex items-center justify-center text-white font-bold text-lg sm:text-2xl shadow-lg transition-transform group-hover:scale-105 active:scale-95"
              style={{ 
                backgroundColor: siteConfig.colors.primary,
                boxShadow: `0 8px 16px -4px ${siteConfig.colors.primary}40`
              }}
            >
              {siteConfig.name.charAt(0)}
            </div>
            <div className="ml-2 sm:ml-3 flex flex-col">
              <span className={cn(
                "font-black text-base sm:text-xl tracking-tight leading-none transition-colors",
                (!isScrolled && !isMenuOpen) ? "text-white sm:text-gray-900" : "text-gray-900"
              )}>
                {siteConfig.name}
              </span>
              <span className="text-[8px] sm:text-[10px] uppercase tracking-widest font-bold text-gray-400 leading-tight">
                Gourmet
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            {['Catálogo', 'Nosotros', 'Contacto'].map((item) => (
              <Link 
                key={item} 
                href={`/${item.toLowerCase()}`}
                className={cn(
                  "text-sm font-semibold transition-colors hover:text-gray-900",
                  isScrolled ? "text-gray-600" : "text-white/80 hover:text-white"
                )}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-2">
            <button className={cn(
              "p-2.5 rounded-xl transition-all hover:bg-gray-100 active:scale-90",
              (!isScrolled && !isMenuOpen) ? "text-white md:text-gray-600 hover:bg-white/10" : "text-gray-600"
            )}>
              <Search className="w-5 h-5" />
            </button>
            
            <Link 
              href="/carrito" 
              className={cn(
                "relative p-2.5 rounded-xl transition-all hover:bg-gray-100 active:scale-90",
                (!isScrolled && !isMenuOpen) ? "text-white md:text-gray-600 hover:bg-white/10" : "text-gray-600"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-white text-[10px] font-black px-1.5 py-0.5 rounded-lg min-w-[20px] text-center shadow-md animate-in zoom-in"
                  style={{ backgroundColor: siteConfig.colors.primary }}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "p-2.5 rounded-xl transition-all hover:bg-gray-100 active:scale-90 md:hidden",
                (!isScrolled && !isMenuOpen) ? "text-white hover:bg-white/10" : "text-gray-600"
              )}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden md:block h-6 w-[1px] bg-gray-200 mx-2" />

            <button 
              className="hidden md:flex items-center space-x-2 px-4 py-2 rounded-xl font-bold text-sm transition-all active:scale-95"
              style={{ 
                backgroundColor: isScrolled ? siteConfig.colors.primary : 'white',
                color: isScrolled ? 'white' : siteConfig.colors.primary,
                boxShadow: isScrolled ? `0 4px 12px ${siteConfig.colors.primary}30` : 'none'
              }}
            >
              <User className="w-4 h-4" />
              <span>Mi Perfil</span>
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white transition-all duration-500 md:hidden",
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-x-full"
      )}>
        <div className="flex flex-col h-full pt-24 px-6">
          <nav className="flex flex-col space-y-6">
            {['Catálogo', 'Nosotros', 'Contacto', 'Mi Perfil'].map((item, index) => (
              <Link
                key={item}
                href={`/${item.toLowerCase().replace(' ', '-')}`}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-3xl font-black text-gray-900 transition-all duration-300 transform",
                  isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {item}
              </Link>
            ))}
          </nav>
          
          <div className="mt-auto mb-10 space-y-6">
            <div className="h-[1px] w-full bg-gray-100" />
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-bold text-gray-400 uppercase tracking-widest">Llámanos</p>
                <p className="text-xl font-black text-gray-900">{siteConfig.whatsapp}</p>
              </div>
              <div 
                className="w-12 h-12 rounded-2xl flex items-center justify-center text-white"
                style={{ backgroundColor: siteConfig.colors.primary }}
              >
                <User className="w-6 h-6" />
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
