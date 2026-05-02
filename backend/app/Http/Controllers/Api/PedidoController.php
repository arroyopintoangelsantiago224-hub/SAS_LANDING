<?php

namespace App\Http\Controllers\Api;

use App\Http\Controllers\Controller;
use Illuminate\Http\Request;

use App\Models\Pedido;
use App\Models\Producto;
use App\Models\ItemPedido;
use Illuminate\Support\Facades\DB;

class PedidoController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $pedidos = Pedido::with('items')->latest()->get();
        return response()->json($pedidos);
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'usuario_id' => 'nullable|exists:usuarios,id',
            'nombre_cliente' => 'required|string|max:255',
            'telefono_cliente' => 'required|string|max:20',
            'direccion_cliente' => 'required|string',
            'latitud' => 'nullable|numeric',
            'longitud' => 'nullable|numeric',
            'metodo_pago' => 'required|string',
            'notas' => 'nullable|string',
            'items' => 'required|array|min:1',
            'items.*.producto_id' => 'required|exists:productos,id',
            'items.*.cantidad' => 'required|integer|min:1',
        ]);

        try {
            DB::beginTransaction();

            $subtotal = 0;
            $itemsToSave = [];

            foreach ($validated['items'] as $itemData) {
                $producto = Producto::find($itemData['producto_id']);
                if (!$producto) continue;
                
                $itemSubtotal = $producto->precio * $itemData['cantidad'];
                $subtotal += $itemSubtotal;

                $itemsToSave[] = [
                    'producto_id' => $producto->id,
                    'nombre_producto' => $producto->nombre,
                    'precio_unitario' => $producto->precio,
                    'cantidad' => $itemData['cantidad'],
                    'subtotal' => $itemSubtotal,
                ];
            }

            $pedido = Pedido::create([
                'usuario_id' => $validated['usuario_id'] ?? null,
                'nombre_cliente' => $validated['nombre_cliente'],
                'telefono_cliente' => $validated['telefono_cliente'],
                'direccion_cliente' => $validated['direccion_cliente'],
                'latitud' => $validated['latitud'] ?? null,
                'longitud' => $validated['longitud'] ?? null,
                'subtotal' => $subtotal,
                'total' => $subtotal,
                'metodo_pago' => $validated['metodo_pago'],
                'estado_pago' => 'pendiente',
                'estado_pedido' => 'pendiente',
                'notas' => $validated['notas'] ?? null,
            ]);

            foreach ($itemsToSave as $item) {
                $pedido->items()->create($item);
            }

            DB::commit();

            // Broadcast the event (wrapped in try-catch so it doesn't block the order if Reverb is down)
            try {
                broadcast(new \App\Events\OrderCreated($pedido->load('items')))->toOthers();
            } catch (\Exception $e) {
                \Log::warning('Broadcast failed: ' . $e->getMessage());
            }

            return response()->json($pedido->load('items'), 201);
        } catch (\Exception $e) {
            DB::rollBack();
            \Log::error('Error creating order: ' . $e->getMessage(), [
                'request' => $request->all(),
                'trace' => $e->getTraceAsString()
            ]);
            return response()->json([
                'message' => 'Error al crear el pedido', 
                'error' => $e->getMessage(),
                'line' => $e->getLine()
            ], 500);
        }
    }

    /**
     * Display the specified resource.
     */
    public function show(string $id)
    {
        $pedido = Pedido::with('items')->find($id);
        if (!$pedido) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }
        return response()->json($pedido);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, string $id)
    {
        $pedido = Pedido::find($id);
        if (!$pedido) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }

        $validated = $request->validate([
            'estado_pedido' => 'nullable|string',
            'estado_pago' => 'nullable|string',
        ]);

        $pedido->update($validated);

        return response()->json($pedido);
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(string $id)
    {
        $pedido = Pedido::find($id);
        if (!$pedido) {
            return response()->json(['message' => 'Pedido no encontrado'], 404);
        }
        $pedido->delete();
        return response()->json(['message' => 'Pedido eliminado']);
    }
}
