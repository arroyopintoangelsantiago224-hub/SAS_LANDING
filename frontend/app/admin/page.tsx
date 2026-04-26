'use client';

import React, { useState, useEffect } from 'react';
import { 
  Package, 
  TrendingUp,
  Tag,
  DollarSign,
  ShoppingCart,
  Users,
  ArrowUpRight,
  ArrowDownRight,
  Activity
} from 'lucide-react';
import { adminFetchProducts, adminFetchCategories } from '@/lib/api';
import { cn } from '@/lib/utils';

export default function AdminDashboardPage() {
  const [stats, setStats] = useState<any>({
    products: 0,
    categories: 0,
    avgPrice: 0,
    inventoryValue: 0
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadStats() {
      try {
        const [prods, cats] = await Promise.all([
          adminFetchProducts(),
          adminFetchCategories()
        ]);
        
        const totalValue = prods.reduce((acc: number, p: any) => acc + Number(p.precio), 0);
        
        setStats({
          products: prods.length,
          categories: cats.length,
          avgPrice: prods.length ? (totalValue / prods.length).toFixed(2) : '0.00',
          inventoryValue: totalValue.toFixed(2)
        });
      } catch (error) {
        console.error('Error loading dashboard stats:', error);
      } finally {
        setLoading(false);
      }
    }
    loadStats();
  }, []);

  const statCards = [
    { label: 'Total Productos', value: stats.products, icon: Package, color: 'var(--accent)', trend: '+12%', up: true },
    { label: 'Categorías', value: stats.categories, icon: Tag, color: 'var(--info)', trend: 'Estable', up: true },
    { label: 'Precio Promedio', value: `$${stats.avgPrice}`, icon: TrendingUp, color: 'var(--success)', trend: '+5%', up: true },
    { label: 'Valor Inventario', value: `$${stats.inventoryValue}`, icon: DollarSign, color: 'var(--accent)', trend: '-2%', up: false },
  ];

  return (
    <div className="space-y-10 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Panel de Control</h2>
          <p className="text-[var(--muted)] text-sm font-medium mt-1">Resumen general de tu tienda y catálogo</p>
        </div>
        <div className="flex items-center gap-2 px-4 py-2 bg-[var(--card)] border border-[var(--border)] rounded-2xl">
          <div className="w-2 h-2 rounded-full bg-[var(--success)] animate-pulse" />
          <span className="text-[10px] font-black uppercase tracking-widest text-[var(--muted)]">Sistema en línea</span>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        {statCards.map((stat, i) => (
          <div key={i} className="bg-[var(--card)] border border-[var(--border)] p-8 rounded-[32px] shadow-sm relative overflow-hidden group hover:border-[var(--accent)] transition-all">
            <div className="flex items-center justify-between mb-6 relative z-10">
              <div className="w-12 h-12 rounded-2xl flex items-center justify-center bg-[var(--card2)] group-hover:scale-110 transition-transform">
                <stat.icon className="w-6 h-6" style={{ color: stat.color }} />
              </div>
              <div className={cn(
                "flex items-center gap-1 px-2 py-1 rounded-full text-[10px] font-black",
                stat.up ? "text-[var(--success)] bg-green-500/5" : "text-[var(--danger)] bg-red-500/5"
              )}>
                {stat.up ? <ArrowUpRight className="w-3 h-3" /> : <ArrowDownRight className="w-3 h-3" />}
                {stat.trend}
              </div>
            </div>
            <div className="relative z-10">
              <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted2)] mb-1">{stat.label}</p>
              <p className="text-3xl font-black tracking-tight">{stat.value}</p>
            </div>
            {/* Background pattern */}
            <div className="absolute -right-4 -bottom-4 opacity-[0.03] group-hover:opacity-[0.07] transition-opacity">
              <stat.icon className="w-32 h-32 rotate-12" />
            </div>
          </div>
        ))}
      </div>

      {/* Placeholder Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 bg-[var(--card)] border border-[var(--border)] rounded-[32px] p-8 h-80 flex flex-col justify-center items-center text-center">
          <Activity className="w-12 h-12 text-[var(--muted2)] mb-4 opacity-20" />
          <p className="text-sm font-black uppercase tracking-widest text-[var(--muted2)]">Gráfica de Ventas</p>
          <p className="text-[10px] text-[var(--muted)] mt-2">Los datos de ventas aparecerán cuando se integre el sistema de pedidos</p>
        </div>
        <div className="bg-[var(--card)] border border-[var(--border)] rounded-[32px] p-8 h-80 flex flex-col justify-center items-center text-center">
          <ShoppingCart className="w-12 h-12 text-[var(--muted2)] mb-4 opacity-20" />
          <p className="text-sm font-black uppercase tracking-widest text-[var(--muted2)]">Pedidos Recientes</p>
          <p className="text-[10px] text-[var(--muted)] mt-2">No hay pedidos pendientes</p>
        </div>
      </div>
    </div>
  );
}
