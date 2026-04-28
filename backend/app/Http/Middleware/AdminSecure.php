<?php

namespace App\Http\Middleware;

use Closure;
use Illuminate\Http\Request;
use Symfony\Component\HttpFoundation\Response;

class AdminSecure
{
    /**
     * Handle an incoming request.
     *
     * @param  Closure(Request): (Response)  $next
     */
    public function handle(Request $request, Closure $next): Response
    {
        $adminKey = $request->header('X-Admin-Key');
        $adminEmail = $request->header('X-Admin-Email');

        // 1. Verify Shared Secret between Frontend and Backend
        if ($adminKey !== env('ADMIN_API_KEY')) {
            return response()->json(['error' => 'Acceso denegado: Llave de seguridad inválida'], 401);
        }

        // 2. Verify User Role in Database
        if ($adminEmail) {
            $user = \App\Models\User::where('email', $adminEmail)->first();
            if (!$user || $user->rol !== 'admin' || $user->estado !== 'activo') {
                return response()->json(['error' => 'Acceso denegado: El usuario no tiene permisos de administrador'], 403);
            }
        } else {
            return response()->json(['error' => 'Acceso denegado: Identidad de administrador no proporcionada'], 401);
        }

        return $next($request);
    }
}
