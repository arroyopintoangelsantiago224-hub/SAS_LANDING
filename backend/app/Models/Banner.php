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
        if (str_contains($value, 'localhost') || str_contains($value, '127.0.0.1') || str_contains($value, '192.168.')) {
            return asset(parse_url($value, PHP_URL_PATH));
        }
        return $value;
    }
}
