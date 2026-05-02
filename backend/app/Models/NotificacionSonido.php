<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class NotificacionSonido extends Model
{
    protected $table = 'notificacion_sonidos';

    protected $fillable = [
        'nombre',
        'archivo_url',
        'activo'
    ];

    protected $casts = [
        'activo' => 'boolean'
    ];

    public function getArchivoUrlAttribute($value)
    {
        if (!$value) return null;
        
        // Extract the relative path from the storage
        $path = str_replace(['http://localhost:8000/storage/', 'storage/'], '', $value);
        
        // Return the absolute URL via our CORS-safe endpoint
        return url('/api/storage-safe/' . ltrim($path, '/'));
    }
}
