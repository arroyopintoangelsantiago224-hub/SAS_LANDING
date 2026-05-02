@echo off
setlocal enabledelayedexpansion
title SAS LANDING - Centro de Control

:: Colores y Estética
:: 0 = Negro, B = Aguamarina, F = Blanco Brillante
color 0B

echo.
echo   ################################################################
echo   #                                                              #
echo   #             SISTEMA SAS LANDING - CONTROL CENTER             #
echo   #                                                              #
echo   ################################################################
echo.

:: Verificación de dependencias (Básico)
echo   [?] Verificando entorno...

if not exist "backend\vendor" (
    color 0C
    echo   [!] ADVERTENCIA: No se detecto la carpeta 'backend/vendor'. 
    echo       Asegurate de ejecutar 'composer install' en el backend.
    color 0B
)

if not exist "frontend\node_modules" (
    color 0C
    echo   [!] ADVERTENCIA: No se detecto la carpeta 'frontend/node_modules'. 
    echo       Asegurate de ejecutar 'npm install' en el frontend.
    color 0B
)

echo.
echo   [+] Iniciando servicios...
echo.

:: Iniciar Backend (Laravel)
echo   [1/3] Levantando API Backend (Laravel) en puerto 8000...
start "Backend (API)" /min cmd /c "cd backend && php artisan serve --host=127.0.0.1 --port=8000"

:: Iniciar WebSockets (Reverb)
echo   [2/3] Levantando Servidor WebSockets (Reverb) en puerto 8080...
start "WebSockets (Reverb)" /min cmd /c "cd backend && php artisan reverb:start"

:: Pequeña pausa para asegurar que los servicios se preparen
timeout /t 3 /nobreak > nul

:: Iniciar Frontend (Next.js)
echo   [3/3] Levantando UI Frontend (Next.js) en puerto 3000...
start "Frontend (Next.js)" /min cmd /c "cd frontend && npx next dev -H 127.0.0.1"

echo.
echo   ================================================================
echo                      SISTEMA LISTO PARA USAR
echo   ================================================================
echo.
echo     URL DEL SISTEMA (FRONTEND):  http://localhost:3000
echo     URL DE LA API (BACKEND):     http://127.0.0.1:8000
echo     CANAL WEBSOCKETS (REVERB):   http://localhost:8080
echo.
echo   ================================================================
echo.
echo   [*] Las ventanas de ejecucion se han minimizado.
echo   [*] Para detener el sistema, cierra las ventanas minimizadas.
echo.
echo   Presiona cualquier tecla para cerrar este panel...
pause > nul
