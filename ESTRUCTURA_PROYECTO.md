# 📁 Estructura del Proyecto SaaS

## Arquitectura General

```
SAS_LANDING/
├── frontend/           # Next.js + Tailwind CSS
├── backend/            # Laravel API REST
├── database/           # Scripts SQL y migraciones
├── docs/               # Documentación
└── .env.example        # Variables de entorno
```

## Frontend (Next.js)
- **Framework:** Next.js 14
- **Estilos:** Tailwind CSS
- **Autenticación:** Google OAuth
- **Mapas:** Google Maps API
- **Estado:** Context API o Zustand

### Estructura Frontend
```
frontend/
├── app/
│   ├── (auth)/         # Rutas de autenticación
│   ├── dashboard/      # Área logueada
│   └── [tenant]/       # Rutas dinámicas por empresa
├── components/
├── hooks/
├── lib/
├── styles/
└── public/
```

## Backend (Laravel)
- **Framework:** Laravel 11
- **API:** REST + JSON
- **Autenticación:** Sanctum + Google OAuth
- **Base de Datos:** MySQL

### Estructura Backend
```
backend/
├── app/
│   ├── Models/         # Modelos con empresa_id
│   ├── Http/
│   │   └── Controllers/
│   └── Services/
├── database/
│   └── migrations/     # Migraciones multi-tenant
├── routes/
│   └── api.php
└── config/
```

## Base de Datos (MySQL)
- **Motor:** MySQL 8.0+
- **Herramienta:** MySQL Workbench
- **Aislamiento:** Basado en empresa_id

### Tablas Principales
- `empresas` - Clientes del SaaS
- `usuarios` - Usuarios por empresa
- `productos` - Productos por empresa
- `categorias` - Categorías por empresa
- `pedidos` - Pedidos multi-tenant
- `direcciones` - Direcciones de clientes

## Configuración

### Variables de Entorno (.env)
```
NEXT_PUBLIC_API_URL=http://localhost:8000/api
NEXT_PUBLIC_GOOGLE_CLIENT_ID=...
DB_HOST=127.0.0.1
DB_PASSWORD=...
```

## Fases de Desarrollo

### ✅ FASE 1: Configuración Base (EN PROGRESO)
- [x] Estructura de carpetas
- [ ] Next.js inicializado
- [ ] Laravel inicializado
- [ ] Base de datos creada
- [ ] Variables de entorno

### FASE 2: Frontend Cliente
### FASE 3: Backend API Core
### FASE 4: Panel Administrativo
### FASE 5: Personalización
### FASE 6: Integraciones
