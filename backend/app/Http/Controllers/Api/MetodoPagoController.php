<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\MetodoPago;
use Illuminate\Http\Request;

class MetodoPagoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(MetodoPago::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:100',
            'tipo' => 'required|in:qr,transferencia,contraentrega',
            'icono' => 'nullable|string',
            'activo' => 'boolean',
            'telefono' => 'nullable|string|max:20',
            'qr_imagen' => 'nullable|string',
            'banco' => 'nullable|string|max:100',
            'tipo_cuenta' => 'nullable|in:ahorros,corriente',
            'numero_cuenta' => 'nullable|string|max:50',
            'titular' => 'nullable|string|max:150',
            'instrucciones' => 'nullable|string',
            'configuracion_campos' => 'nullable|array',
        ]);

        $metodo = MetodoPago::create($validated);

        return response()->json($metodo, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(MetodoPago $metodoPago)
    {
        return response()->json($metodoPago);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $metodo = MetodoPago::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:100',
            'tipo' => 'sometimes|in:qr,transferencia,contraentrega',
            'icono' => 'nullable|string',
            'activo' => 'boolean',
            'telefono' => 'nullable|string|max:20',
            'qr_imagen' => 'nullable|string',
            'banco' => 'nullable|string|max:100',
            'tipo_cuenta' => 'nullable|in:ahorros,corriente',
            'numero_cuenta' => 'nullable|string|max:50',
            'titular' => 'nullable|string|max:150',
            'instrucciones' => 'nullable|string',
            'configuracion_campos' => 'nullable|array',
        ]);

        $metodo->update($validated);

        return response()->json($metodo);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $metodo = MetodoPago::findOrFail($id);
        $metodo->delete();

        return response()->json(null, 204);
    }
}
