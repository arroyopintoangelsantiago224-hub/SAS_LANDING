import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number | string;
  imagen_url?: string;
  cantidad: number;
}

export interface CustomerData {
  nombre: string;
  telefono: string;
  direccion: string;
  latitud?: number;
  longitud?: number;
  tipo_entrega: 'domicilio' | 'recoger';
  sede_id?: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  clearItems: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
  customerData: CustomerData;
  setCustomerData: (data: Partial<CustomerData>) => void;
  paymentMethod: string;
  setPaymentMethod: (method: string) => void;
  lastOrderFinished: boolean;
  setLastOrderFinished: (finished: boolean) => void;
  orderHistory: number[];
  addToOrderHistory: (orderId: number) => void;
  notifications: any[];
  addNotification: (notification: any) => void;
  markNotificationsAsRead: () => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      lastOrderFinished: false,
      orderHistory: [],
      notifications: [],
      setCartOpen: (open) => set({ isCartOpen: open }),
      setLastOrderFinished: (finished) => set({ lastOrderFinished: finished }),
      addToOrderHistory: (orderId) => set((state) => ({
        orderHistory: state.orderHistory.includes(orderId) ? state.orderHistory : [...state.orderHistory, orderId]
      })),
      addNotification: (notification) => set((state) => ({
        notifications: [
          { ...notification, id: Date.now(), read: false, createdAt: new Date().toISOString() },
          ...state.notifications
        ]
      })),
      markNotificationsAsRead: () => set((state) => ({
        notifications: state.notifications.map(n => ({ ...n, read: true }))
      })),
      markNotificationAsRead: (id) => set((state) => ({
        notifications: state.notifications.map(n => n.id === id ? { ...n, read: true } : n)
      })),
      addItem: (product) => {
        const currentItems = get().items;
        const existingItem = currentItems.find((item) => item.id === product.id);

        if (existingItem) {
          set({
            items: currentItems.map((item) =>
              item.id === product.id
                ? { ...item, cantidad: item.cantidad + 1 }
                : item
            ),
          });
        } else {
          set({ 
            items: [...currentItems, { ...product, cantidad: 1 }]
          });
        }
      },
      removeItem: (id) => {
        set({ items: get().items.filter((item) => item.id !== id) });
      },
      updateQuantity: (id, quantity) => {
        if (quantity <= 0) {
          get().removeItem(id);
          return;
        }
        set({
          items: get().items.map((item) =>
            item.id === id ? { ...item, cantidad: quantity } : item
          ),
        });
      },
      clearCart: () => set({ items: [], customerData: { nombre: '', telefono: '', direccion: '', latitud: undefined, longitud: undefined, tipo_entrega: 'domicilio', sede_id: undefined }, paymentMethod: '' }),
      clearItems: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.precio) * item.cantidad,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.cantidad, 0);
      },
      customerData: {
        nombre: '',
        telefono: '',
        direccion: '',
        latitud: undefined,
        longitud: undefined,
        tipo_entrega: 'domicilio',
        sede_id: undefined,
      },
      setCustomerData: (data) => set((state) => ({
        customerData: { ...state.customerData, ...data }
      })),
      paymentMethod: '',
      setPaymentMethod: (method) => set({ paymentMethod: method }),
    }),
    {
      name: 'cart-storage',
    }
  )
);
