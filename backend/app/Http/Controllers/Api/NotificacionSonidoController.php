<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\NotificacionSonido;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;

class NotificacionSonidoController extends Controller
{
    public function index()
    {
        return response()->json(NotificacionSonido::all());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string',
            'archivo_url' => 'required|string',
            'activo' => 'boolean'
        ]);

        if ($validated['activo'] ?? false) {
            NotificacionSonido::query()->update(['activo' => false]);
        }

        $sonido = NotificacionSonido::create($validated);
        return response()->json($sonido, 201);
    }

    public function update(Request $request, $id)
    {
        $sonido = NotificacionSonido::findOrFail($id);
        
        if ($request->has('activo') && $request->activo) {
            NotificacionSonido::query()->update(['activo' => false]);
        }

        $sonido->update($request->only(['nombre', 'activo']));
        return response()->json($sonido);
    }

    public function destroy($id)
    {
        $sonido = NotificacionSonido::findOrFail($id);
        
        // Delete file if it exists in storage
        $relativePath = str_replace(asset(''), '', $sonido->archivo_url);
        $storagePath = str_replace('storage/', '', $relativePath);
        Storage::disk('public')->delete($storagePath);

        $sonido->delete();
        return response()->json(['message' => 'Sonido eliminado']);
    }

    public function getActive()
    {
        $sonido = NotificacionSonido::where('activo', true)->first();
        return response()->json($sonido);
    }
}
