<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return view('welcome');
});

use Illuminate\Support\Facades\Artisan;

Route::get('/reparar-fotos', function () {
    try {
        Artisan::call('storage:link', ['--force' => true]);
        return "✅ Enlace de almacenamiento creado con éxito.";
    } catch (\Exception $e) {
        return "❌ Error: " . $e->getMessage();
    }
});
