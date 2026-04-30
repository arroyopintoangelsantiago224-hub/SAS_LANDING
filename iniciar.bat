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
echo   [1/2] Levantando API Backend (Laravel) en puerto 8000 (Red Local)...
start "Backend (API)" /min cmd /c "cd backend && php artisan serve --host=0.0.0.0 --port=8000"

:: Pequeña pausa para asegurar que el puerto se libere
timeout /t 2 /nobreak > nul

:: Iniciar Frontend (Next.js)
echo   [2/2] Levantando UI Frontend (Next.js) en puerto 3000 (Red Local)...
start "Frontend (Next.js)" /min cmd /c "cd frontend && npx next dev -H 0.0.0.0"

echo.
echo   ================================================================
echo                      SISTEMA LISTO PARA USAR
echo   ================================================================
echo.
echo     URL DEL SISTEMA (FRONTEND):  http://localhost:3000
echo     URL DE LA API (BACKEND):     http://127.0.0.1:8000
echo.
echo   ================================================================
echo.
echo   [*] Las ventanas de ejecucion se han minimizado.
echo   [*] Para detener el sistema, cierra las ventanas minimizadas.
echo.
echo   Presiona cualquier tecla para cerrar este panel...
pause > nul
