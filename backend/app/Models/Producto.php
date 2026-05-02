<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Producto extends Model
{
    protected $table = 'productos';

    protected $fillable = [
        'categoria_id',
        'nombre',
        'descripcion',
        'precio',
        'imagen_url',
        'disponible',
        'orden'
    ];

    public function categoria(): BelongsTo
    {
        return $this->belongsTo(Categoria::class);
    }

    public function getImagenUrlAttribute($value)
    {
        if (!$value) return null;
        if (str_contains($value, 'localhost') || str_contains($value, '127.0.0.1') || str_contains($value, '192.168.')) {
            return asset(parse_url($value, PHP_URL_PATH));
        }
        return $value;
    }
}
