<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Pedido extends Model
{
    protected $table = 'pedidos';

    protected $fillable = [
        'usuario_id',
        'nombre_cliente',
        'telefono_cliente',
        'direccion_cliente',
        'latitud',
        'longitud',
        'subtotal',
        'total',
        'metodo_pago',
        'estado_pago',
        'estado_pedido',
        'notas'
    ];

    public function items()
    {
        return $this->hasMany(ItemPedido::class);
    }

    public function usuario()
    {
        return $this->belongsTo(Usuario::class);
    }
}
