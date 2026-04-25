import React from 'react';

export default function CatalogoPage() {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6">Nuestro Catálogo</h1>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {/* Aquí irán los productos */}
        <p className="text-gray-500">Cargando productos...</p>
      </div>
    </div>
  );
}
