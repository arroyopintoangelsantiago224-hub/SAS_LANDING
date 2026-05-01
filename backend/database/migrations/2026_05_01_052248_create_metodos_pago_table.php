<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::create('metodos_pago', function (Blueprint $table) {
            $table->id();
            $table->string('nombre', 100);
            $table->enum('tipo', ['qr', 'transferencia', 'contraentrega']);
            $table->string('icono')->nullable();
            $table->boolean('activo')->default(true);

            // Datos para QR / billeteras
            $table->string('telefono', 20)->nullable();
            $table->string('qr_imagen')->nullable();

            // Datos bancarios
            $table->string('banco', 100)->nullable();
            $table->enum('tipo_cuenta', ['ahorros', 'corriente'])->nullable();
            $table->string('numero_cuenta', 50)->nullable();

            // Datos generales
            $table->string('titular', 150)->nullable();
            $table->text('instrucciones')->nullable();

            // Configuración de campos (JSON para saber qué campos mostrar)
            $table->json('configuracion_campos')->nullable();

            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('metodos_pago');
    }
};
