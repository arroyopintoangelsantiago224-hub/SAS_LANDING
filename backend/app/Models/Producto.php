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
        if (str_starts_with($value, 'http')) return $value;
        return asset($value);
    }
}
