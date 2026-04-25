'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search, User } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';

export default function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <header 
      className={cn(
        "sticky top-0 z-50 w-full transition-all duration-300",
        isScrolled 
          ? "bg-white/90 backdrop-blur-xl border-b border-gray-100 py-2 shadow-sm" 
          : "bg-transparent py-4"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo & Name */}
        <Link href="/" className="flex items-center group">
          <div 
            className="w-11 h-11 rounded-2xl flex items-center justify-center text-white font-bold text-2xl shadow-lg transition-transform group-hover:scale-105 active:scale-95"
            style={{ 
              backgroundColor: siteConfig.colors.primary,
              boxShadow: `0 8px 16px -4px ${siteConfig.colors.primary}40`
            }}
          >
            {siteConfig.name.charAt(0)}
          </div>
          <div className="ml-3 flex flex-col">
            <span className={cn(
              "font-black text-xl tracking-tight leading-none transition-colors",
              !isScrolled && "text-white sm:text-gray-900" 
            )}>
              {siteConfig.name}
            </span>
            <span className="text-[10px] uppercase tracking-widest font-bold text-gray-400 leading-tight">
              Gourmet Experience
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
            !isScrolled && "text-white md:text-gray-600 hover:bg-white/10"
          )}>
            <Search className="w-5 h-5" />
          </button>
          
          <Link 
            href="/carrito" 
            className={cn(
              "relative p-2.5 rounded-xl transition-all hover:bg-gray-100 active:scale-90",
              !isScrolled && "text-white md:text-gray-600 hover:bg-white/10"
            )}
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

          <button className={cn(
            "p-2.5 rounded-xl transition-all hover:bg-gray-100 active:scale-90 md:hidden",
            !isScrolled && "text-white md:text-gray-600 hover:bg-white/10"
          )}>
            <Menu className="w-5 h-5" />
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
  );
}
