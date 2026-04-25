# 🚀 FASE 2: Frontend Cliente (Catálogo y Pedidos) - White Label

## Resumen
En esta fase nos enfocaremos en la experiencia del cliente final bajo un modelo de instancia única:
- ✅ Estructura de navegación fija (Instancia propia)
- ✅ Catálogo de productos atractivo y responsivo
- ✅ Gestión de carrito de compras local (Zustand)
- ✅ Proceso de checkout básico (Dirección y contacto)
- ✅ Envío de pedido a WhatsApp

---

## 🛠️ PASO 1: Estructura Base y Personalización Centralizada

Ya no usaremos rutas `[tenant]`. Cada despliegue tendrá su propia configuración.

### 1.1 Configuración de Marca
Archivo: `frontend/config/site.ts`
- Centralizar colores, logos y WhatsApp desde `.env`.

### 1.2 Layout Principal
Archivo: `frontend/app/layout.tsx`
- Header con logo (desde config).
- Botón flotante de carrito.
- Estilos globales basados en el color primario del cliente.

---

## 🛒 PASO 2: Catálogo de Productos

### 2.1 Página de Inicio y Filtros
Archivo: `frontend/app/catalogo/page.tsx`
- Grid de productos con imágenes optimizadas.
- Filtro por categorías (Hamburguesas, Pizzas, etc.).

### 2.2 Componentes de UI
- `ProductCard`: Diseño moderno con botón de agregar rápido.
- `CategoryBar`: Navegación rápida entre categorías.

---

## �️ PASO 3: Carrito de Compras y Estado Local

### 3.1 Gestión de Estado (Zustand)
Archivo: `frontend/store/useCartStore.ts`
- Persistencia en `localStorage`.
- Funciones para sumar, restar y eliminar items.

---

## 📝 PASO 4: Checkout y Envío a WhatsApp

### 4.1 Formulario de Entrega
- Captura de nombre, teléfono y dirección.
- Selección de método (Entrega / Retiro).

### 4.2 Generador de Mensaje WhatsApp
- Función para formatear el pedido y redirigir al API de WhatsApp del negocio.

- `ProductCard`: Imagen, nombre, precio y botón "Agregar"
- `CategoryFilter`: Scroll horizontal de categorías
- `CartDrawer`: Panel lateral para ver y editar el carrito

### 2.2 Estado del Carrito (Zustand o Context)
- Agregar/Eliminar productos
- Modificar cantidades
- Persistencia en `localStorage`

---

## 📝 PASO 3: Flujo de Checkout

### 3.1 Formulario de Datos
- Nombre y Teléfono (WhatsApp)
- Selección de método de entrega (Local / Domicilio)

### 3.2 Integración con Mapas (Google Maps)
- Componente para seleccionar ubicación exacta
- Autocompletado de direcciones

---

## 🚀 PASO 4: Confirmación y Envío

### 4.1 Resumen del Pedido
- Total a pagar
- Detalle de productos
- Tiempo estimado

### 4.2 Envío a WhatsApp (MVP)
- Generar link de WhatsApp con el resumen del pedido para el dueño del negocio.

---

## ✅ Checklist de Fase 2
- [ ] Renderizado dinámico según el `tenant` en la URL
- [ ] Carrito de compras funcional y persistente
- [ ] UI adaptada a dispositivos móviles (Mobile First)
- [ ] Integración básica con Google Maps para direcciones
- [ ] Generación de mensaje de pedido para WhatsApp

---

## 📚 Siguiente: FASE 3
Con el frontend cliente listo, procederemos a crear el **Backend API Core** para persistir estos datos y manejar la lógica de negocio real.
