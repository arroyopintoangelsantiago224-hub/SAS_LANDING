<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Categoria;
use Illuminate\Http\Request;

class CategoriaController extends Controller
{
    public function index(Request $request)
    {
        $query = Categoria::query();
        
        if ($request->has('admin')) {
            return response()->json($query->orderBy('orden')->get());
        }

        return response()->json($query->where('activa', true)->orderBy('orden')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'nombre' => 'required|string|max:255',
            'descripcion' => 'nullable|string',
            'imagen_url' => 'nullable|string',
            'orden' => 'integer',
            'activa' => 'boolean'
        ]);

        $categoria = Categoria::create($validated);
        return response()->json($categoria, 211);
    }

    public function show(string $id)
    {
        return response()->json(Categoria::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $categoria = Categoria::findOrFail($id);

        $validated = $request->validate([
            'nombre' => 'sometimes|required|string|max:255',
            'descripcion' => 'nullable|string',
            'imagen_url' => 'nullable|string',
            'orden' => 'integer',
            'activa' => 'boolean'
        ]);

        $categoria->update($validated);
        return response()->json($categoria);
    }

    public function destroy(string $id)
    {
        $categoria = Categoria::findOrFail($id);
        $categoria->delete();
        return response()->json(['message' => 'Categoría eliminada correctamente']);
    }
}
