<?php

use App\Http\Controllers\Api\BannerController;
use App\Http\Controllers\Api\CategoriaController;
use App\Http\Controllers\Api\ProductoController;
use App\Http\Controllers\Api\UploadController;
use App\Http\Controllers\Api\ConfigController;
use App\Http\Controllers\Api\AuthController;
use App\Http\Controllers\Api\PedidoController;
use App\Http\Controllers\Api\MetodoPagoController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::post('/auth/google', [AuthController::class, 'googleLogin']);

Route::get('/user', function (Request $request) {
    return $request->user();
})->middleware('auth:sanctum');

// Public routes
Route::get('/categorias', [CategoriaController::class, 'index']);
Route::get('/productos', [ProductoController::class, 'index']);
Route::get('/banners', [BannerController::class, 'index']);
Route::get('/configs', [ConfigController::class, 'index']);
Route::get('/metodos-pago', [MetodoPagoController::class, 'index']);
Route::post('/pedidos', [PedidoController::class, 'store']);

// Admin routes
Route::middleware(['admin.secure'])->group(function () {
    Route::post('/admin/upload', [UploadController::class, 'upload']);
    Route::apiResource('admin/productos', ProductoController::class);
    Route::apiResource('admin/categorias', CategoriaController::class);
    Route::apiResource('admin/banners', BannerController::class);
    Route::apiResource('admin/pedidos', PedidoController::class);
    Route::apiResource('admin/metodos-pago', MetodoPagoController::class);
    Route::post('/admin/configs', [ConfigController::class, 'update']);
});
