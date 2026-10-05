<?php

use Illuminate\Support\Facades\Route;

Route::get('/', function () {
    return response()->json([
        'status' => 'online',
        'message' => 'SAS API Backend is running successfully',
        'app' => config('app.name', 'Laravel Backend'),
        'timestamp' => now()->toIso8601String()
    ]);
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
