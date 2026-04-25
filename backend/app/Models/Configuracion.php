<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Configuracion extends Model
{
    protected $table = 'configuracion';

    protected $fillable = [
        'nombre_negocio',
        'email_contacto',
        'telefono_whatsapp',
        'logo_url',
        'color_primario',
        'color_secundario',
        'direccion_fisica',
        'latitud',
        'longitud',
        'horario_apertura',
        'horario_cierre',
        'tiempo_promedio_preparacion',
        'permite_entregas'
    ];
}
