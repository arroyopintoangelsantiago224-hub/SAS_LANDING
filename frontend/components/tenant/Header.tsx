'use client';

import Link from 'next/link';
import { ShoppingCart, Menu, Search } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { useCartStore } from '@/store/useCartStore';
import { useEffect, useState } from 'react';

export default function Header() {
  const itemCount = useCartStore((state) => state.getItemCount());
  const [mounted, setMounted] = useState(false);

  // Evitar errores de hidratación
  useEffect(() => {
    setMounted(true);
  }, []);

  return (
    <header className="sticky top-0 z-50 w-full bg-white/80 backdrop-blur-md border-b border-gray-100">
      <div className="container mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo & Name */}
        <Link href="/" className="flex items-center space-x-2">
          <div 
            className="w-10 h-10 rounded-xl flex items-center justify-center text-white font-bold text-xl"
            style={{ backgroundColor: siteConfig.colors.primary }}
          >
            {siteConfig.name.charAt(0)}
          </div>
          <span className="font-bold text-xl hidden sm:inline-block">
            {siteConfig.name}
          </span>
        </Link>

        {/* Navigation / Actions */}
        <div className="flex items-center space-x-4">
          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors">
            <Search className="w-5 h-5 text-gray-600" />
          </button>
          
          <Link 
            href="/carrito" 
            className="relative p-2 hover:bg-gray-100 rounded-full transition-colors"
          >
            <ShoppingCart className="w-5 h-5 text-gray-600" />
            {mounted && itemCount > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full min-w-[18px] text-center border-2 border-white">
                {itemCount}
              </span>
            )}
          </Link>

          <button className="p-2 hover:bg-gray-100 rounded-full transition-colors sm:hidden">
            <Menu className="w-5 h-5 text-gray-600" />
          </button>
        </div>
      </div>
    </header>
  );
}
