# 🚀 Guía de Modos: Local vs Simulación (ngrok)

Esta guía explica cómo alternar entre el desarrollo en tu PC y la simulación de producción para probar en el celular.

---

## 🟢 1. Modo Local (PC)
Usa este modo para trabajar rápido desde tu computadora sin depender de internet o ngrok.

### Pasos:
1.  **Editar `.env`**:
    *   En `frontend/.env.local`: Descomenta la sección **LOCAL** y comenta la de **SIMULACIÓN**.
    *   En `backend/.env`: Descomenta la sección **LOCAL** y comenta la de **SIMULACIÓN**.
2.  **Ejecutar**: Lanza el proyecto con `iniciar.bat`.
3.  **Acceso**: Abre `http://localhost:3000` en tu navegador.

---

## 🌐 2. Modo Simulación (Celular / ngrok)
Usa este modo para probar la **Geolocalización**, el **Inicio de sesión** y la experiencia real en un dispositivo móvil.

### Pasos:
1.  **Ejecutar ngrok**: Abre dos terminales y ejecuta los siguientes comandos:
    *   **Frontend (Puerto 3000):**
        ```bash
        ngrok http 3000
        ```
    *   **Backend (Puerto 8000):**
        ```bash
        ngrok http 8000
        ```
2.  **Actualizar URLs**:
    *   Copia las URLs generadas por ngrok (ej. `https://xxxx.ngrok-free.app`).
    *   Pégalas en la sección **SIMULACIÓN** de tus archivos `.env.local` y `.env`.
3.  **Bypass de Advertencia (CRÍTICO)**:
    *   Abre la URL del **BACKEND** en el navegador de tu celular.
    *   Haz clic en el botón azul **"Visit Site"**. Esto permite que las imágenes y la API carguen sin bloqueos.
4.  **Ejecutar**: Reinicia el proyecto con `iniciar.bat`.

---

## 🔐 Configuración de Google Auth
Para que el inicio de sesión no falle nunca, asegúrate de tener estas URLs en tu [Google Cloud Console](https://console.cloud.google.com/):

### Orígenes de JavaScript autorizados:
*   `http://localhost:3000`
*   `https://tu-url-frontend.ngrok-free.app`

### URIs de redireccionamiento autorizados:
*   `http://localhost:3000/api/auth/callback/google`
*   `https://tu-url-frontend.ngrok-free.app/api/auth/callback/google`

---

## 🛠️ Comandos de utilidad
| Servicio | Comando |
| :--- | :--- |
| **Limpiar Caché Backend** | `cd backend && php artisan config:clear` |
| **Limpiar Caché Frontend** | Borrar carpeta `.next` (opcional si hay errores raros) |
| **ngrok (Frontend)** | `ngrok http 3000` |
| **ngrok (Backend)** | `ngrok http 8000` |
