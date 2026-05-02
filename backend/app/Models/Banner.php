<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Banner extends Model
{
    protected $table = 'banners';

    protected $fillable = [
        'titulo',
        'subtitulo',
        'imagen_url',
        'orden',
        'activo'
    ];

    public function getImagenUrlAttribute($value)
    {
        if (!$value) return null;
        if (str_starts_with($value, 'http')) return $value;
        return asset($value);
    }
}
