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
        Schema::create('configuracion', function (Blueprint $table) {
            $table->id();
            $table->string('nombre_negocio');
            $table->string('email_contacto')->nullable();
            $table->string('telefono_whatsapp')->nullable();
            $table->string('logo_url')->nullable();
            $table->string('color_primario')->default('#000000');
            $table->string('color_secundario')->default('#ffffff');
            $table->text('direccion_fisica')->nullable();
            $table->decimal('latitud', 10, 8)->nullable();
            $table->decimal('longitud', 11, 8)->nullable();
            $table->string('horario_apertura')->nullable();
            $table->string('horario_cierre')->nullable();
            $table->integer('tiempo_promedio_preparacion')->default(30);
            $table->boolean('permite_entregas')->default(true);
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('configuracion');
    }
};
