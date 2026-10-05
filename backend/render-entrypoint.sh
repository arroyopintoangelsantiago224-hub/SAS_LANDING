#!/usr/bin/env bash
set -e

echo "==> Iniciando Backend Laravel en Render..."

# Create database.sqlite if using SQLite and file doesn't exist
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    mkdir -p database
    touch database/database.sqlite
    echo "==> Base de datos SQLite verificada/creada."
fi

# Run storage link
php artisan storage:link || true

# Run database migrations
echo "==> Ejecutando migraciones..."
php artisan migrate --force || true

# Cache configuration & routes for production speed
echo "==> Optimizando cache de Laravel..."
php artisan config:cache || true
php artisan route:cache || true
php artisan view:cache || true

# Start Laravel using Render's assigned $PORT
PORT="${PORT:-10000}"
echo "==> Servidor escuchando en el puerto $PORT"
exec php artisan serve --host=0.0.0.0 --port="$PORT"
