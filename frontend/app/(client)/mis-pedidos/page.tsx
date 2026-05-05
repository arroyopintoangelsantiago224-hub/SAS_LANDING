'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Clock, CheckCircle2, Truck, XCircle, MapPin, Smartphone, Store, Package, Loader2, ArrowLeft, MessageCircle } from 'lucide-react';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSession } from 'next-auth/react';

const statusColors: any = {
  pendiente: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  'en preparación': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'en camino': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  entregado: 'bg-green-500/10 text-green-600 border-green-500/20',
  cancelado: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const statusIcons: any = {
  pendiente: <Clock className="w-4 h-4" />,
  'en preparación': <Package className="w-4 h-4" />,
  'en camino': <Truck className="w-4 h-4" />,
  entregado: <CheckCircle2 className="w-4 h-4" />,
  cancelado: <XCircle className="w-4 h-4" />,
};

export default function MisPedidosPage() {
  const { data: session } = useSession();
  const orderHistory = useCartStore((state) => state.orderHistory);
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;

  useEffect(() => {
    async function fetchHistory() {
      // Si el usuario está logueado, priorizamos la base de datos por su ID de usuario
      if (session?.user?.id) {
        try {
          const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/pedidos/usuario/${session.user.id}`, {
            headers: { 'ngrok-skip-browser-warning': 'true' }
          });
          const data = await res.json();
          setOrders(Array.isArray(data) ? data : []);
          setLoading(false);
          return;
        } catch (error) {
          console.error('Error fetching user orders from DB:', error);
        }
      }

      // Si no hay sesión o falló la búsqueda por ID, usamos el historial de localStorage
      if (orderHistory.length === 0) {
        setOrders([]);
        setLoading(false);
        return;
      }

      try {
        const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/pedidos/historial?ids=${orderHistory.join(',')}`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const data = await res.json();
        setOrders(Array.isArray(data) ? data : []);
      } catch (error) {
        console.error('Error fetching order history:', error);
      } finally {
        setLoading(false);
      }
    }

    fetchHistory();
  }, [orderHistory, session]);

  return (
    <div className="min-h-screen bg-[#0A0A0C] pt-28 pb-20 px-4">
      <div className="container mx-auto max-w-3xl">
        <div className="flex items-center justify-between mb-10">
          <div className="flex items-center gap-4">
            <Link href="/catalogo" className="p-2 bg-white/5 rounded-xl hover:bg-white/10 transition-all">
              <ArrowLeft className="w-5 h-5 text-white" />
            </Link>
            <div>
              <h1 className="text-3xl font-black tracking-tighter text-white">Mis Pedidos</h1>
              <p className="text-[var(--muted)] text-sm font-medium">Rastrea tus compras en tiempo real</p>
            </div>
          </div>
          <div className="hidden md:flex flex-col items-end">
            <span className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total de pedidos</span>
            <span className="text-xl font-black text-[var(--accent)]" style={{ color: primaryColor }}>{orders.length}</span>
          </div>
        </div>

        {loading ? (
          <div className="flex flex-col items-center justify-center py-32 text-[var(--muted)]">
            <Loader2 className="w-10 h-10 animate-spin mb-4" />
            <p className="font-black uppercase tracking-widest text-xs">Sincronizando historial...</p>
          </div>
        ) : orders.length === 0 ? (
          <div className="bg-white/5 border-2 border-dashed border-white/5 rounded-[40px] p-20 text-center">
            <ShoppingBag className="w-16 h-16 mx-auto text-white/10 mb-6" />
            <p className="text-xl font-black tracking-tight text-white">No tienes pedidos aún</p>
            <p className="text-sm text-gray-500 mt-2 max-w-xs mx-auto">
              Tus pedidos aparecerán aquí automáticamente cuando realices una compra desde este navegador.
            </p>
            <Link 
              href="/catalogo" 
              className="inline-block mt-8 px-8 py-3 rounded-2xl font-black text-xs uppercase tracking-widest transition-all hover:scale-105 active:scale-95"
              style={{ backgroundColor: primaryColor, color: 'black' }}
            >
              Ir al catálogo
            </Link>
          </div>
        ) : (
          <div className="space-y-6">
            {orders.map((order) => (
              <div key={order.id} className="bg-white/5 border border-white/10 rounded-[32px] overflow-hidden group hover:border-white/20 transition-all">
                <div className="p-6 md:p-8 space-y-6">
                  {/* Order Header */}
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-center gap-4">
                      <div className="w-12 h-12 rounded-2xl bg-white/5 flex items-center justify-center font-black text-sm text-[var(--accent)]" style={{ color: primaryColor }}>
                        #{order.id}
                      </div>
                      <div>
                        <h4 className="font-black text-lg text-white leading-none">{order.nombre_cliente}</h4>
                        <p className="text-[10px] text-gray-500 font-black uppercase tracking-widest mt-1.5">
                          {new Date(order.created_at).toLocaleDateString('es-CO', { 
                            day: 'numeric', 
                            month: 'long', 
                            year: 'numeric',
                            hour: '2-digit',
                            minute: '2-digit'
                          })}
                        </p>
                      </div>
                    </div>
                    <div className="flex flex-wrap items-center gap-2">
                      <button 
                        onClick={() => {
                          const phone = order.sede?.telefono || siteConfig.whatsapp;
                          const message = `*Consulta sobre mi Pedido #${order.id}*\nHola! Necesito soporte con mi compra realizada en la sede ${order.sede?.nombre || 'Principal'}.`;
                          window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                        }}
                        className="flex items-center gap-2 px-4 py-2 rounded-xl bg-[#25D366]/10 text-[#25D366] border border-[#25D366]/20 hover:bg-[#25D366]/20 transition-all text-[10px] font-black uppercase tracking-widest"
                      >
                        <MessageCircle className="w-3.5 h-3.5" />
                        <span>Contactar</span>
                      </button>

                      <div className={cn(
                        "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center gap-2",
                        statusColors[order.estado_pedido] || 'bg-gray-500/10 text-gray-500 border-gray-500/20'
                      )}>
                        {statusIcons[order.estado_pedido] || <Clock className="w-4 h-4" />}
                        {order.estado_pedido}
                      </div>
                    </div>
                  </div>

                  {/* Delivery & Payment Info */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-blue-500/10 flex items-center justify-center">
                        <Store className="w-4 h-4 text-blue-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Sede de atención</p>
                        <p className="text-xs font-bold text-white">{order.sede?.nombre || 'Sede Principal'}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3 p-4 bg-white/5 rounded-2xl border border-white/5">
                      <div className="w-8 h-8 rounded-lg bg-purple-500/10 flex items-center justify-center">
                        <Truck className="w-4 h-4 text-purple-500" />
                      </div>
                      <div className="flex-1">
                        <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Tipo de Entrega</p>
                        <p className="text-xs font-bold text-white uppercase">{order.tipo_entrega}</p>
                      </div>
                    </div>
                  </div>

                  {/* Products Summary */}
                  <div className="space-y-3">
                    <div className="flex items-center justify-between px-1">
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Productos</p>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">{order.items?.length || 0} items</p>
                    </div>
                    <div className="space-y-2">
                      {order.items?.map((item: any) => (
                        <div key={item.id} className="flex items-center justify-between p-3 rounded-xl bg-white/5 border border-white/5">
                          <div className="flex items-center gap-3">
                            <span className="text-xs font-black text-[var(--accent)]" style={{ color: primaryColor }}>{item.cantidad}x</span>
                            <span className="text-xs font-bold text-white">{item.nombre_producto}</span>
                          </div>
                          <span className="text-xs font-bold text-gray-400">${Number(item.subtotal).toLocaleString('es-CO')}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  {/* Order Footer */}
                  <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex items-center gap-3">
                      <div className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        order.estado_pago === 'pagado' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      )}>
                        Pago: {order.estado_pago}
                      </div>
                      <div className="px-3 py-1.5 bg-white/5 rounded-lg text-[9px] font-black uppercase tracking-widest text-gray-400">
                        {order.metodo_pago}
                      </div>
                    </div>
                    <div className="text-3xl font-black tracking-tighter text-white">
                      ${Number(order.total).toLocaleString('es-CO')}
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div className="mt-12 text-center">
          <p className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-600">
            ¿Necesitas ayuda con un pedido?
          </p>
          <a 
            href={`https://wa.me/${siteConfig.whatsapp}`}
            className="inline-block mt-4 text-xs font-black uppercase tracking-widest text-white hover:text-[var(--accent)] transition-colors"
            style={{ color: primaryColor }}
          >
            Contactar a Soporte
          </a>
        </div>
      </div>
    </div>
  );
}
