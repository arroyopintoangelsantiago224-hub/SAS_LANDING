'use client';

import { useCartStore } from '@/store/useCartStore';
import { siteConfig } from '@/config/site';
import { Trash2, Plus, Minus, X, Send, ShoppingBag } from 'lucide-react';
import { useEffect, useState } from 'react';
import { cn } from '@/lib/utils';
import Link from 'next/link';

export default function CartSheet() {
  const { items, updateQuantity, removeItem, getTotal, clearCart, isCartOpen, setCartOpen } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

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

  const handleWhatsAppOrder = () => {
    const message = `*Nuevo Pedido - ${siteConfig.name}*\n\n` +
      items.map(item => `- ${item.cantidad}x ${item.nombre} ($${(Number(item.precio) * item.cantidad).toFixed(2)})`).join('\n') +
      `\n\n*Total: $${total.toFixed(2)}*\n\nPor favor, confírmame el pedido.`;
    
    const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
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
            <div className="p-2 bg-gray-100 dark:bg-white/5 rounded-xl">
              <ShoppingBag className="w-5 h-5 text-gray-900 dark:text-white" />
            </div>
            <h2 className="text-xl font-black text-gray-900 dark:text-white uppercase tracking-tight">Tu Carrito</h2>
          </div>
          <button 
            onClick={() => setCartOpen(false)}
            className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors"
          >
            <X className="w-6 h-6 text-gray-500 dark:text-gray-400" />
          </button>
        </div>

        {/* Content */}
        <div className="flex-grow overflow-y-auto p-6">
          {items.length === 0 ? (
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
          )}
        </div>

        {/* Footer */}
        {items.length > 0 && (
          <div className="p-6 border-t border-black/5 dark:border-white/5 bg-gray-50/50 dark:bg-white/5 backdrop-blur-sm space-y-4">
            <div className="flex justify-between items-end">
              <span className="text-xs font-black text-gray-500 dark:text-gray-400 uppercase tracking-widest">Total a pagar</span>
              <span className="text-3xl font-black text-gray-900 dark:text-white tracking-tighter">
                ${total.toLocaleString('es-CO')}
              </span>
            </div>
            
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full py-4 rounded-2xl text-black font-black text-sm uppercase tracking-widest flex items-center justify-center space-x-3 shadow-xl transition-all active:scale-[0.98]"
              style={{ 
                backgroundColor: primaryColor,
                boxShadow: `0 10px 20px -5px ${primaryColor}40`
              }}
            >
              <Send className="w-4 h-4" />
              <span>Pedir por WhatsApp</span>
            </button>

            <button 
              onClick={clearCart}
              className="w-full py-2 text-gray-400 hover:text-red-500 text-[10px] font-black uppercase tracking-widest transition-colors"
            >
              Vaciar Carrito
            </button>
          </div>
        )}
      </div>
    </>
  );
}
