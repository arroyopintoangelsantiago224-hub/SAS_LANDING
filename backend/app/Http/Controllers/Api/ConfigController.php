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
        }

        return response()->json(['message' => 'Configuraciones actualizadas correctamente']);
    }
}
