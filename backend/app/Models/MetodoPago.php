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
}
