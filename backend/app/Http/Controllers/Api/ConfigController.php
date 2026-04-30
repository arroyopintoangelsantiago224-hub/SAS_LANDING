<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use App\Models\Config;
use Illuminate\Http\Request;

class ConfigController extends Controller
{
    public function index()
    {
        // Return all configs as a key-value pair
        return response()->json(Config::pluck('value', 'key'));
    }

    public function update(Request $request)
    {
        $configs = $request->all();

        foreach ($configs as $key => $value) {
            Config::updateOrCreate(['key' => $key], ['value' => $value]);
            
            // Sync specific keys with .env files
            $this->syncWithEnv($key, $value);
        }

        return response()->json(['message' => 'Configuraciones actualizadas correctamente']);
    }

    private function syncWithEnv($key, $value)
    {
        $mapping = [
            'google_client_id' => 'GOOGLE_CLIENT_ID',
            'google_client_secret' => 'GOOGLE_CLIENT_SECRET',
            'google_maps_api_key' => 'NEXT_PUBLIC_GOOGLE_MAPS_API_KEY',
        ];

        if (isset($mapping[$key])) {
            $envKey = $mapping[$key];
            
            // Update Backend .env
            $this->updateEnvFile($envKey, $value, base_path('.env'));
            
            // Update Frontend .env.local
            // Assuming frontend is in a sibling directory named 'frontend'
            $frontendEnvPath = base_path('../frontend/.env.local');
            if (file_exists($frontendEnvPath)) {
                $this->updateEnvFile($envKey, $value, $frontendEnvPath);
            }
        }
    }

    private function updateEnvFile($key, $value, $path)
    {
        if (!file_exists($path)) return;

        $content = file_get_contents($path);
        
        // If the key already exists, replace it
        if (preg_match("/^{$key}=/m", $content)) {
            $content = preg_replace("/^{$key}=.*/m", "{$key}=\"{$value}\"", $content);
        } else {
            // Otherwise, append it
            $content .= "\n{$key}=\"{$value}\"";
        }

        file_put_contents($path, $content);
    }
}
