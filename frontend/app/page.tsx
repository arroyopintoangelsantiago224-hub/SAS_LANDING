export default function Home() {
  return (
    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm">
        <h1 className="text-4xl font-bold mb-4">🚀 SaaS Pedidos</h1>
        <p className="text-gray-600 mb-8">
          Plataforma de gestión de órdenes para negocios gastronómicos
        </p>
        
        <div className="space-y-4">
          <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
            <h2 className="text-xl font-bold mb-2">✅ Backend (Laravel)</h2>
            <p className="text-gray-700">http://localhost:8000</p>
            <p className="text-sm text-gray-500 mt-2">Base de datos: MySQL (saas_pedidos)</p>
          </div>
          
          <div className="bg-green-50 p-6 rounded-lg border border-green-200">
            <h2 className="text-xl font-bold mb-2">✅ Frontend (Next.js)</h2>
            <p className="text-gray-700">http://localhost:3000</p>
            <p className="text-sm text-gray-500 mt-2">Corriendo exitosamente</p>
          </div>
        </div>
        
        <div className="mt-8 p-6 bg-purple-50 rounded-lg border border-purple-200">
          <h2 className="text-lg font-bold mb-4">📋 FASE 1 Completada:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>✅ Estructura de proyecto creada</li>
            <li>✅ Base de datos MySQL (9 tablas)</li>
            <li>✅ Backend Laravel con modelos y controladores</li>
            <li>✅ Frontend Next.js configurado</li>
            <li>✅ Conexión BD verificada</li>
          </ul>
        </div>

        <div className="mt-8 p-6 bg-yellow-50 rounded-lg border border-yellow-200">
          <h2 className="text-lg font-bold mb-4">🎯 Próximos pasos:</h2>
          <ul className="list-disc list-inside space-y-2 text-gray-700">
            <li>FASE 2: Crear páginas de autenticación con Google</li>
            <li>FASE 3: Implementar APIs REST</li>
            <li>FASE 4: Interfaz de productos y carrito</li>
          </ul>
        </div>
      </div>
    </main>
  );
}
