'use client';

import React, { useEffect, useState } from 'react';
import { ShoppingBag, ArrowBigDownDash, X } from 'lucide-react';
import { useCartStore } from '@/store/useCartStore';
import { siteConfig } from '@/config/site';
import { cn } from '@/lib/utils';

export default function MyOrdersToggle() {
  const [mounted, setMounted] = useState(false);
  const isCartOpen = useCartStore((state) => state.isCartOpen);
  const lastOrderFinished = useCartStore((state) => state.lastOrderFinished);
  const setLastOrderFinished = useCartStore((state) => state.setLastOrderFinished);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    // Si se acaba de terminar un pedido y se cierra el carrito, mostrar la flecha
    if (lastOrderFinished && !isCartOpen) {
      setShowHint(true);
      // Ocultar después de 8 segundos automáticamente
      const timer = setTimeout(() => {
        setShowHint(false);
        setLastOrderFinished(false);
      }, 8000);
      return () => clearTimeout(timer);
    }
  }, [lastOrderFinished, isCartOpen]);

  if (!mounted || isCartOpen) return null;

  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;

  return (
    <div className="fixed bottom-6 right-6 z-[100] flex flex-col items-center">
      {/* Texto flotante sobre el botón */}
      <span className="mb-2 text-[10px] font-black uppercase tracking-[0.2em] text-gray-500 dark:text-gray-400 animate-bounce">
        Mis Pedidos
      </span>

      {/* Flecha indicadora animada */}
      {showHint && (
        <div className="absolute bottom-full mb-12 flex flex-col items-center animate-bounce">
          <div className="bg-white dark:bg-[#1A1A1E] text-black dark:text-white px-4 py-2 rounded-2xl shadow-2xl border border-black/5 dark:border-white/10 text-[11px] font-black uppercase tracking-widest whitespace-nowrap mb-2">
            ¡Rastrea tu pedido aquí!
            <button 
              onClick={() => { setShowHint(false); setLastOrderFinished(false); }}
              className="ml-2 hover:text-red-500 transition-colors"
            >
              <X className="w-3 h-3 inline" />
            </button>
          </div>
          <ArrowBigDownDash className="w-10 h-10 text-[var(--accent)] drop-shadow-xl" style={{ color: primaryColor }} />
        </div>
      )}

      {/* Botón Principal */}
      <button
        onClick={() => {
          // Aquí se abriría el modal de pedidos del cliente (a implementar si es necesario)
          window.location.href = '/mis-pedidos'; // O lo que corresponda
        }}
        className="w-14 h-14 rounded-2xl flex items-center justify-center shadow-2xl hover:scale-110 active:scale-95 transition-all animate-in slide-in-from-right-10 duration-500 bg-[#FACC15] border border-yellow-500/50 group"
      >
        <ShoppingBag className="w-6 h-6 text-black transition-transform group-hover:scale-110" />
      </button>
    </div>
  );
}
