'use client';

import React, { useState, useEffect } from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { 
  LayoutDashboard, 
  Package, 
  Settings, 
  Palette, 
  LogOut, 
  Moon, 
  Sun,
  Menu as MenuIcon,
  X,
  User
} from 'lucide-react';
import { useTheme } from 'next-themes';
import { cn } from '@/lib/utils';
import { siteConfig } from '@/config/site';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();
  const pathname = usePathname();
  const [isSidebarOpen, setIsSidebarOpen] = useState(true);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const navItems = [
    { name: 'Dashboard', href: '/admin', icon: LayoutDashboard },
    { name: 'Productos', href: '/admin/productos', icon: Package },
    { name: 'Personalizar', href: '/admin/personalizar', icon: Palette },
    { name: 'Configuración', href: '/admin/configuracion', icon: Settings },
  ];

  return (
    <div className="flex min-h-screen bg-[var(--bg)] text-[var(--text)] transition-colors duration-300">
      {/* Sidebar */}
      <aside 
        className={cn(
          "fixed inset-y-0 left-0 z-50 w-64 bg-[var(--surface)] border-r border-[var(--border)] transition-transform duration-300 md:relative md:translate-x-0",
          isSidebarOpen ? "translate-x-0" : "-translate-x-full"
        )}
      >
        <div className="flex flex-col h-full">
          {/* Logo */}
          <div className="p-6 border-b border-[var(--border)]">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 bg-[var(--accent)] rounded-xl flex items-center justify-center text-black shadow-lg">
                <LayoutDashboard className="w-6 h-6" />
              </div>
              <div>
                <h1 className="font-bold text-lg leading-none">AdminKit</h1>
                <p className="text-[10px] text-[var(--muted)] font-mono uppercase tracking-widest mt-1">Panel v2.0</p>
              </div>
            </div>
          </div>

          {/* Navigation */}
          <nav className="flex-1 p-4 space-y-1">
            <p className="text-[10px] font-mono text-[var(--muted2)] uppercase tracking-widest px-4 mb-3">Gestión</p>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.name}
                  href={item.href}
                  className={cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all",
                    isActive 
                      ? "bg-[var(--accent-dim)] text-[var(--accent)] border border-[var(--accent)]/20" 
                      : "text-[var(--muted)] hover:bg-[var(--card)] hover:text-[var(--text)]"
                  )}
                >
                  <item.icon className="w-5 h-5" />
                  {item.name}
                </Link>
              );
            })}
          </nav>

          {/* User Profile */}
          <div className="p-4 border-t border-[var(--border)]">
            <div className="flex items-center gap-3 p-3 bg-[var(--card)] rounded-xl">
              <div className="w-9 h-9 rounded-full bg-[var(--accent)] flex items-center justify-center text-black font-bold text-xs">
                AD
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-xs font-bold truncate">Admin</p>
                <p className="text-[10px] text-[var(--muted)] truncate">Super Admin</p>
              </div>
              <button className="text-[var(--muted)] hover:text-[var(--danger)] transition-colors">
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          </div>
        </div>
      </aside>

      {/* Main Content */}
      <div className="flex-1 flex flex-col min-w-0 overflow-hidden">
        {/* Topbar */}
        <header className="h-20 bg-[var(--surface)] border-b border-[var(--border)] flex items-center justify-between px-6 md:px-10 flex-shrink-0">
          <div className="flex items-center gap-4">
            <button 
              onClick={() => setIsSidebarOpen(!isSidebarOpen)}
              className="md:hidden p-2 text-[var(--muted)] hover:bg-[var(--card)] rounded-lg"
            >
              <MenuIcon className="w-6 h-6" />
            </button>
            <div>
              <h2 className="text-xl font-bold tracking-tight">
                {navItems.find(i => i.href === pathname)?.name || 'Admin'}
              </h2>
              <p className="text-xs text-[var(--muted)]">Gestiona tu tienda y contenido</p>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="p-2.5 rounded-xl bg-[var(--card)] border border-[var(--border)] text-[var(--muted)] hover:text-[var(--text)] transition-all"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5" />}
            </button>
            <div className="h-6 w-px bg-[var(--border)] mx-2" />
            <Link 
              href="/"
              className="px-4 py-2 text-xs font-bold bg-[var(--accent)] text-black rounded-lg hover:scale-105 active:scale-95 transition-all shadow-lg"
              style={{ boxShadow: `0 8px 16px -4px var(--accent)` }}
            >
              Ver Sitio
            </Link>
          </div>
        </header>

        {/* Content Area */}
        <main className="flex-1 overflow-y-auto p-6 md:p-10 no-scrollbar">
          {children}
        </main>
      </div>
    </div>
  );
}
