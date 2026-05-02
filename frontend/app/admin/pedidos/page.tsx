'use client';

import React, { useState, useEffect } from 'react';
import { 
  ShoppingBag, 
  Search, 
  Filter, 
  MoreVertical, 
  ExternalLink, 
  Clock, 
  CheckCircle2, 
  Truck, 
  XCircle, 
  MapPin,
  Smartphone,
  Eye,
  Loader2,
  Package
} from 'lucide-react';
import { adminFetchOrders, adminUpdateOrder } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useOrderStore } from '@/store/useOrderStore';

const statusColors: any = {
  pendiente: 'bg-yellow-500/10 text-yellow-600 border-yellow-500/20',
  'en preparación': 'bg-blue-500/10 text-blue-600 border-blue-500/20',
  'en camino': 'bg-purple-500/10 text-purple-600 border-purple-500/20',
  entregado: 'bg-green-500/10 text-green-600 border-green-500/20',
  cancelado: 'bg-red-500/10 text-red-600 border-red-500/20',
};

const paymentStatusColors: any = {
  pendiente: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
  por_verificar: 'bg-orange-500/10 text-orange-600 border-orange-500/20',
  pagado: 'bg-green-500/10 text-green-600 border-green-500/20',
};

export default function PedidosPage() {
  const orders = useOrderStore((state) => state.orders);
  const loadOrders = useOrderStore((state) => state.loadOrders);
  const updateOrderInStore = useOrderStore((state) => state.updateOrder);
  
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [updating, setUpdating] = useState<number | null>(null);

  useEffect(() => {
    // Check if orders are already loaded, if not load them
    if (orders.length === 0) {
      setLoading(true);
      loadOrders().finally(() => setLoading(false));
    }
  }, []);

  async function handleStatusChange(orderId: number, field: string, value: string) {
    setUpdating(orderId);
    try {
      const updatedOrder = await adminUpdateOrder(orderId, { [field]: value });
      updateOrderInStore(updatedOrder);
      if (selectedOrder?.id === orderId) {
        setSelectedOrder(updatedOrder);
      }
    } catch (error) {
      console.error('Error updating order:', error);
    } finally {
      setUpdating(null);
    }
  }

  const openMap = (order: any) => {
    if (order.latitud && order.longitud) {
      window.open(`https://www.google.com/maps?q=${order.latitud},${order.longitud}`, '_blank');
    } else {
      const query = encodeURIComponent(`${order.direccion_cliente}, Cúcuta`);
      window.open(`https://www.google.com/maps?q=${query}`, '_blank');
    }
  };

  return (
    <div className="space-y-8 animate-in fade-in duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h2 className="text-4xl font-black tracking-tighter">Gestión de Pedidos</h2>
          <p className="text-[var(--muted)] text-sm font-medium mt-1">Controla y actualiza los pedidos de tus clientes</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Orders List */}
        <div className="lg:col-span-2 space-y-4">
          <div className="flex items-center gap-4 bg-[var(--card)] border border-[var(--border)] p-4 rounded-2xl mb-6">
            <Search className="w-5 h-5 text-[var(--muted2)]" />
            <input 
              type="text" 
              placeholder="Buscar por cliente o ID..." 
              className="bg-transparent border-none outline-none text-sm font-medium flex-1"
            />
            <div className="h-6 w-[1px] bg-[var(--border)]" />
            <button className="flex items-center gap-2 text-xs font-black uppercase tracking-widest text-[var(--muted)] hover:text-white transition-colors">
              <Filter className="w-4 h-4" />
              Filtrar
            </button>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 text-[var(--muted2)]">
              <Loader2 className="w-10 h-10 animate-spin mb-4" />
              <p className="font-black uppercase tracking-widest text-xs">Cargando Pedidos...</p>
            </div>
          ) : orders.length === 0 ? (
            <div className="bg-[var(--card)] border border-dashed border-[var(--border)] rounded-[32px] p-20 text-center">
              <ShoppingBag className="w-16 h-16 mx-auto text-[var(--muted2)] mb-6 opacity-20" />
              <p className="text-lg font-black tracking-tight">No hay pedidos registrados</p>
              <p className="text-sm text-[var(--muted)] mt-1">Los nuevos pedidos aparecerán aquí automáticamente.</p>
            </div>
          ) : (
            <div className="space-y-3">
              {orders.map((order) => (
                <div 
                  key={order.id}
                  onClick={() => setSelectedOrder(order)}
                  className={cn(
                    "bg-[var(--card)] border p-6 rounded-[24px] cursor-pointer transition-all hover:scale-[1.01] active:scale-[0.99] group relative",
                    selectedOrder?.id === order.id ? "border-[var(--accent)] ring-1 ring-[var(--accent)]/20" : "border-[var(--border)] hover:border-[var(--border2)]"
                  )}
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 rounded-xl bg-[var(--card2)] flex items-center justify-center font-black text-xs text-[var(--accent)]">
                        #{order.id}
                      </div>
                      <div>
                        <h4 className="font-black text-sm tracking-tight">{order.nombre_cliente}</h4>
                        <p className="text-[10px] text-[var(--muted)] font-medium uppercase tracking-widest mt-0.5">
                          {new Date(order.created_at).toLocaleString('es-CO')}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className={cn(
                        "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
                        statusColors[order.estado_pedido] || 'bg-gray-500/10 text-gray-500'
                      )}>
                        {order.estado_pedido}
                      </span>
                    </div>
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-4 text-xs font-medium text-[var(--muted)]">
                      <div className="flex items-center gap-1.5">
                        <Package className="w-3.5 h-3.5" />
                        <span>{order.items?.length || 0} items</span>
                      </div>
                      <div className="h-4 w-[1px] bg-[var(--border)]" />
                      <div className="flex items-center gap-1.5">
                        <Smartphone className="w-3.5 h-3.5" />
                        <span className="uppercase text-[10px] tracking-widest">{order.metodo_pago}</span>
                      </div>
                    </div>
                    <div className="text-xl font-black tracking-tight text-[var(--accent)]">
                      ${Number(order.total).toLocaleString('es-CO')}
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Order Detail Panel */}
        <div className="lg:col-span-1">
          {selectedOrder ? (
            <div className="bg-[var(--card)] border border-[var(--border)] rounded-[32px] overflow-hidden sticky top-8 animate-in slide-in-from-bottom-4 duration-500">
              <div className="p-8 border-b border-[var(--border)] bg-[var(--card2)]/50">
                <div className="flex items-center justify-between mb-6">
                  <div className="px-3 py-1 bg-[var(--accent)] text-black rounded-lg font-black text-[10px] uppercase tracking-widest">
                    Detalle Pedido #{selectedOrder.id}
                  </div>
                  <button onClick={() => setSelectedOrder(null)} className="p-2 hover:bg-black/10 rounded-full transition-colors">
                    <XCircle className="w-5 h-5 text-[var(--muted)]" />
                  </button>
                </div>
                
                <div className="space-y-4">
                  <div>
                    <h3 className="text-2xl font-black tracking-tighter">{selectedOrder.nombre_cliente}</h3>
                    <div className="flex items-center gap-2 text-[var(--muted)] text-sm mt-1 font-medium">
                      <Smartphone className="w-4 h-4" />
                      <span>{selectedOrder.telefono_cliente}</span>
                    </div>
                  </div>
                  
                  <div className="flex items-center gap-2 p-3 bg-black/20 rounded-2xl border border-white/5">
                    <MapPin className="w-5 h-5 text-[var(--accent)] shrink-0" />
                    <p className="text-xs font-medium leading-relaxed">{selectedOrder.direccion_cliente}</p>
                  </div>
                </div>
              </div>

              <div className="p-8 space-y-8">
                {/* Status Controls */}
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted2)] ml-1">Estado Pedido</label>
                    <select 
                      value={selectedOrder.estado_pedido}
                      onChange={(e) => handleStatusChange(selectedOrder.id, 'estado_pedido', e.target.value)}
                      disabled={updating === selectedOrder.id}
                      className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[var(--accent)] transition-all disabled:opacity-50"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="en preparación">En Preparación</option>
                      <option value="en camino">En Camino</option>
                      <option value="entregado">Entregado</option>
                      <option value="cancelado">Cancelado</option>
                    </select>
                  </div>
                  <div className="space-y-2">
                    <label className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted2)] ml-1">Estado Pago</label>
                    <select 
                      value={selectedOrder.estado_pago}
                      onChange={(e) => handleStatusChange(selectedOrder.id, 'estado_pago', e.target.value)}
                      disabled={updating === selectedOrder.id}
                      className="w-full bg-[var(--card2)] border border-[var(--border)] rounded-xl px-3 py-2 text-xs font-bold outline-none focus:border-[var(--accent)] transition-all disabled:opacity-50"
                    >
                      <option value="pendiente">Pendiente</option>
                      <option value="por_verificar">Por Verificar</option>
                      <option value="pagado">Pagado</option>
                    </select>
                  </div>
                </div>

                {/* Items List */}
                <div className="space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-[0.2em] text-[var(--muted2)] ml-1">Resumen de Productos</p>
                  <div className="space-y-3">
                    {selectedOrder.items?.map((item: any) => (
                      <div key={item.id} className="flex items-center justify-between p-3 rounded-2xl bg-[var(--card2)]/30 border border-white/5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-lg bg-[var(--accent)]/10 flex items-center justify-center font-black text-[10px] text-[var(--accent)]">
                            {item.cantidad}x
                          </div>
                          <div>
                            <p className="text-xs font-black tracking-tight">{item.nombre_producto}</p>
                            <p className="text-[10px] text-[var(--muted)] font-medium">${Number(item.precio_unitario).toLocaleString('es-CO')}</p>
                          </div>
                        </div>
                        <div className="text-xs font-black">
                          ${Number(item.subtotal).toLocaleString('es-CO')}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Totals */}
                <div className="pt-6 border-t border-[var(--border)] space-y-2">
                  <div className="flex justify-between text-xs font-medium text-[var(--muted)]">
                    <span>Subtotal</span>
                    <span>${Number(selectedOrder.subtotal).toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-xl font-black tracking-tighter pt-2">
                    <span className="uppercase text-[10px] tracking-widest text-[var(--muted2)] self-center">Total</span>
                    <span className="text-[var(--accent)]">${Number(selectedOrder.total).toLocaleString('es-CO')}</span>
                  </div>
                </div>
                
                {/* External Actions */}
                <div className="pt-4 grid grid-cols-2 gap-3">
                  <button className="flex items-center justify-center gap-2 py-3 rounded-xl bg-green-500/10 text-green-500 text-[10px] font-black uppercase tracking-widest hover:bg-green-500/20 transition-all">
                    <Smartphone className="w-3.5 h-3.5" />
                    WhatsApp
                  </button>
                  <button 
                    onClick={() => openMap(selectedOrder)}
                    className="flex items-center justify-center gap-2 py-3 rounded-xl bg-blue-500/10 text-blue-500 text-[10px] font-black uppercase tracking-widest hover:bg-blue-500/20 transition-all"
                  >
                    <MapPin className="w-3.5 h-3.5" />
                    Ver Mapa
                  </button>
                </div>
              </div>
            </div>
          ) : (
            <div className="h-[400px] bg-[var(--card)] border border-dashed border-[var(--border)] rounded-[32px] flex flex-col items-center justify-center text-center p-8 text-[var(--muted2)]">
              <Eye className="w-12 h-12 mb-4 opacity-10" />
              <p className="text-sm font-black uppercase tracking-widest">Selecciona un pedido</p>
              <p className="text-[10px] mt-2">Para ver el detalle completo y gestionar su estado</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
