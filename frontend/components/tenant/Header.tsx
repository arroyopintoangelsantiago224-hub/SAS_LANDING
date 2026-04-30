'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search, User, X, Settings, LogOut } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import { fetchConfigs } from '@/lib/api';
import CartSheet from './CartSheet';
import { signIn, signOut, useSession } from 'next-auth/react';
export default function Header() {
  const { data: session } = useSession();
  const { getItemCount, setCartOpen } = useCartStore();
  const itemCount = getItemCount();
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
            <button 
              onClick={() => {
                setCartOpen(true);
                setIsMenuOpen(false);
              }}
              className={cn(
                "relative p-2.5 rounded-xl transition-all hover:bg-gray-100 dark:hover:bg-white/5 active:scale-90",
                (!isScrolled && !isMenuOpen) ? "text-white" : "text-gray-600 dark:text-white"
              )}
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
            </button>

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

            <div className="relative group">
              {session?.user ? (
                <button 
                  className="hidden md:flex items-center space-x-2 p-1 pr-4 rounded-full bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 shadow-lg transition-all active:scale-95"
                >
                  <div className="w-8 h-8 rounded-full border border-black/5 overflow-hidden bg-gray-100 dark:bg-white/5 flex items-center justify-center">
                    {session.user.image ? (
                      <img 
                        src={session.user.image.startsWith('http') ? session.user.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${session.user.image}`} 
                        alt={session.user.name || ''} 
                        className="w-full h-full object-cover"
                        onError={(e) => {
                          const target = e.target as HTMLImageElement;
                          target.style.display = 'none';
                          target.parentElement!.innerHTML = '<div class="w-full h-full flex items-center justify-center bg-gray-200 text-gray-500 font-bold text-xs">' + (session.user?.name?.charAt(0) || 'U') + '</div>';
                        }}
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center bg-gray-100 dark:bg-white/10">
                        <User className="w-4 h-4 text-gray-400" />
                      </div>
                    )}
                  </div>
                  <div className="flex flex-col items-start">
                    <span className="text-[9px] font-black uppercase tracking-tight text-gray-900 dark:text-white leading-none">{session.user.name}</span>
                    <span className="text-[7px] font-bold text-gray-500 uppercase tracking-widest mt-0.5">Administrador</span>
                  </div>
                </button>
              ) : (
                <button 
                  className="hidden md:flex items-center space-x-2 px-6 py-2.5 rounded-full font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 shadow-xl"
                  style={{ 
                    backgroundColor: primaryColor,
                    color: 'black',
                    boxShadow: `0 10px 20px -5px ${primaryColor}40`
                  }}
                >
                  <User className="w-3.5 h-3.5" />
                  <span>Iniciar Sesión</span>
                </button>
              )}
              
              <div className="absolute right-0 mt-2 w-56 bg-white dark:bg-[#0A0A0C] border border-black/5 dark:border-white/5 rounded-2xl shadow-2xl opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-300 transform origin-top-right scale-95 group-hover:scale-100 z-50 overflow-hidden">
                <div className="p-4 border-b border-black/5 dark:border-white/5">
                  <p className="text-[9px] font-black uppercase tracking-widest text-gray-400">
                    {session?.user ? 'Tu Cuenta' : 'Panel de Administración'}
                  </p>
                </div>
                
                {session?.user ? (
                  <>
                    <Link href="/admin" className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white">
                      <Settings className="w-4 h-4" />
                      <span>Panel Admin</span>
                    </Link>
                    <button 
                      onClick={() => signOut()}
                      className="w-full flex items-center space-x-3 px-4 py-4 hover:bg-red-500/5 transition-colors text-[10px] font-black uppercase tracking-widest text-red-500"
                    >
                      <LogOut className="w-4 h-4" />
                      <span>Cerrar Sesión</span>
                    </button>
                  </>
                ) : (
                  <>
                    <button 
                      onClick={() => signIn('google')}
                      className="w-full flex items-center space-x-3 px-4 py-4 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[10px] font-black uppercase tracking-widest text-gray-900 dark:text-white"
                    >
                      <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                      <span>Continuar con Google</span>
                    </button>
                    <Link href="/admin" className="w-full flex items-center space-x-3 px-4 py-3 hover:bg-gray-50 dark:hover:bg-white/5 transition-colors text-[9px] font-black uppercase tracking-widest text-gray-400">
                      <span>Ir al panel (Demo)</span>
                    </Link>
                  </>
                )}
              </div>
            </div>
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
            {['Catálogo', 'Nosotros', 'Contacto', session?.user ? 'Mi Cuenta' : 'Iniciar Sesión'].map((item, index) => (
              <Link
                key={item}
                href={item === 'Catálogo' ? '/catalogo' : (item === 'Iniciar Sesión' || item === 'Mi Cuenta') ? '/admin' : `/${item.toLowerCase()}`}
                onClick={() => setIsMenuOpen(false)}
                className={cn(
                  "text-4xl font-black text-gray-900 dark:text-white transition-all duration-500 transform flex items-center gap-4",
                  isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                )}
                style={{ transitionDelay: `${index * 100}ms` }}
              >
                {item === 'Mi Cuenta' && session?.user?.image && (
                  <div className="w-10 h-10 rounded-full border border-black/5 overflow-hidden">
                    <img 
                      src={session.user.image.startsWith('http') ? session.user.image : `${process.env.NEXT_PUBLIC_API_URL?.replace('/api', '')}/storage/${session.user.image}`} 
                      alt={session.user.name || ''} 
                      className="w-full h-full object-cover"
                    />
                  </div>
                )}
                {item}
              </Link>
            ))}
            {session?.user && (
              <button
                onClick={() => {
                  setIsMenuOpen(false);
                  signOut();
                }}
                className={cn(
                  "text-4xl font-black text-red-500 transition-all duration-500 transform text-left",
                  isMenuOpen ? "translate-x-0 opacity-100" : "translate-x-12 opacity-0"
                )}
                style={{ transitionDelay: `${(['Catálogo', 'Nosotros', 'Contacto', 'Mi Cuenta'].length) * 100}ms` }}
              >
                Cerrar Sesión
              </button>
            )}
          </nav>
        </div>
      </div>

      <CartSheet />
    </>
  );
}
