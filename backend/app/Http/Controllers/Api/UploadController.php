<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Intervention\Image\ImageManager;
use Intervention\Image\Drivers\Gd\Driver;

class UploadController extends Controller
{
    public function upload(Request $request)
    {
        $request->validate([
            'image' => 'required|image|mimes:jpeg,png,jpg,gif,webp|max:2048',
            'type' => 'required|string|in:items,banners,site',
            'id' => 'nullable|string'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $type = $request->type;
            $id = $request->id ?? 'general';
            
            // Create manager with driver
            $manager = new ImageManager(new Driver());
            
            // Read image
            $img = $manager->read($image);
            
            // Generate unique filename with webp extension
            $filename = uniqid() . '.webp';
            
            // Encode as webp
            $encoded = $img->toWebp(80);
            
            // Define path: uploads/{type}/{id}/{filename}
            $path = "uploads/{$type}/{$id}";
            
            // Store
            Storage::disk('public')->put($path . '/' . $filename, (string) $encoded);
            
            // Get URL
            $url = asset('storage/' . $path . '/' . $filename);
            
            return response()->json([
                'url' => $url,
                'path' => $path . '/' . $filename,
                'message' => 'Imagen subida correctamente'
            ]);
        }

        return response()->json(['error' => 'No se pudo subir la imagen'], 400);
    }
}
