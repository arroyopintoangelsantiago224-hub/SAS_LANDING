<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Banner;
use Illuminate\Http\Request;

class BannerController extends Controller
{
    public function index(Request $request)
    {
        $query = Banner::query();

        if ($request->has('admin')) {
            return response()->json($query->orderBy('orden')->get());
        }

        return response()->json($query->where('activo', true)->orderBy('orden')->get());
    }

    public function store(Request $request)
    {
        $validated = $request->validate([
            'titulo' => 'nullable|string|max:255',
            'subtitulo' => 'nullable|string|max:255',
            'imagen_url' => 'nullable|string',
            'orden' => 'integer',
            'activo' => 'boolean'
        ]);

        $banner = Banner::create($validated);
        return response()->json($banner, 201);
    }

    public function show(string $id)
    {
        return response()->json(Banner::findOrFail($id));
    }

    public function update(Request $request, string $id)
    {
        $banner = Banner::findOrFail($id);

        $validated = $request->validate([
            'titulo' => 'nullable|string|max:255',
            'subtitulo' => 'nullable|string|max:255',
            'imagen_url' => 'nullable|string',
            'orden' => 'integer',
            'activo' => 'boolean'
        ]);

        $banner->update($validated);
        return response()->json($banner);
    }

    public function destroy(string $id)
    {
        $banner = Banner::findOrFail($id);
        $banner->delete();
        return response()->json(['message' => 'Banner eliminado correctamente']);
    }
}
