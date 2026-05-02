import { create } from 'zustand';
import { adminFetchOrders } from '@/lib/api';

interface OrderState {
  pendingCount: number;
  orders: any[];
  setOrders: (orders: any[]) => void;
  addOrder: (order: any) => void;
  updateOrder: (order: any) => void;
  refreshPendingCount: () => void;
  loadOrders: () => Promise<void>;
}

export const useOrderStore = create<OrderState>((set, get) => ({
  pendingCount: 0,
  orders: [],
  
  setOrders: (orders) => {
    const pendingCount = orders.filter(o => o.estado_pedido !== 'entregado').length;
    set({ orders, pendingCount });
  },

  addOrder: (order) => {
    const { orders } = get();
    // Check if order already exists to avoid duplicates
    if (orders.find(o => o.id === order.id)) return;
    
    const newOrders = [order, ...orders];
    const pendingCount = newOrders.filter(o => o.estado_pedido !== 'entregado').length;
    set({ orders: newOrders, pendingCount });
  },

  updateOrder: (updatedOrder) => {
    const { orders } = get();
    const newOrders = orders.map(o => o.id === updatedOrder.id ? updatedOrder : o);
    const pendingCount = newOrders.filter(o => o.estado_pedido !== 'entregado').length;
    set({ orders: newOrders, pendingCount });
  },

  refreshPendingCount: () => {
    const { orders } = get();
    const pendingCount = orders.filter(o => o.estado_pedido !== 'entregado').length;
    set({ pendingCount });
  },

  loadOrders: async () => {
    try {
      const orders = await adminFetchOrders();
      const pendingCount = orders.filter((o: any) => o.estado_pedido !== 'entregado').length;
      set({ orders, pendingCount });
    } catch (error) {
      console.error('Error loading orders in store:', error);
    }
  }
}));
