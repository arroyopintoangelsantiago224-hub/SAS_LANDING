<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class MetodoPago extends Model
{
    use HasFactory;

    protected $table = 'metodos_pago';

    protected $fillable = [
        'nombre',
        'tipo',
        'icono',
        'activo',
        'telefono',
        'qr_imagen',
        'banco',
        'tipo_cuenta',
        'numero_cuenta',
        'titular',
        'instrucciones',
        'configuracion_campos'
    ];

    protected $casts = [
        'activo' => 'boolean',
        'configuracion_campos' => 'array'
    ];

    public function getIconoAttribute($value)
    {
        if (!$value) return null;
        if (str_contains($value, 'localhost') || str_contains($value, '127.0.0.1') || str_contains($value, '192.168.')) {
            return asset(parse_url($value, PHP_URL_PATH));
        }
        return $value;
    }

    public function getQrImagenAttribute($value)
    {
        if (!$value) return null;
        if (str_contains($value, 'localhost') || str_contains($value, '127.0.0.1') || str_contains($value, '192.168.')) {
            return asset(parse_url($value, PHP_URL_PATH));
        }
        return $value;
    }
}
