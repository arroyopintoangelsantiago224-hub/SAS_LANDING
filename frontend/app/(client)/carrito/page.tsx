'use client';

import { useCartStore } from '@/store/useCartStore';
import { siteConfig } from '@/config/site';
import { Trash2, Plus, Minus, ArrowLeft, Send } from 'lucide-react';
import Link from 'next/link';
import { useEffect, useState } from 'react';

export default function CarritoPage() {
  const { items, updateQuantity, removeItem, getTotal, clearCart } = useCartStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = getTotal();

  const handleWhatsAppOrder = () => {
    const message = `*Nuevo Pedido - ${siteConfig.name}*\n\n` +
      items.map(item => `- ${item.cantidad}x ${item.nombre} ($${(Number(item.precio) * item.cantidad).toFixed(2)})`).join('\n') +
      `\n\n*Total: $${total.toFixed(2)}*\n\nPor favor, confírmame el pedido.`;
    
    const whatsappUrl = `https://wa.me/${siteConfig.whatsapp}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, '_blank');
  };

  return (
    <div className="container mx-auto px-4 py-8 max-w-2xl">
      <div className="flex items-center space-x-4 mb-8">
        <Link href="/catalogo" className="p-2 hover:bg-gray-100 dark:hover:bg-white/5 rounded-full transition-colors">
          <ArrowLeft className="w-6 h-6 text-gray-600 dark:text-gray-400" />
        </Link>
        <h1 className="text-3xl font-bold text-gray-900 dark:text-white">Tu Carrito</h1>
      </div>

      {items.length === 0 ? (
        <div className="text-center py-20 bg-white dark:bg-[var(--card)] rounded-3xl border border-dashed border-gray-200 dark:border-white/10">
          <div className="mb-4 flex justify-center">
            <div className="p-4 bg-gray-50 dark:bg-white/5 rounded-full">
              <Plus className="w-12 h-12 text-gray-300 dark:text-gray-700 rotate-45" />
            </div>
          </div>
          <p className="text-gray-500 dark:text-gray-400 mb-6">Tu carrito está vacío</p>
          <Link 
            href="/catalogo"
            className="inline-flex items-center justify-center px-6 py-3 rounded-xl text-white font-semibold transition-transform active:scale-95 shadow-lg"
            style={{ backgroundColor: siteConfig.colors.primary }}
          >
            Ver Catálogo
          </Link>
        </div>
      ) : (
        <div className="space-y-6">
          {/* List of Items */}
          <div className="bg-white dark:bg-[var(--card)] rounded-3xl border border-gray-100 dark:border-white/10 overflow-hidden shadow-sm">
            {items.map((item) => (
              <div 
                key={item.id} 
                className="flex items-center p-4 border-b border-gray-50 dark:border-white/5 last:border-0"
              >
                <div className="w-20 h-20 rounded-2xl bg-gray-50 dark:bg-white/5 overflow-hidden flex-shrink-0">
                  {item.imagen_url && (
                    <img src={item.imagen_url} alt={item.nombre} className="w-full h-full object-cover" />
                  )}
                </div>
                
                <div className="ml-4 flex-grow">
                  <h3 className="font-semibold text-gray-900 dark:text-white">{item.nombre}</h3>
                  <p className="text-gray-500 dark:text-gray-400 text-sm">${Number(item.precio).toFixed(2)}</p>
                  
                  <div className="flex items-center justify-between mt-2">
                    <div className="flex items-center space-x-3 bg-gray-50 dark:bg-white/5 rounded-lg p-1">
                      <button 
                        onClick={() => updateQuantity(item.id, item.cantidad - 1)}
                        className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors"
                      >
                        <Minus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                      <span className="font-bold text-gray-900 dark:text-white w-4 text-center">{item.cantidad}</span>
                      <button 
                        onClick={() => updateQuantity(item.id, item.cantidad + 1)}
                        className="p-1 hover:bg-white dark:hover:bg-white/10 rounded-md transition-colors"
                      >
                        <Plus className="w-4 h-4 text-gray-600 dark:text-gray-400" />
                      </button>
                    </div>
                    
                    <button 
                      onClick={() => removeItem(item.id)}
                      className="p-2 text-red-400 hover:text-red-500 hover:bg-red-50 dark:hover:bg-red-500/10 rounded-full transition-colors"
                    >
                      <Trash2 className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Summary & Checkout */}
          <div className="bg-white dark:bg-[var(--card)] rounded-3xl p-6 border border-gray-100 dark:border-white/10 shadow-sm space-y-4">
            <div className="flex justify-between items-center text-lg">
              <span className="text-gray-600 dark:text-gray-400">Total a pagar</span>
              <span className="text-3xl font-black text-gray-900 dark:text-white">${total.toFixed(2)}</span>
            </div>
            
            <button 
              onClick={handleWhatsAppOrder}
              className="w-full py-4 rounded-2xl text-white font-bold text-lg flex items-center justify-center space-x-2 shadow-xl shadow-gray-200 dark:shadow-none transition-all active:scale-[0.98]"
              style={{ backgroundColor: siteConfig.colors.primary }}
            >
              <Send className="w-5 h-5" />
              <span>Pedir por WhatsApp</span>
            </button>

            <button 
              onClick={clearCart}
              className="w-full py-2 text-gray-400 hover:text-gray-600 dark:hover:text-gray-200 text-sm font-medium transition-colors"
            >
              Vaciar Carrito
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
