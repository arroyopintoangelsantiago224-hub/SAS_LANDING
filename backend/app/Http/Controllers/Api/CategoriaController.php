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
            // Include product count for admin
            return response()->json($query->withCount('productos')->orderBy('orden')->get());
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
        return response()->json($categoria, 201);
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

    public function destroy(Request $request, string $id)
    {
        $categoria = Categoria::findOrFail($id);
        $productCount = $categoria->productos()->count();

        if ($productCount > 0 && !$request->has('force')) {
            return response()->json([
                'error' => 'Conflict',
                'message' => "No se puede eliminar la categoría porque tiene {$productCount} productos relacionados.",
                'product_count' => $productCount
            ], 409);
        }

        if ($request->has('force')) {
            // Delete related products as well
            $categoria->productos()->delete();
        }

        $categoria->delete();
        return response()->json(['message' => 'Categoría eliminada correctamente']);
    }
}
