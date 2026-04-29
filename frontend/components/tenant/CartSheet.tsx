'use client';

import { useCartStore } from '@/store/useCartStore';
import { siteConfig } from '@/config/site';
import { Trash2, Plus, Minus, X, Send, ShoppingBag, MapPin, CreditCard, CheckCircle, Loader2, ArrowLeft, Smartphone, User, Clock, Truck } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';

type Step = 'cart' | 'shipping' | 'payment' | 'confirmation' | 'success';

export default function CartSheet() {
  const { data: session } = useSession();
  const { 
    items, updateQuantity, removeItem, getTotal, clearCart, 
    isCartOpen, setCartOpen, customerData, setCustomerData, 
    paymentMethod, setPaymentMethod 
  } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('cart');
  const [loading, setLoading] = useState(false);
  const [orderResponse, setOrderResponse] = useState<any>(null);

  useEffect(() => {
    setMounted(true);
  }, []);

  // Sync session data to store if empty
  useEffect(() => {
    if (session?.user) {
      if (!customerData.nombre && session.user.name) {
        setCustomerData({ nombre: session.user.name });
      }
    }
  }, [session, customerData.nombre, setCustomerData]);

  // Prevent scroll when cart is open
  useEffect(() => {
    if (isCartOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isCartOpen]);

  if (!mounted) return null;

  const total = getTotal();

  const handleCreateOrder = async () => {
    setLoading(true);
    try {
      const orderData = {
        usuario_id: session?.user?.id || null, // Assuming id is available in session
        nombre_cliente: customerData.nombre,
        telefono_cliente: customerData.telefono,
        direccion_cliente: customerData.direccion,
        latitud: customerData.latitud || null,
        longitud: customerData.longitud || null,
        metodo_pago: paymentMethod,
        items: items.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad
        }))
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el pedido');
      }

      const data = await response.json();
      setOrderResponse(data);
      setStep('success');
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(`Hubo un error al procesar tu pedido: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleMarkAsPaid = async () => {
    if (!orderResponse?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/pedidos/${orderResponse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          estado_pago: 'por_verificar'
        }),
      });

      if (!response.ok) throw new Error('Error al actualizar el estado del pago');

      const data = await response.json();
      setOrderResponse(data);
      alert('¡Gracias! Validaremos tu pago lo antes posible.');
    } catch (error) {
      console.error('Error updating payment status:', error);
      alert('Hubo un error al procesar tu solicitud.');
    } finally {
      setLoading(false);
    }
  };

  const handleWhatsAppRedirect = () => {
    const itemsList = items.map(item => `- ${item.cantidad}x ${item.nombre} ($${(Number(item.precio) * item.cantidad).toFixed(2)})`).join('\n');
    
    const message = `*Nuevo Pedido Confirmado (#${orderResponse?.id})*\n\n` +
      `👤 *Cliente:* ${customerData.nombre}\n` +
      `📞 *Teléfono:* ${customerData.telefono}\n` +
      `📍 *Dirección:* ${customerData.direccion}\n` +
      `💳 *Pago:* ${paymentMethod}\n\n` +
      `${itemsList}\n\n` +
      `*Total: $${total.toFixed(2)}*`;
    
    const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
    clearCart();
    setStep('cart');
    setCartOpen(false);
  };

  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;

  return (
    <>
      {/* Backdrop */}
      <div 
        className={cn(
          "fixed inset-0 z-[60] bg-black/40 backdrop-blur-sm transition-opacity duration-500",
          isCartOpen ? "opacity-100 pointer-events-auto" : "opacity-0 pointer-events-none"
        )}
        onClick={() => setCartOpen(false)}
      />

      {/* Drawer */}
      <div 
        className={cn(
          "fixed top-0 right-0 z-[70] h-full w-full max-w-md bg-white dark:bg-[#0A0A0C] shadow-2xl transition-transform duration-500 ease-out flex flex-col",
          isCartOpen ? "translate-x-0" : "translate-x-full"
        )}
      >
        {/* Header */}
        <div className="p-6 border-b border-black/5 dark:border-white/5 flex items-center justify-between">
          <div className="flex items-center space-x-3">
            {(step !== 'cart' && step !== 'success') && (
              <button 
                onClick={() => {
                  if (step === 'shipping') setStep('cart');
                  if (step === 'payment') setStep('shipping');
                }}
                className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors mr-1"
              >
                <ArrowLeft className="w-5 h-5 text-gray-500" />
              </button>
            )}
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl">
              {step === 'cart' && <ShoppingBag className="w-5 h-5 text-gray-900 dark:text-white" />}
              {step === 'shipping' && <MapPin className="w-5 h-5 text-gray-900 dark:text-white" />}
              {step === 'payment' && <CreditCard className="w-5 h-5 text-gray-900 dark:text-white" />}
              {step === 'success' && <CheckCircle className="w-5 h-5 text-green-500" />}
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">
              {step === 'cart' && 'Tu Carrito'}
              {step === 'shipping' && 'Envío'}
              {step === 'payment' && 'Pago'}
              {step === 'success' && '¡Pedido Recibido!'}
            </h2>
          </div>
          <button 
            onClick={() => {
              setCartOpen(false);
              setTimeout(() => setStep('cart'), 500);
            }}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          {step === 'cart' && (
            items.length === 0 ? (
              <div className="h-full flex flex-col items-center justify-center text-center space-y-4">
                <div className="w-20 h-20 bg-gray-50 dark:bg-white/5 rounded-3xl flex items-center justify-center">
                  <ShoppingBag className="w-10 h-10 text-gray-300 dark:text-gray-700" />
                </div>
                <div>
                  <p className="text-lg font-bold text-gray-900 dark:text-white">Tu carrito está vacío</p>
                  <p className="text-sm text-gray-500 dark:text-gray-400">¡Explora nuestro catálogo y agrega algo increíble!</p>
                </div>
                <button 
                  onClick={() => setCartOpen(false)}
                  className="px-8 py-3 rounded-xl text-black font-black text-xs uppercase tracking-widest transition-transform active:scale-95"
                  style={{ backgroundColor: primaryColor }}
                >
                  Ver Catálogo
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                {items.map((item) => (
                  <div key={item.id} className="flex items-center space-x-4">
                    <div className="w-20 h-20 rounded-2xl bg-gray-100 dark:bg-white/5 overflow-hidden flex-shrink-0">
                      {item.imagen_url && (
                        <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                      )}
                    </div>
                    <div className="flex-grow">
                      <h3 className="font-bold text-gray-900 dark:text-white leading-tight">{item.nombre}</h3>
                      <p className="text-sm font-medium text-gray-500 dark:text-gray-400 mt-1">
                        ${Number(item.precio).toLocaleString('es-CO')}
                      </p>
                      <div className="flex items-center justify-between mt-3">
                        <div className="flex items-center space-x-3 bg-gray-50 dark:bg-white/5 rounded-lg p-1">
                          <button 
                            onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                            className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Minus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                          </button>
                          <span className="font-black text-gray-900 dark:text-white text-xs w-4 text-center">{item.cantidad}</span>
                          <button 
                            onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                            className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors"
                          >
                            <Plus className="w-3.5 h-3.5 text-gray-600 dark:text-gray-400" />
                          </button>
                        </div>
                        <button 
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-xl transition-colors"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )
          )}

          {step === 'shipping' && (
            <div className="space-y-8 animate-in fade-in slide-in-from-right-4 duration-500">
              {!session && (
                <div className="p-5 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-4">
                  <div className="flex items-start space-x-3">
                    <div className="p-2 bg-blue-500/10 rounded-lg">
                      <User className="w-4 h-4 text-blue-500" />
                    </div>
                    <div>
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">¿Tienes cuenta?</p>
                      <p className="text-xs text-gray-500 dark:text-gray-400 mt-0.5">Inicia sesión con Google para autocompletar tus datos y seguir tu pedido.</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => signIn('google')}
                    className="w-full py-3 rounded-xl bg-white dark:bg-white/5 border border-black/5 dark:border-white/10 flex items-center justify-center space-x-2 text-[10px] font-black uppercase tracking-widest hover:bg-gray-50 transition-colors"
                  >
                    <img src="https://www.google.com/favicon.ico" className="w-4 h-4" alt="Google" />
                    <span>Continuar con Google</span>
                  </button>
                </div>
              )}

              <div className="space-y-4">
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Nombre Completo</label>
                  <input 
                    type="text"
                    value={customerData.nombre}
                    onChange={(e) => setCustomerData({ nombre: e.target.value })}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-white/10 outline-none transition-all text-sm font-medium"
                    placeholder="Ej. Juan Pérez"
                  />
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Teléfono de Contacto</label>
                  <div className="relative">
                    <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                    <input 
                      type="tel"
                      value={customerData.telefono}
                      onChange={(e) => setCustomerData({ telefono: e.target.value })}
                      className="w-full pl-12 pr-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-white/10 outline-none transition-all text-sm font-medium"
                      placeholder="300 123 4567"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <label className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Dirección de Entrega</label>
                  <textarea 
                    value={customerData.direccion}
                    onChange={(e) => setCustomerData({ direccion: e.target.value })}
                    rows={3}
                    className="w-full px-5 py-4 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-white/10 outline-none transition-all text-sm font-medium resize-none"
                    placeholder="Calle, Carrera, Barrio, Apto/Casa..."
                  />
                </div>
              </div>
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Selecciona método de pago</p>
                
                {[
                  { id: 'nequi', name: 'Nequi / QR', icon: <Smartphone className="w-5 h-5" /> },
                  { id: 'daviplata', name: 'Daviplata', icon: <Smartphone className="w-5 h-5" /> },
                  { id: 'contraentrega', name: 'Contraentrega', icon: <ShoppingBag className="w-5 h-5" /> },
                ].map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.id)}
                    className={cn(
                      "w-full p-5 rounded-2xl border transition-all flex items-center justify-between group",
                      paymentMethod === method.id 
                        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xl scale-[1.02]" 
                        : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-black/10 dark:hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "p-2 rounded-lg transition-colors",
                        paymentMethod === method.id ? "bg-white/20" : "bg-gray-200 dark:bg-white/10"
                      )}>
                        {method.icon}
                      </div>
                      <span className="font-bold text-sm">{method.name}</span>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      paymentMethod === method.id ? "border-white dark:border-black bg-white dark:bg-black" : "border-gray-300 dark:border-gray-600"
                    )}>
                      {paymentMethod === method.id && <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />}
                    </div>
                  </button>
                ))}
              </div>

              {paymentMethod && (
                <div className="p-5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-black/5 dark:border-white/5 space-y-3">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Resumen de cobro</p>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Subtotal</span>
                    <span className="font-bold text-gray-900 dark:text-white">${total.toLocaleString('es-CO')}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-500">Envío</span>
                    <span className="font-black text-green-500 uppercase text-[10px]">Gratis</span>
                  </div>
                  <div className="h-[1px] bg-black/5 dark:bg-white/5 my-2" />
                  <div className="flex justify-between items-end">
                    <span className="font-black text-gray-900 dark:text-white uppercase tracking-tight">Total</span>
                    <span className="text-xl font-black text-gray-900 dark:text-white">${total.toLocaleString('es-CO')}</span>
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'success' && (
            <div className="h-full flex flex-col items-center justify-start text-center space-y-6 animate-in zoom-in duration-500 py-4">
              <div className="w-20 h-20 bg-green-500/10 rounded-full flex items-center justify-center">
                <CheckCircle className="w-10 h-10 text-green-500" />
              </div>
              
              <div className="space-y-1">
                <h3 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tighter">¡Pedido Recibido!</h3>
                <p className="text-xs text-gray-500 dark:text-gray-400">
                  Orden <span className="font-bold text-gray-900 dark:text-white">#{orderResponse?.id}</span> registrada.
                </p>
              </div>

              {/* Payment Instructions Section */}
              {paymentMethod !== 'contraentrega' && orderResponse?.estado_pago === 'pendiente' && (
                <div className="w-full bg-gray-50 dark:bg-white/5 rounded-[32px] p-6 border border-black/5 dark:border-white/5 space-y-4">
                  <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instrucciones de Pago</p>
                  
                  <div className="aspect-square w-32 mx-auto bg-white p-2 rounded-2xl shadow-sm border border-black/5">
                    {/* Placeholder for QR */}
                    <div className="w-full h-full bg-gray-100 rounded-xl flex items-center justify-center relative overflow-hidden">
                      <div className="absolute inset-0 opacity-10 bg-[radial-gradient(circle,black_1px,transparent_1px)] bg-[size:4px_4px]" />
                      <Smartphone className="w-8 h-8 text-gray-300" />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                      Paga con {paymentMethod === 'nequi' ? 'Nequi' : 'Daviplata'}
                    </p>
                    <p className="text-[10px] text-gray-500 leading-relaxed px-4">
                      Escanea el QR o envía al número <span className="font-bold text-gray-900 dark:text-white">{siteConfig.whatsapp}</span>. Una vez realizado, presiona el botón de abajo.
                    </p>
                  </div>

                  <button 
                    disabled={loading}
                    onClick={handleMarkAsPaid}
                    className="w-full py-3 rounded-xl bg-black dark:bg-white text-white dark:text-black font-black text-[10px] uppercase tracking-widest transition-all active:scale-95 disabled:opacity-50"
                  >
                    {loading ? <Loader2 className="w-4 h-4 animate-spin mx-auto" /> : 'Ya pagué'}
                  </button>
                </div>
              )}

              {orderResponse?.estado_pago === 'por_verificar' && (
                <div className="w-full bg-orange-500/5 border border-orange-500/10 rounded-[32px] p-6 space-y-3">
                  <Clock className="w-8 h-8 text-orange-500 mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Pago por verificar</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Estamos validando tu pago. Te notificaremos pronto.
                  </p>
                </div>
              )}

              {paymentMethod === 'contraentrega' && (
                <div className="w-full bg-blue-500/5 border border-blue-500/10 rounded-[32px] p-6 space-y-3">
                  <Truck className="w-8 h-8 text-blue-500 mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Pago Contraentrega</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Prepara el efectivo para cuando llegue tu pedido.
                  </p>
                </div>
              )}
              
              <div className="w-full space-y-3">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">¿Dudas o soporte?</p>
                <button 
                  onClick={handleWhatsAppRedirect}
                  className="w-full py-4 rounded-2xl bg-[#25D366] text-white font-black text-xs uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl shadow-green-500/20 transition-all active:scale-95"
                >
                  <Send className="w-4 h-4" />
                  <span>Contactar WhatsApp</span>
                </button>
                <button 
                  onClick={() => {
                    clearCart();
                    setStep('cart');
                    setCartOpen(false);
                  }}
                  className="w-full py-2 text-gray-400 hover:text-gray-600 text-[10px] font-black uppercase tracking-widest transition-colors"
                >
                  Cerrar y volver a la tienda
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        {(items.length > 0 && step !== 'success') && (
          <div className="p-6 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">
                {step === 'cart' ? 'Subtotal' : 'Total a pagar'}
              </span>
              <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                ${total.toLocaleString('es-CO')}
              </span>
            </div>
            
            <button 
              disabled={loading || (step === 'payment' && !paymentMethod) || (step === 'shipping' && (!customerData.nombre || !customerData.telefono || !customerData.direccion))}
              onClick={() => {
                if (step === 'cart') setStep('shipping');
                else if (step === 'shipping') setStep('payment');
                else if (step === 'payment') handleCreateOrder();
              }}
              className="w-full py-4 rounded-2xl text-black font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl transition-all active:scale-[0.98] disabled:opacity-50 disabled:grayscale disabled:scale-100"
              style={{ 
                backgroundColor: primaryColor,
                boxShadow: loading ? 'none' : `0 10px 20px -5px ${primaryColor}40`
              }}
            >
              {loading ? (
                <Loader2 className="w-5 h-5 animate-spin" />
              ) : (
                <>
                  {step === 'cart' && <span>Finalizar Pedido</span>}
                  {step === 'shipping' && <span>Continuar al Pago</span>}
                  {step === 'payment' && <span>Confirmar y Pagar</span>}
                </>
              )}
            </button>

            {step === 'cart' && (
              <button 
                onClick={clearCart}
                className="w-full py-2 text-gray-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
              >
                Vaciar Carrito
              </button>
            )}
          </div>
        )}
      </div>
    </>
  );
}
