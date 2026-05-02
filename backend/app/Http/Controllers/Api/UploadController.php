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
            'image' => 'required|file|mimes:jpeg,png,jpg,gif,webp,mp3,wav,ogg,webm,mpeg|max:5120', // Max 5MB
            'type' => 'required|string|in:items,banners,site,pagos,sounds',
            'id' => 'nullable|string'
        ]);

        if ($request->hasFile('image')) {
            $image = $request->file('image');
            $type = $request->type;
            $id = $request->id ?? 'general';
            
            $isImage = str_starts_with($image->getMimeType(), 'image/');
            $originalName = pathinfo($image->getClientOriginalName(), PATHINFO_FILENAME);
            $extension = $isImage ? 'webp' : $image->getClientOriginalExtension();
            $filename = \Illuminate\Support\Str::slug($originalName) . '-' . uniqid() . '.' . $extension;
            $path = "uploads/{$type}/{$id}";

            if ($isImage) {
                // Create manager with driver
                $manager = new ImageManager(new Driver());
                $img = $manager->read($image);
                $encoded = $img->toWebp(80);
                Storage::disk('public')->put($path . '/' . $filename, (string) $encoded);
            } else {
                // Store raw file (for audio, etc.)
                Storage::disk('public')->putFileAs($path, $image, $filename);
            }
            
            // Get URL
            $url = asset('storage/' . $path . '/' . $filename);
            
            return response()->json([
                'url' => $url,
                'path' => 'storage/' . $path . '/' . $filename,
                'message' => 'Imagen subida correctamente'
            ]);
        }

        return response()->json(['error' => 'No se pudo subir la imagen'], 400);
    }
}
