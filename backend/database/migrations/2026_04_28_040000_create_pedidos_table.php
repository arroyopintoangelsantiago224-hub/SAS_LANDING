<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('pedidos', function (Blueprint $table) {
            $table->id();
            $table->foreignId('usuario_id')->nullable()->constrained('usuarios');
            $table->string('nombre_cliente');
            $table->string('telefono_cliente');
            $table->text('direccion_cliente');
            $table->decimal('latitud', 10, 8)->nullable();
            $table->decimal('longitud', 11, 8)->nullable();
            $table->decimal('subtotal', 15, 2);
            $table->decimal('total', 15, 2);
            $table->string('metodo_pago'); 
            $table->string('estado_pago')->default('pendiente'); 
            $table->string('estado_pedido')->default('pendiente'); 
            $table->text('notas')->nullable();
            $table->timestamps();
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('pedidos');
    }
};
