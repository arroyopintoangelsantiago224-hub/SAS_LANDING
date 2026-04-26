'use client';

import React, { useEffect, useState } from 'react';
import { usePathname } from 'next/navigation';
import Link from 'next/link';
import { 
  LayoutDashboard, 
  Package, 
  Palette, 
  Settings, 
  LogOut, 
  Store,
  ChevronRight,
  Menu,
  Moon,
  Sun
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useTheme } from 'next-themes';

export default function AdminLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const pathname = usePathname();
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  // Wait until mounted to avoid hydration mismatch
  useEffect(() => {
    setMounted(true);
  }, []);

  const menuItems = [
    { name: 'Dashboard', icon: LayoutDashboard, href: '/admin' },
    { name: 'Ítems', icon: Package, href: '/admin/items' },
    { name: 'Personalizar', icon: Palette, href: '/admin/personalizar' },
    { name: 'Ajustes', icon: Settings, href: '/admin/ajustes' },
  ];

  return (
    <div className="min-h-screen bg-[var(--bg)] flex transition-colors duration-300">
      {/* Sidebar Desktop */}
      <aside className="w-72 bg-[var(--surface)] border-r border-[var(--border)] hidden lg:flex flex-col fixed inset-y-0 z-50">
        <div className="p-8">
          <div className="flex items-center gap-3 mb-10">
            <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center shadow-lg shadow-[var(--accent)]/20">
              <Store className="w-6 h-6 text-black" />
            </div>
            <div>
              <h1 className="font-black tracking-tighter text-lg leading-none">SAS Admin</h1>
              <span className="text-[10px] font-bold text-[var(--muted2)] uppercase tracking-widest">Premium Panel</span>
            </div>
          </div>

          <nav className="space-y-1.5">
            {menuItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center justify-between px-4 py-3.5 rounded-xl text-sm font-bold transition-all group",
                    isActive 
                      ? "bg-[var(--accent)] text-black shadow-lg shadow-[var(--accent)]/10" 
                      : "text-[var(--muted)] hover:bg-[var(--card2)] hover:text-[var(--text)]"
                  )}
                >
                  <div className="flex items-center gap-3">
                    <item.icon className={cn("w-4 h-4", isActive ? "text-black" : "text-[var(--muted2)] group-hover:text-[var(--accent)]")} />
                    {item.name}
                  </div>
                  {isActive && <ChevronRight className="w-4 h-4" />}
                </Link>
              );
            })}
          </nav>
        </div>

        <div className="mt-auto p-8 border-t border-[var(--border)] space-y-4">
          <button 
            onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
            className="w-full flex items-center justify-between px-4 py-3 bg-[var(--card2)] rounded-xl text-xs font-bold transition-all"
          >
            <div className="flex items-center gap-3">
              {mounted && (
                <>
                  {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
                  Tema {theme === 'dark' ? 'Claro' : 'Oscuro'}
                </>
              )}
              {!mounted && <div className="w-4 h-4" />}
            </div>
          </button>
          <Link 
            href="/catalogo"
            className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-[var(--muted)] hover:text-[var(--text)] transition-all"
          >
            <Store className="w-4 h-4" />
            Ver Catálogo
          </Link>
          <button className="w-full flex items-center gap-3 px-4 py-3 text-xs font-bold text-[var(--danger)] hover:bg-red-500/10 rounded-xl transition-all">
            <LogOut className="w-4 h-4" />
            Cerrar Sesión
          </button>
        </div>
      </aside>

      {/* Main Content */}
      <main className="flex-1 lg:ml-72 p-4 md:p-8 pt-24 lg:pt-8 min-h-screen">
        <div className="max-w-6xl mx-auto">
          {children}
        </div>
      </main>

      {/* Mobile TopBar */}
      <div className="lg:hidden fixed top-0 inset-x-0 bg-[var(--surface)]/80 backdrop-blur-md border-b border-[var(--border)] z-40 p-4 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-8 h-8 bg-[var(--accent)] rounded-lg flex items-center justify-center">
            <Store className="w-5 h-5 text-black" />
          </div>
          <h1 className="font-black tracking-tighter">SAS Admin</h1>
        </div>
        <button className="p-2 bg-[var(--card2)] rounded-lg">
          <Menu className="w-5 h-5" />
        </button>
      </div>
    </div>
  );
}
