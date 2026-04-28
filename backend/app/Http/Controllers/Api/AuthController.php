<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

class AuthController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function googleLogin(Request $request)
    {
        $userData = $request->validate([
            'email' => 'required|email',
            'name' => 'required|string',
            'image' => 'nullable|string',
            'google_id' => 'nullable|string',
        ]);

        $user = \App\Models\User::updateOrCreate(
            ['email' => $userData['email']],
            [
                'nombre' => $userData['name'],
                'google_id' => $userData['google_id'],
                'avatar_url' => $userData['image'],
                // Set a random password if it doesn't have one
                'contraseña' => \Illuminate\Support\Facades\Hash::make(\Illuminate\Support\Str::random(24)),
            ]
        );

        return response()->json([
            'message' => 'Usuario sincronizado correctamente',
            'user' => $user
        ]);
    }
}
