'use client';

import React from 'react';
import { siteConfig } from '@/config/site';

export default function Loading() {
  const primaryColor = siteConfig.colors.primary === '#000000' ? '#E8A030' : siteConfig.colors.primary;
  
  return (
    <div className="fixed inset-0 z-[9999] flex flex-col items-center justify-center bg-white dark:bg-[#0A0A0C]">
      <div className="relative flex flex-col items-center">
        {/* Animated Rings */}
        <div className="relative w-24 h-24">
          <div 
            className="absolute inset-0 rounded-full border-[3px] border-transparent animate-[spin_2s_linear_infinite]"
            style={{ borderTopColor: primaryColor }}
          />
          <div 
            className="absolute inset-2 rounded-full border-[3px] border-transparent animate-[spin_1.5s_linear_infinite_reverse] opacity-50"
            style={{ borderTopColor: primaryColor }}
          />
          <div 
            className="absolute inset-4 rounded-full border-[3px] border-transparent animate-[spin_1s_linear_infinite]"
            style={{ borderTopColor: primaryColor }}
          />
        </div>

        {/* Text */}
        <div className="mt-12 text-center">
          <h2 className="text-xl font-black uppercase tracking-[0.3em] text-gray-900 dark:text-white animate-pulse">
            Cargando
          </h2>
          <div className="flex gap-1 justify-center mt-2">
            {[0, 1, 2].map((i) => (
              <div 
                key={i}
                className="w-1.5 h-1.5 rounded-full animate-bounce"
                style={{ 
                  backgroundColor: primaryColor,
                  animationDelay: `${i * 0.15}s` 
                }}
              />
            ))}
          </div>
        </div>
      </div>
      
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none opacity-20 dark:opacity-10">
        <div 
          className="absolute -top-[10%] -left-[10%] w-[40%] h-[40%] rounded-full blur-[120px]"
          style={{ backgroundColor: primaryColor }}
        />
        <div 
          className="absolute -bottom-[10%] -right-[10%] w-[40%] h-[40%] rounded-full blur-[120px]"
          style={{ backgroundColor: primaryColor }}
        />
      </div>
    </div>
  );
}
