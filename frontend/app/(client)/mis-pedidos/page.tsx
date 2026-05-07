'use client';

import React, { useState, useEffect } from 'react';
import { useCartStore } from '@/store/useCartStore';
import { ShoppingBag, Clock, CheckCircle2, Truck, XCircle, MapPin, Smartphone, Store, Package, Loader2, ArrowLeft, MessageCircle, Eye, X, CreditCard, Info, ExternalLink } from 'lucide-react';
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
  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;

  useEffect(() => {
    async function fetchHistory() {
      // Fetch payment methods first to have them ready
      try {
        const payRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/metodos-pago`, {
          headers: { 'ngrok-skip-browser-warning': 'true' }
        });
        const payData = await payRes.json();
        setPaymentMethods(payData);
      } catch (error) {
        console.error('Error fetching payment methods:', error);
      }

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

                  {/* Order Footer */}
                  <div className="pt-6 border-t border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-6">
                    <div className="flex flex-wrap items-center gap-3">
                      <div className={cn(
                        "px-3 py-1.5 rounded-lg text-[9px] font-black uppercase tracking-widest border",
                        order.estado_pago === 'pagado' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                      )}>
                        Pago: {order.estado_pago}
                      </div>
                      <button 
                        onClick={() => setSelectedOrder(order)}
                        className="flex items-center gap-2 px-4 py-1.5 rounded-lg bg-white/5 text-white border border-white/10 hover:bg-white/10 transition-all text-[9px] font-black uppercase tracking-widest"
                      >
                        <Eye className="w-3.5 h-3.5 text-[var(--accent)]" style={{ color: primaryColor }} />
                        <span>Ver Detalle</span>
                      </button>
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

      {/* Detail Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div 
            className="absolute inset-0 bg-black/80 backdrop-blur-md animate-in fade-in duration-300"
            onClick={() => setSelectedOrder(null)}
          />
          <div className="relative w-full max-w-2xl bg-[#0F0F12] border border-white/10 rounded-[40px] overflow-hidden shadow-2xl animate-in zoom-in duration-300 flex flex-col max-h-[90vh]">
            {/* Modal Header */}
            <div className="p-8 border-b border-white/5 flex items-center justify-between shrink-0">
              <div className="flex items-center gap-4">
                <div className="w-14 h-14 rounded-2xl bg-white/5 flex items-center justify-center">
                  <Package className="w-6 h-6 text-[var(--accent)]" style={{ color: primaryColor }} />
                </div>
                <div>
                  <h3 className="text-2xl font-black tracking-tighter text-white">Pedido #{selectedOrder.id}</h3>
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-500 mt-1">Detalle completo de tu compra</p>
                </div>
              </div>
              <button 
                onClick={() => setSelectedOrder(null)}
                className="p-3 bg-white/5 rounded-2xl hover:bg-white/10 transition-all group"
              >
                <X className="w-6 h-6 text-gray-400 group-hover:text-white transition-colors" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-8 overflow-y-auto space-y-10 custom-scrollbar">
              {/* Products Section */}
              <div className="space-y-4">
                <div className="flex items-center justify-between">
                  <h4 className="text-xs font-black uppercase tracking-widest text-white/50 italic">Productos Seleccionados</h4>
                  <span className="px-3 py-1 rounded-full bg-white/5 text-[9px] font-black text-gray-400 uppercase tracking-widest border border-white/5">
                    {selectedOrder.items?.length || 0} items
                  </span>
                </div>
                <div className="space-y-3">
                  {selectedOrder.items?.map((item: any) => (
                    <div key={item.id} className="flex items-center justify-between p-4 rounded-3xl bg-white/5 border border-white/5 hover:border-white/10 transition-all group">
                      <div className="flex items-center gap-4">
                        <div className="w-10 h-10 rounded-xl bg-black/20 flex items-center justify-center font-black text-xs text-[var(--accent)]" style={{ color: primaryColor }}>
                          {item.cantidad}x
                        </div>
                        <div>
                          <p className="text-sm font-bold text-white group-hover:text-[var(--accent)] transition-colors" style={{ '--accent': primaryColor } as any}>{item.nombre_producto}</p>
                          <p className="text-[10px] text-gray-500 font-medium">${Number(item.precio_unitario).toLocaleString('es-CO')} c/u</p>
                        </div>
                      </div>
                      <span className="text-sm font-black text-white">${Number(item.subtotal).toLocaleString('es-CO')}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Payment Method Details */}
              <div className="space-y-4">
                <h4 className="text-xs font-black uppercase tracking-widest text-white/50 italic">Información de Pago</h4>
                {(() => {
                  const method = paymentMethods.find(m => m.nombre === selectedOrder.metodo_pago);
                  if (!method) return (
                    <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex items-center gap-4">
                      <CreditCard className="w-8 h-8 text-gray-500" />
                      <div>
                        <p className="text-sm font-bold text-white">{selectedOrder.metodo_pago}</p>
                        <p className="text-[10px] text-gray-500 uppercase tracking-widest font-black">Método estándar</p>
                      </div>
                    </div>
                  );

                  return (
                    <div className="space-y-4">
                      <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex flex-col md:flex-row md:items-center justify-between gap-6">
                        <div className="flex items-center gap-5">
                          <div className="w-16 h-16 rounded-2xl bg-white p-2 flex items-center justify-center shadow-lg">
                            {method.icono ? (
                              <img src={method.icono} alt={method.nombre} className="w-full h-full object-contain" />
                            ) : (
                              <CreditCard className="w-8 h-8 text-black" />
                            )}
                          </div>
                          <div>
                            <p className="text-lg font-black text-white">{method.nombre}</p>
                            <p className="text-[10px] text-[var(--accent)] font-black uppercase tracking-widest" style={{ color: primaryColor }}>{method.tipo}</p>
                          </div>
                        </div>

                        <div className={cn(
                          "px-4 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest border flex items-center justify-center gap-2",
                          selectedOrder.estado_pago === 'pagado' ? "bg-green-500/10 text-green-500 border-green-500/20" : "bg-orange-500/10 text-orange-500 border-orange-500/20"
                        )}>
                          {selectedOrder.estado_pago}
                        </div>
                      </div>

                      {/* Detail Grid */}
                      {(method.tipo !== 'contraentrega') && (
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          {method.banco && (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                              <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Banco</p>
                              <p className="text-xs font-bold text-white mt-1">{method.banco}</p>
                            </div>
                          )}
                          {method.numero_cuenta && (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                              <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">{method.tipo_cuenta || 'Cuenta'}</p>
                              <p className="text-xs font-bold text-white mt-1">{method.numero_cuenta}</p>
                            </div>
                          )}
                          {method.titular && (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                              <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Titular</p>
                              <p className="text-xs font-bold text-white mt-1">{method.titular}</p>
                            </div>
                          )}
                          {method.telefono && (
                            <div className="p-4 rounded-2xl bg-white/5 border border-white/5">
                              <p className="text-[8px] font-black uppercase tracking-widest text-gray-500">Teléfono/Celular</p>
                              <p className="text-xs font-bold text-white mt-1">{method.telefono}</p>
                            </div>
                          )}
                        </div>
                      )}

                      {method.qr_imagen && (
                        <div className="p-6 rounded-[32px] bg-white/5 border border-white/5 flex flex-col items-center gap-4">
                          <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Código QR para Pago</p>
                          <div className="w-48 h-48 bg-white p-3 rounded-2xl shadow-2xl">
                            <img src={method.qr_imagen} alt="QR de Pago" className="w-full h-full object-contain" />
                          </div>
                        </div>
                      )}

                      {method.instrucciones && (
                        <div className="p-5 rounded-[24px] bg-blue-500/5 border border-blue-500/10 flex items-start gap-3">
                          <Info className="w-4 h-4 text-blue-500 shrink-0 mt-0.5" />
                          <p className="text-xs text-blue-200/70 leading-relaxed italic">{method.instrucciones}</p>
                        </div>
                      )}
                    </div>
                  );
                })()}
              </div>

              {/* Totals Section */}
              <div className="pt-8 border-t border-white/10 space-y-4">
                <div className="flex justify-between items-center px-2">
                  <span className="text-sm font-bold text-gray-500">Subtotal</span>
                  <span className="text-sm font-black text-white">${Number(selectedOrder.subtotal).toLocaleString('es-CO')}</span>
                </div>
                <div className="flex justify-between items-center px-2">
                  <span className="text-sm font-bold text-gray-500">Envío</span>
                  <span className="text-[10px] font-black text-green-500 uppercase tracking-widest">Gratis</span>
                </div>
                <div className="flex justify-between items-center p-6 rounded-[32px] bg-white/5 border border-white/10 mt-2">
                  <div>
                    <p className="text-[10px] font-black uppercase tracking-widest text-gray-500">Total a Pagar</p>
                    <p className="text-3xl font-black tracking-tighter text-white mt-1">${Number(selectedOrder.total).toLocaleString('es-CO')}</p>
                  </div>
                  <button 
                    onClick={() => {
                      const phone = selectedOrder.sede?.telefono || siteConfig.whatsapp;
                      const message = `*Confirmación de Pago - Pedido #${selectedOrder.id}*\nHola! Aquí adjunto el comprobante de mi pago de $${Number(selectedOrder.total).toLocaleString('es-CO')}.`;
                      window.open(`https://wa.me/${phone}?text=${encodeURIComponent(message)}`, '_blank');
                    }}
                    className="px-6 py-3 rounded-2xl bg-[#25D366] text-white font-black text-xs uppercase tracking-widest flex items-center gap-2 hover:scale-105 transition-all shadow-lg shadow-green-500/20"
                  >
                    <MessageCircle className="w-4 h-4" />
                    Enviar Comprobante
                  </button>
                </div>
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-6 bg-white/5 border-t border-white/5 shrink-0 flex justify-center">
               <button 
                onClick={() => setSelectedOrder(null)}
                className="text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 hover:text-white transition-colors"
               >
                 Cerrar Detalle
               </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
