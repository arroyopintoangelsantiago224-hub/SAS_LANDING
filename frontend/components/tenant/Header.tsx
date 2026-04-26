'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search, User, X } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { fetchConfigs } from '@/lib/api';

export default function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mounted, setMounted] = useState(false);
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const [configs, setConfigs] = useState<any>({});

  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;

  useEffect(() => {
    setMounted(true);
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    loadConfigs();
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  async function loadConfigs() {
    try {
      const data = await fetchConfigs();
      setConfigs(data);
    } catch (error) {
      console.error('Error loading header configs:', error);
    }
  }

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth >= 768) setIsMenuOpen(false);
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const siteName = configs.site_name || siteConfig.name;

  return (
    <>
      <header 
        className={cn(
          "fixed top-0 z-50 w-full transition-all duration-500",
          isScrolled || isMenuOpen
            ? "bg-white/80 dark:bg-[#0A0A0C]/80 backdrop-blur-xl border-b border-black/5 dark:border-white/5 py-3 shadow-sm" 
            : "bg-transparent py-6"
        )}
      >
        <div className="container mx-auto px-4 flex items-center justify-between">
          {/* Logo & Name */}
          <Link href="/" className="flex items-center group flex-shrink-0" onClick={() => setIsMenuOpen(false)}>
            {configs.site_logo ? (
              <div className="w-10 h-10 md:w-12 md:h-12 overflow-hidden transition-transform group-hover:scale-105 active:scale-95">
                <img src={configs.site_logo} alt={siteName} className="w-full h-full object-contain" />
              </div>
            ) : (
              <div 
                className="w-10 h-10 rounded-xl flex items-center justify-center text-black font-black text-xl shadow-lg transition-transform group-hover:scale-105 active:scale-95"
                style={{ 
                  backgroundColor: primaryColor,
                  boxShadow: `0 8px 16px -4px ${primaryColor}40`
                }}
              >
                {siteName.charAt(0)}
              </div>
            )}
            <div className="ml-3 flex flex-col">
              <span className={cn(
                "font-black text-lg tracking-tighter leading-none transition-colors",
                (!isScrolled && !isMenuOpen) ? "text-white" : "text-gray-900 dark:text-white"
              )}>
                {siteName}
              </span>
              <span className="text-[9px] uppercase tracking-[0.2em] font-black text-gray-500 dark:text-gray-400 leading-tight mt-0.5">
                {configs.site_description || 'Premium Store'}
              </span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-10">
            {['Catálogo', 'Nosotros', 'Contacto'].map((item) => (
              <Link 
                key={item} 
                href={item === 'Catálogo' ? '/catalogo' : `/${item.toLowerCase()}`}
                className={cn(
                  "text-xs font-black uppercase tracking-widest transition-all hover:scale-105",
                  isScrolled ? "text-gray-600 dark:text-gray-400 hover:text-black dark:hover:text-white" : "text-white/80 hover:text-white"
                )}
              >
                {item}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center space-x-3">
            <Link 
              href="/carrito" 
              className={cn(
                "relative p-2.5 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-white/5 active:scale-90",
                (!isScrolled && !isMenuOpen) ? "text-white" : "text-gray-600 dark:text-white"
              )}
              onClick={() => setIsMenuOpen(false)}
            >
              <ShoppingCart className="w-5 h-5" />
              {mounted && itemCount > 0 && (
                <span 
                  className="absolute -top-1 -right-1 text-black text-[10px] font-black px-1.5 py-0.5 rounded-lg min-w-[20px] text-center shadow-md animate-in zoom-in"
                  style={{ backgroundColor: primaryColor }}
                >
                  {itemCount}
                </span>
              )}
            </Link>

            <button 
              onClick={() => setIsMenuOpen(!isMenuOpen)}
              className={cn(
                "p-2.5 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-white/5 active:scale-90 md:hidden",
                (!isScrolled && !isMenuOpen) ? "text-white" : "text-gray-600 dark:text-white"
              )}
            >
              {isMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>

            <div className="hidden md:block h-6 w-[1px] bg-black/5 dark:bg-white/5 mx-2" />

            <Link 
              href="/admin"
              className="hidden md:flex items-center space-x-2 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl"
              style={{ 
                backgroundColor: primaryColor,
                color: 'black',
                boxShadow: `0 10px 20px -5px ${primaryColor}40`
              }}
            >
              <User className="w-3.5 h-3.5" />
              <span>Admin</span>
            </Link>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <div className={cn(
        "fixed inset-0 z-40 bg-white dark:bg-[#0A0A0C] transition-all duration-700 md:hidden",
        isMenuOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none translate-x-full"
      )}>
        <div className="flex flex-col h-full pt-32 px-8">
          <nav className="flex flex-col space-y-8">
            {['Catálogo', 'Nosotros', 'Contacto', 'Admin'].map((item, index) => (
              <Link
                key={item}
                href={item === 'Catálogo' ? '/catalogo' : item === 'Admin' ? '/admin' : `/${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-4xl font-black text-gray-900 dark:text-white transition-all duration-500 transform",
                  isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {item}
              </Link>
            ))}
          </nav>
        </div>
      </div>
    </>
  );
}
