'use client';

import { useEffect } from 'react';
import { initEcho } from '@/lib/echo';
import { useOrderStore } from '@/store/useOrderStore';
import { toast } from 'sonner';

export default function SocketHandler() {
    const addOrder = useOrderStore((state) => state.addOrder);
    const loadOrders = useOrderStore((state) => state.loadOrders);

    useEffect(() => {
        // 1. Cargar pedidos iniciales
        loadOrders();

        // 2. Inicializar WebSockets
        const echo = initEcho();
        if (!echo) return;

        // 3. Solicitar permisos de notificación de Windows/Navegador
        if (typeof window !== 'undefined' && 'Notification' in window) {
            if (Notification.permission === 'default') {
                Notification.requestPermission().then(permission => {
                    console.log('Permiso de notificación:', permission);
                });
            }
        }

        // 4. Escuchar pedidos en tiempo real
        const channel = echo.channel('admin-orders');
        
        channel.listen('.order.created', (data: any) => {
            const pedido = data.pedido;
            
            // Actualizar la lista en el admin
            addOrder(pedido);

            // Notificación visual dentro de la web (Toast)
            toast.success(`¡Nuevo pedido de ${pedido.nombre_cliente}!`, {
                description: `Total: $${Number(pedido.total).toLocaleString('es-CO')}`,
                duration: 20000,
            });

            // NOTIFICACIÓN EMERGENTE DE WINDOWS (Nativa)
            if (typeof window !== 'undefined' && Notification.permission === 'granted') {
                // Cerramos cualquier notificación anterior con el mismo tag para que la nueva "salte" (renotify)
                const options = {
                    body: `Cliente: ${pedido.nombre_cliente}\nTotal: $${Number(pedido.total).toLocaleString('es-CO')}\n\nHaz clic para ver detalles.`,
                    icon: '/favicon.webp', // Intentamos usar el favicon como icono
                    tag: 'new-order-sas',
                    requireInteraction: true, // Esto hace que la notificación NO desaparezca sola
                    renotify: true, // Esto hace que Windows la muestre de nuevo aunque ya haya una abierta
                    silent: false, // Dejamos que Windows use su sonido por defecto si quiere
                };

                const n = new Notification('🔔 ¡NUEVO PEDIDO RECIBIDO!', options);
                
                n.onclick = () => {
                    window.focus();
                    n.close();
                };
            }
        });

        return () => {
            echo.leaveChannel('admin-orders');
        };
    }, [addOrder, loadOrders]);

    return null;
}
