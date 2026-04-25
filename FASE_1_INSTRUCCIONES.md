# 🚀 FASE 1: Configuración Base & Infraestructura

## Resumen
En esta fase configuraremos:
- ✅ Estructura de carpetas
- ✅ Base de datos MySQL
- ✅ Frontend Next.js
- ✅ Backend Laravel
- ✅ Variables de entorno
- ✅ Autenticación base

---

## 📋 Requisitos Previos

### Software necesario:
1. **Node.js** v18+ (para Next.js)
2. **PHP** 8.2+ (para Laravel)
3. **Composer** (gestor de dependencias PHP)
4. **MySQL** 8.0+ (con MySQL Workbench)
5. **Git** (opcional pero recomendado)

### Instalación de requisitos:

#### Windows:
```powershell
# Verificar si está instalado Node.js
node --version

# Verificar si está instalado PHP
php --version

# Verificar si está instalado Composer
composer --version

# Verificar si está instalado MySQL
mysql --version
```

---

## 🗄️ PASO 1: Configurar Base de Datos MySQL

### 1.1 Crear base de datos usando MySQL Workbench

1. Abre **MySQL Workbench**
2. Conéctate a tu servidor MySQL local (root, sin contraseña o con contraseña según tu setup)
3. Abre una nueva pestaña SQL
4. Abre el archivo: `database/schema_saas_pedidos.sql`
5. Ejecuta el script completo (Cmd+Enter o Ctrl+Enter)

### 1.2 Verificar la base de datos

```sql
-- En MySQL Workbench o terminal
USE saas_pedidos;
SHOW TABLES;
```

Deberías ver estas tablas:
- empresas
- usuarios
- categorias
- productos
- direcciones
- pedidos
- items_pedidos
- configuracion_empresa
- auditoria

✅ **Base de datos creada correctamente**

---

## 🔧 PASO 2: Configurar Backend (Laravel)

### 2.1 Navegar a la carpeta backend

```powershell
cd backend
```

### 2.2 Instalar dependencias

```bash
composer install
```

### 2.3 Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
Copy-Item .env.example -Destination .env

# Abrir el archivo .env y configurar:
# DB_HOST=127.0.0.1
# DB_DATABASE=saas_pedidos
# DB_USERNAME=root
# DB_PASSWORD=tu-contraseña (si tiene)
```

### 2.4 Generar APP_KEY

```bash
php artisan key:generate
```

### 2.5 Verifica la conexión a la BD

```bash
php artisan tinker
# En la consola escribe:
# DB::connection()->getPdo()
# Si no hay error, está conectado correctamente
# exit para salir
```

### 2.6 Iniciar servidor Laravel

```bash
php artisan serve
```

✅ **Backend corriendo en http://localhost:8000**

---

## ⚛️ PASO 3: Configurar Frontend (Next.js)

### 3.1 Navegar a la carpeta frontend

```powershell
cd frontend
```

### 3.2 Instalar dependencias

```bash
npm install
```

### 3.3 Configurar variables de entorno

```bash
# Copiar archivo de ejemplo
Copy-Item .env.local.example -Destination .env.local

# Actualizar el archivo .env.local con:
# NEXT_PUBLIC_API_URL=http://localhost:8000/api
```

### 3.4 Iniciar servidor Next.js

En otra terminal de PowerShell:

```bash
npm run dev
```

✅ **Frontend corriendo en http://localhost:3000**

---

## 🔐 PASO 4: Configurar Autenticación Base

### 4.1 Google OAuth

1. Ir a [Google Cloud Console](https://console.cloud.google.com/)
2. Crear un nuevo proyecto
3. Habilitar Google+ API
4. Crear credenciales OAuth 2.0
5. Obtener Client ID y Client Secret
6. Actualizar en `.env`:
   ```
   GOOGLE_CLIENT_ID=tu-client-id
   GOOGLE_CLIENT_SECRET=tu-client-secret
   ```

### 4.2 JWT Secret

```bash
# En .env del backend, generar un secret:
JWT_SECRET=su-secreto-super-seguro-aqui
```

### 4.3 Firebase (opcional para esta fase)

1. Crear proyecto en [Firebase Console](https://console.firebase.google.com/)
2. Obtener configuración
3. Actualizar en `.env.local`

---

## ✅ Verificación Final

### Checklist:

- [ ] Base de datos MySQL creada con todas las tablas
- [ ] Backend Laravel corriendo en http://localhost:8000
- [ ] Frontend Next.js corriendo en http://localhost:3000
- [ ] Variables de entorno configuradas
- [ ] Conexión Laravel ↔ MySQL verificada
- [ ] Google OAuth configurado (datos listos)

### Pruebas rápidas:

```bash
# Terminal 1: Backend
cd backend
php artisan serve

# Terminal 2: Frontend
cd frontend
npm run dev

# Terminal 3: Verificar APIs
curl http://localhost:8000/api/health
```

---

## 📁 Estructura Final

```
SAS_LANDING/
├── frontend/          ✅ Next.js configurado
├── backend/           ✅ Laravel configurado
├── database/
│   └── schema_saas_pedidos.sql  ✅ Ejecutado
├── .env.example       ✅ Creado
└── ESTRUCTURA_PROYECTO.md
```

---

## 🚨 Solución de Problemas

### Error: "Cannot find module 'next'"
```bash
cd frontend
npm install
```

### Error: "SQLSTATE[HY000]: General error: 2014"
- Verificar que MySQL está corriendo
- Verificar datos en `.env`

### Error: "Port 8000 already in use"
```bash
php artisan serve --port 8001
```

### Error: "Port 3000 already in use"
```bash
npm run dev -- -p 3001
```

---

## 📚 Siguiente: FASE 2

Una vez completada la Fase 1, avanzaremos con:
- Frontend Cliente (login, catálogo, carrito)
- Sistema de pedidos básico

---

## 📞 Contacto

Cualquier duda o problema, avísame en el siguiente paso.

✅ **¡FASE 1 LISTA PARA COMENZAR!**
