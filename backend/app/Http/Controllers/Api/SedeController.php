<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Sede;
use Illuminate\Http\Request;

class SedeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        return response()->json(Sede::all());
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'direccion' => 'required|string|max:255',
            'telefono' => 'required|string|max:20',
        ]);

        $sede = Sede::create($validated);

        return response()->json($sede, 201);
    }

    /**
     * Display the specified resource.
     */
    public function show(Sede $sede)
    {
        return response()->json($sede);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, $id)
    {
        $sede = Sede::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'sometimes|string|max:255',
            'direccion' => 'sometimes|string|max:255',
            'telefono' => 'sometimes|string|max:20',
        ]);

        $sede->update($validated);

        return response()->json($sede);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy($id)
    {
        $sede = Sede::findOrFail($id);
        $sede->delete();

        return response()->json(null, 204);
    }
}
