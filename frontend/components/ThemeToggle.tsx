'use client';

import { Moon, Sun } from 'lucide-react';
import { useTheme } from 'next-themes';
import { useEffect, useState } from 'react';
import { siteConfig } from '@/config/site';
import { useCartStore } from '@/store/useCartStore';

export default function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const isCartOpen = useCartStore((state) => state.isCartOpen);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted || isCartOpen) return null;

  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="fixed bottom-6 right-6 z-[100] w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all animate-in slide-in-from-bottom-10 duration-500"
      style={{ 
        backgroundColor: primaryColor,
        boxShadow: `0 10px 30px -5px ${primaryColor}60`
      }}
      aria-label="Toggle Theme"
    >
      {theme === 'dark' ? (
        <Sun className="w-6 h-6 text-black" />
      ) : (
        <Moon className="w-6 h-6 text-black" />
      )}
    </button>
  );
}
