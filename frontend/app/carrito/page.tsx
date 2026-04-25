import React from 'react';

export default function CarritoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Tu Carrito</h1>
      <div className="bg-white p-6 rounded-lg shadow">
        <p className="text-gray-500">Tu carrito está vacío.</p>
      </div>
    </div>
  );
}
