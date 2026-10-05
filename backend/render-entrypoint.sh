#!/usr/bin/env bash
set -e

echo "==> Iniciando Backend Laravel en Render..."

# Ensure storage and cache folders exist with write permissions
mkdir -p storage/framework/cache/data storage/framework/sessions storage/framework/views storage/logs bootstrap/cache
chmod -R 777 storage bootstrap/cache

# Create database.sqlite if using SQLite and file doesn't exist
if [ "$DB_CONNECTION" = "sqlite" ] || [ -z "$DB_CONNECTION" ]; then
    mkdir -p database
    touch database/database.sqlite
    chmod -R 777 database
    echo "==> Base de datos SQLite verificada y permisos aplicados."
fi

# Run storage link
php artisan storage:link || true

# Run database migrations
echo "==> Ejecutando migraciones..."
php artisan migrate --force || true

# Seed database if database is fresh / empty
php artisan db:seed --force || true

# Cache configuration & routes for production speed
echo "==> Optimizando cache de Laravel..."
php artisan config:cache || true
php artisan route:cache || true

# Start Laravel using Render's assigned $PORT
PORT="${PORT:-10000}"
echo "==> Servidor escuchando en el puerto $PORT"
exec php artisan serve --host=0.0.0.0 --port="$PORT"
