<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Relations\HasMany;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class Categoria extends Model
{
    protected $table = 'categorias';

    protected $fillable = [
        'nombre',
        'descripcion',
        'imagen_url',
        'orden',
        'activa'
    ];

    public function productos(): HasMany
    {
        return $this->hasMany(Producto::class);
    }
}
