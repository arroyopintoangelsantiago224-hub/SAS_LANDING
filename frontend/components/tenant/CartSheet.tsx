'use client';

import { useCartStore } from '@/store/useCartStore';
import { siteConfig } from '@/config/site';
import { Trash2, Plus, Minus, X, Send, ShoppingBag, MapPin, CreditCard, CheckCircle, Loader2, ArrowLeft, Smartphone, User, Clock, Truck, AlertCircle, Store, ChevronDown } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';
import { useSession, signIn } from 'next-auth/react';
import { GoogleMap, useJsApiLoader, MarkerF } from '@react-google-maps/api';

type Step = 'cart' | 'shipping' | 'payment' | 'confirmation' | 'success';

export default function CartSheet() {
  const { data: session } = useSession();
  const { 
    items, updateQuantity, removeItem, getTotal, clearCart, clearItems,
    isCartOpen, setCartOpen, customerData, setCustomerData, 
    paymentMethod, setPaymentMethod 
  } = useCartStore();
  
  const [mounted, setMounted] = useState(false);
  const [step, setStep] = useState<Step>('cart');
  const [loading, setLoading] = useState(false);
  const [detectingLocation, setDetectingLocation] = useState(false);
  const [showMap, setShowMap] = useState(false);
  const [orderResponse, setOrderResponse] = useState<any>(null);
  const [siteConfigs, setSiteConfigs] = useState<any>({});
  const [paymentMethods, setPaymentMethods] = useState<any[]>([]);
  const [sedes, setSedes] = useState<any[]>([]);
  const [locationAccuracy, setLocationAccuracy] = useState<number | null>(null);

  const { isLoaded } = useJsApiLoader({
    id: 'google-map-script',
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY || ""
  });

  useEffect(() => {
    setMounted(true);
    loadConfigs();
  }, []);

  async function loadConfigs() {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/configs`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const data = await response.json();
      setSiteConfigs(data);

      const payRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/metodos-pago`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const payData = await payRes.json();
      setPaymentMethods(payData.filter((m: any) => m.activo));

      const sedesRes = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/sedes`, {
        headers: { 'ngrok-skip-browser-warning': 'true' }
      });
      const sedesData = await sedesRes.json();
      setSedes(sedesData);
    } catch (error) {
      console.error('Error loading site configs:', error);
    }
  }

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
        usuario_id: session?.user?.id || null,
        nombre_cliente: customerData.nombre,
        telefono_cliente: customerData.telefono,
        direccion_cliente: customerData.tipo_entrega === 'recoger' ? 'Recoger en tienda' : customerData.direccion,
        latitud: customerData.tipo_entrega === 'recoger' ? null : (customerData.latitud || null),
        longitud: customerData.tipo_entrega === 'recoger' ? null : (customerData.longitud || null),
        metodo_pago: paymentMethod,
        tipo_entrega: customerData.tipo_entrega,
        sede_id: customerData.sede_id || null,
        items: items.map(item => ({
          producto_id: item.id,
          cantidad: item.cantidad
        }))
      };

      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/pedidos`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
        },
        body: JSON.stringify(orderData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al crear el pedido');
      }

      const data = await response.json();
      setOrderResponse(data);
      clearItems(); // Borrar items del local storage una vez enviado el pedido
      useCartStore.getState().setLastOrderFinished(true);
      useCartStore.getState().addToOrderHistory(data.id);
      setStep('success');
    } catch (error: any) {
      console.error('Error creating order:', error);
      alert(`Hubo un error al procesar tu pedido: ${error.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleGetLocation = () => {
    if (!navigator.geolocation) {
      alert('La geolocalización no es compatible con tu navegador');
      return;
    }

    setDetectingLocation(true);
    // Resetear datos actuales para forzar actualización visual inmediata
    setCustomerData({ latitud: undefined, longitud: undefined });
    setLocationAccuracy(null);

    let bestPosition: GeolocationPosition | null = null;

    // Usamos watchPosition para ir capturando múltiples lecturas durante 3 segundos
    // Esto permite que el GPS del dispositivo se "estabilice" y obtenga una mejor precisión
    const watchId = navigator.geolocation.watchPosition(
      (position) => {
        if (!bestPosition || position.coords.accuracy < bestPosition.coords.accuracy) {
          bestPosition = position;
        }
      },
      (error) => {
        console.error('Geolocation error:', error);
      },
      { enableHighAccuracy: true, timeout: 10000, maximumAge: 0 }
    );

    // Esperamos 3 segundos (3000ms) para recolectar la mejor lectura posible
    setTimeout(() => {
      navigator.geolocation.clearWatch(watchId);
      setDetectingLocation(false);

      if (bestPosition) {
        const { latitude, longitude, accuracy } = (bestPosition as GeolocationPosition).coords;
        setCustomerData({ latitud: latitude, longitud: longitude });
        setLocationAccuracy(accuracy);
        
        // Si la precisión es mayor a 50 metros, sugerimos calibración manual
        if (accuracy > 50) {
          setShowMap(true);
        }
      } else {
        alert('No se pudo obtener tu ubicación. Por favor, asegúrate de tener el GPS activo y los permisos concedidos.');
      }
    }, 3000);
  };

  const handleMapCalibration = (newLat: number, newLng: number) => {
    setCustomerData({ latitud: newLat, longitud: newLng });
  };

  const calculateEfficiency = (accuracy: number | null) => {
    if (!accuracy) return 0;
    if (accuracy <= 25) return 100; // Antes 15
    if (accuracy <= 60) return 98;  // Antes 50
    if (accuracy <= 120) return 90; // Antes 100
    if (accuracy <= 500) return 75;
    if (accuracy <= 1000) return 50;
    return 25;
  };

  const handleMarkAsPaid = async () => {
    if (!orderResponse?.id) return;
    setLoading(true);
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000/api'}/pedidos/${orderResponse.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'ngrok-skip-browser-warning': 'true'
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
    if (!orderResponse) return;

    const itemsList = (orderResponse.items || []).map((item: any) => 
      `- ${item.cantidad}x ${item.nombre_producto || item.nombre} ($${(Number(item.precio_unitario || item.precio) * item.cantidad).toLocaleString('es-CO')})`
    ).join('\n');
    
    const message = `*Nuevo Pedido Confirmado (#${orderResponse.id})*\n\n` +
      `👤 *Cliente:* ${orderResponse.nombre_cliente || customerData.nombre}\n` +
      `📞 *Teléfono:* ${orderResponse.telefono_cliente || customerData.telefono}\n` +
      `📍 *Ubicación:* ${orderResponse.tipo_entrega === 'recoger' ? 'Recoger en Sede' : (orderResponse.direccion_cliente || customerData.direccion)}\n` +
      `🏢 *Sede:* ${orderResponse.sede?.nombre || 'N/A'}\n` +
      `💳 *Pago:* ${orderResponse.metodo_pago || paymentMethod}\n\n` +
      `${itemsList}\n\n` +
      `*Total: $${Number(orderResponse.total).toLocaleString('es-CO')}*\n\n` +
      `🖼️ *Adjunto comprobante de pago por este medio.*`;
    
    const targetPhone = orderResponse.sede?.telefono || siteConfig.whatsapp;
    const whatsappUrl = `https://wa.me/${targetPhone}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
            <div className="space-y-10 animate-in fade-in slide-in-from-right-4 duration-500">
              {/* Bloque 0: Sede y Tipo de Entrega */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black">1</div>
                  <h3 className="text-sm font-black uppercase tracking-widest italic">Punto de Venta y Entrega</h3>
                </div>

                <div className="space-y-4 pl-9">
                  {/* Selector de Sede */}
                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Selecciona la Sede</label>
                    <div className="relative">
                      <Store className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <select 
                        value={customerData.sede_id || ''}
                        onChange={(e) => setCustomerData({ sede_id: Number(e.target.value) })}
                        className="w-full pl-12 pr-10 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-white/10 outline-none transition-all text-sm font-medium appearance-none cursor-pointer"
                      >
                        <option value="" disabled>Selecciona una sede...</option>
                        {sedes.map((sede) => (
                          <option key={sede.id} value={sede.id}>{sede.nombre}</option>
                        ))}
                      </select>
                      <ChevronDown className="absolute right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
                    </div>
                  </div>

                  {/* Selector de Tipo de Entrega */}
                  <div className="grid grid-cols-2 gap-3">
                    <button 
                      onClick={() => setCustomerData({ tipo_entrega: 'domicilio' })}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                        customerData.tipo_entrega === 'domicilio' 
                          ? "bg-[var(--accent)]/10 border-[var(--accent)] text-black dark:text-white" 
                          : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-400"
                      )}
                    >
                      <Truck className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Domicilio</span>
                    </button>
                    <button 
                      onClick={() => setCustomerData({ tipo_entrega: 'recoger' })}
                      className={cn(
                        "p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2",
                        customerData.tipo_entrega === 'recoger' 
                          ? "bg-[var(--accent)]/10 border-[var(--accent)] text-black dark:text-white" 
                          : "bg-gray-50 dark:bg-white/5 border-transparent text-gray-400"
                      )}
                    >
                      <ShoppingBag className="w-6 h-6" />
                      <span className="text-[10px] font-black uppercase tracking-widest">Recoger</span>
                    </button>
                  </div>
                </div>
              </div>

              {/* Bloque 1: Datos y Dirección */}
              <div className="space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-6 h-6 rounded-full bg-black dark:bg-white text-white dark:text-black flex items-center justify-center text-[10px] font-black">2</div>
                  <h3 className="text-sm font-black uppercase tracking-widest italic">Tus Datos</h3>
                </div>

                <div className="space-y-4 pl-9">
                  {!session && (
                    <button 
                      onClick={() => signIn('google')}
                      className="w-full py-3 rounded-xl bg-blue-500/5 border border-blue-500/10 flex items-center justify-center space-x-2 text-[9px] font-black uppercase tracking-widest hover:bg-blue-500/10 transition-colors mb-4"
                    >
                      <img src="https://www.google.com/favicon.ico" className="w-3.5 h-3.5" alt="Google" />
                      <span>Autocompletar con Google</span>
                    </button>
                  )}

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Nombre Completo</label>
                    <input 
                      type="text"
                      value={customerData.nombre}
                      onChange={(e) => setCustomerData({ nombre: e.target.value })}
                      className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-white/10 outline-none transition-all text-sm font-medium"
                      placeholder="Ej. Juan Pérez"
                    />
                  </div>

                  <div className="space-y-1">
                    <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Teléfono</label>
                    <div className="relative">
                      <Smartphone className="absolute left-5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                      <input 
                        type="tel"
                        value={customerData.telefono}
                        onChange={(e) => setCustomerData({ telefono: e.target.value })}
                        className="w-full pl-12 pr-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-white/10 outline-none transition-all text-sm font-medium"
                        placeholder="300 123 4567"
                      />
                    </div>
                  </div>

                  {customerData.tipo_entrega === 'domicilio' && (
                    <div className="space-y-1 animate-in slide-in-from-top-4 duration-300">
                      <label className="text-[9px] font-black uppercase tracking-[0.2em] text-gray-400 ml-1">Dirección Escrita</label>
                      <textarea 
                        value={customerData.direccion}
                        onChange={(e) => setCustomerData({ direccion: e.target.value })}
                        rows={2}
                        className="w-full px-5 py-3.5 rounded-2xl bg-gray-50 dark:bg-white/5 border border-transparent focus:border-black/10 dark:focus:border-white/10 outline-none transition-all text-sm font-medium resize-none"
                        placeholder="Calle, Carrera, Barrio, Apto/Casa..."
                      />
                    </div>
                  )}
                </div>
              </div>

              {/* Bloque 2: Ubicación GPS */}
              {customerData.tipo_entrega === 'domicilio' && (
                <div className="space-y-6 animate-in slide-in-from-top-4 duration-500">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-6 h-6 rounded-full bg-[var(--accent)] text-black flex items-center justify-center text-[10px] font-black">3</div>
                      <h3 className="text-sm font-black uppercase tracking-widest italic">Ubicación GPS (Opcional)</h3>
                    </div>
                    {customerData.latitud && (
                      <div className="flex flex-col items-end gap-2">
                        <div className={cn(
                          "flex items-center gap-1.5 px-3 py-1 rounded-full border animate-in zoom-in",
                          locationAccuracy && locationAccuracy <= 100 
                            ? "bg-green-500/10 border-green-500/20 text-green-600" 
                            : "bg-amber-500/10 border-amber-500/20 text-amber-600"
                        )}>
                          {locationAccuracy && locationAccuracy <= 100 ? (
                            <CheckCircle className="w-3 h-3" />
                          ) : (
                            <AlertCircle className="w-3 h-3" />
                          )}
                          <span className="text-[8px] font-black uppercase tracking-widest">
                            {locationAccuracy && locationAccuracy <= 100 ? 'GPS Preciso' : 'Ubicación Estimada'}
                          </span>
                          <div className="h-3 w-[1px] bg-current opacity-20 mx-1" />
                          <span className="text-[9px] font-black">{calculateEfficiency(locationAccuracy)}%</span>
                        </div>
                      </div>
                    )}
                  </div>

                  <div className="pl-9 space-y-4">
                    {customerData.latitud && locationAccuracy && locationAccuracy > 100 && (
                      <div className="p-3 rounded-xl bg-amber-500/5 border border-amber-500/10 flex items-start gap-2 animate-in slide-in-from-top-2">
                        <AlertCircle className="w-4 h-4 text-amber-500 shrink-0 mt-0.5" />
                        <p className="text-[10px] text-amber-700 font-medium leading-relaxed">
                          Ubicación poco precisa. **Por favor, intenta capturarla nuevamente para mejorar la exactitud.**
                        </p>
                      </div>
                    )}
                    <p className="text-[10px] text-gray-500 leading-relaxed font-medium italic">
                      Recomendado: Vincular tu ubicación exacta para que el repartidor llegue sin errores.
                    </p>
                    
                    <button 
                      onClick={handleGetLocation}
                      disabled={detectingLocation}
                      className={cn(
                        "w-full py-4 rounded-2xl border-2 border-dashed transition-all flex items-center justify-center gap-3 group",
                        customerData.latitud 
                          ? "bg-green-500/5 border-green-500/20 text-green-600" 
                          : "bg-gray-50 dark:bg-white/5 border-black/5 dark:border-white/10 hover:border-[var(--accent)] text-gray-500 hover:text-[var(--accent)]"
                      )}
                    >
                      {detectingLocation ? (
                        <Loader2 className="w-5 h-5 animate-spin" />
                      ) : customerData.latitud ? (
                        <>
                          <MapPin className="w-5 h-5" />
                          <span className="text-xs font-black uppercase tracking-widest">Actualizar Punto GPS</span>
                        </>
                      ) : (
                        <>
                          <MapPin className="w-5 h-5 group-hover:scale-110 transition-transform" />
                          <span className="text-xs font-black uppercase tracking-widest">Capturar mi posición</span>
                        </>
                      )}
                    </button>

                    {/* Mapa de Calibración */}
                    {siteConfigs.habilitar_calibracion === '1' && customerData.latitud && isLoaded && (
                      <div className="space-y-3">
                        <p className="text-[9px] font-black uppercase tracking-widest text-center text-gray-400">Mapa de referencia</p>
                        <div className="w-full h-44 rounded-3xl overflow-hidden border border-black/5 dark:border-white/10 shadow-lg shadow-black/5">
                          <GoogleMap
                            mapContainerStyle={{ width: '100%', height: '100%' }}
                            center={{ lat: customerData.latitud, lng: customerData.longitud }}
                            zoom={17}
                            options={{
                              disableDefaultUI: true,
                              zoomControl: false,
                              styles: [{ featureType: 'all', elementType: 'labels.text.fill', color: '#333333' }]
                            }}
                          >
                            <MarkerF
                              position={{ lat: customerData.latitud, lng: customerData.longitud }}
                              draggable={true}
                              onDragEnd={(e) => {
                                if (e.latLng) handleMapCalibration(e.latLng.lat(), e.latLng.lng());
                              }}
                            />
                          </GoogleMap>
                        </div>
                      </div>
                    )}
                  </div>
                </div>
              )}
            </div>
          )}

          {step === 'payment' && (
            <div className="space-y-6 animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="space-y-4">
                <p className="text-[10px] font-black uppercase tracking-widest text-gray-400 ml-1">Selecciona método de pago</p>
                
                {paymentMethods.map((method) => (
                  <button
                    key={method.id}
                    onClick={() => setPaymentMethod(method.nombre)}
                    className={cn(
                      "w-full p-5 rounded-2xl border transition-all flex items-center justify-between group",
                      paymentMethod === method.nombre 
                        ? "bg-black text-white border-black dark:bg-white dark:text-black dark:border-white shadow-xl scale-[1.02]" 
                        : "bg-gray-50 dark:bg-white/5 border-transparent hover:border-black/10 dark:hover:border-white/10"
                    )}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={cn(
                        "w-10 h-10 p-2 rounded-lg transition-colors flex items-center justify-center overflow-hidden",
                        paymentMethod === method.nombre ? "bg-white/20" : "bg-gray-200 dark:bg-white/10"
                      )}>
                        {method.icono ? (
                          <img src={method.icono} alt={method.nombre} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                        ) : (
                          <CreditCard className="w-5 h-5" />
                        )}
                      </div>
                      <div className="text-left">
                        <span className="font-bold text-sm block leading-none">{method.nombre}</span>
                        <span className={cn(
                          "text-[8px] font-black uppercase tracking-tighter",
                          paymentMethod === method.nombre ? "text-white/60" : "text-[var(--muted)]"
                        )}>
                          {method.tipo}
                        </span>
                      </div>
                    </div>
                    <div className={cn(
                      "w-5 h-5 rounded-full border-2 flex items-center justify-center transition-all",
                      paymentMethod === method.nombre ? "border-white dark:border-black bg-white dark:bg-black" : "border-gray-300 dark:border-gray-600"
                    )}>
                      {paymentMethod === method.nombre && <div className="w-2 h-2 rounded-full bg-black dark:bg-white" />}
                    </div>
                  </button>
                ))}
                {paymentMethods.length === 0 && (
                  <p className="text-[10px] text-[var(--muted)] italic text-center">No hay métodos de pago configurados</p>
                )}
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
              {(() => {
                const selectedMethod = paymentMethods.find(m => m.nombre === (orderResponse?.metodo_pago || paymentMethod));
                if (!selectedMethod || selectedMethod.tipo === 'contraentrega' || orderResponse?.estado_pago !== 'pendiente') return null;

                const config = selectedMethod.configuracion_campos || {};

                return (
                  <div className="w-full bg-gray-50 dark:bg-white/5 rounded-[32px] p-6 border border-black/5 dark:border-white/5 space-y-4">
                    <div className="flex items-center justify-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-white p-1 flex items-center justify-center border border-black/5">
                        <img src={selectedMethod.icono} alt={selectedMethod.nombre} className="w-full h-full object-contain" referrerPolicy="no-referrer" />
                      </div>
                      <p className="text-[10px] font-black uppercase tracking-widest text-gray-400">Instrucciones de Pago</p>
                    </div>
                    
                    {config.qr_imagen && selectedMethod.qr_imagen && (
                      <div className="aspect-square w-48 mx-auto bg-white p-3 rounded-3xl shadow-xl border border-black/5 animate-in zoom-in duration-700">
                        <img src={selectedMethod.qr_imagen} alt="QR" className="w-full h-full object-contain" />
                      </div>
                    )}

                    <div className="space-y-2 text-center">
                      <p className="text-sm font-black text-gray-900 dark:text-white uppercase tracking-tight">
                        Pagar con {selectedMethod.nombre}
                      </p>
                      <div className="space-y-1">
                        {config.telefono && selectedMethod.telefono && (
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Cel: {selectedMethod.telefono}</p>
                        )}
                        {config.banco && selectedMethod.banco && (
                          <p className="text-xs font-bold text-gray-900 dark:text-white">Banco: {selectedMethod.banco}</p>
                        )}
                        {config.numero_cuenta && selectedMethod.numero_cuenta && (
                          <p className="text-xs font-bold text-gray-900 dark:text-white">
                            {selectedMethod.tipo_cuenta ? `${selectedMethod.tipo_cuenta.charAt(0).toUpperCase() + selectedMethod.tipo_cuenta.slice(1)}: ` : 'Cuenta: '}
                            {selectedMethod.numero_cuenta}
                          </p>
                        )}
                        {config.titular && selectedMethod.titular && (
                          <p className="text-xs font-medium text-[var(--muted)]">Titular: {selectedMethod.titular}</p>
                        )}
                      </div>
                      
                      <div className="p-4 rounded-2xl bg-[var(--accent)]/10 border border-[var(--accent)]/20 mt-4">
                        <p className="text-[11px] text-gray-900 dark:text-white font-black uppercase tracking-tight leading-relaxed">
                          ⚠️ Por favor, una vez realices el pago, envía el comprobante por WhatsApp para confirmar tu pedido.
                        </p>
                      </div>

                      {config.instrucciones && selectedMethod.instrucciones && (
                        <p className="text-[10px] text-gray-500 leading-relaxed px-4 italic mt-2">
                          {selectedMethod.instrucciones}
                        </p>
                      )}
                    </div>
                  </div>
                );
              })()}

              {orderResponse?.estado_pago === 'por_verificar' && (
                <div className="w-full bg-orange-500/5 border border-orange-500/10 rounded-[32px] p-6 space-y-3">
                  <Clock className="w-8 h-8 text-orange-500 mx-auto" />
                  <p className="text-[10px] font-black uppercase tracking-widest text-orange-600">Pago por verificar</p>
                  <p className="text-xs text-gray-500 leading-relaxed">
                    Estamos validando tu pago. Te notificaremos pronto.
                  </p>
                </div>
              )}

              {(() => {
                const selectedMethod = paymentMethods.find(m => m.nombre === (orderResponse?.metodo_pago || paymentMethod));
                if (selectedMethod?.tipo === 'contraentrega') {
                  return (
                    <div className="w-full bg-blue-500/5 border border-blue-500/10 rounded-[32px] p-6 space-y-3">
                      <Truck className="w-8 h-8 text-blue-500 mx-auto" />
                      <p className="text-[10px] font-black uppercase tracking-widest text-blue-600">Pago Contraentrega</p>
                      <p className="text-xs text-gray-500 leading-relaxed text-center">
                        Prepara el efectivo para cuando llegue tu pedido. {selectedMethod.instrucciones}
                      </p>
                    </div>
                  );
                }
                return null;
              })()}
              
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
              disabled={loading || 
                (step === 'payment' && !paymentMethod) || 
                (step === 'shipping' && (
                  !customerData.sede_id || 
                  !customerData.nombre || 
                  !customerData.telefono || 
                  (customerData.tipo_entrega === 'domicilio' && !customerData.direccion)
                ))
              }
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
