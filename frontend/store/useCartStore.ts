import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface CartItem {
  id: number;
  nombre: string;
  precio: number | string;
  imagen_url?: string;
  cantidad: number;
}

interface CartStore {
  items: CartItem[];
  addItem: (product: any) => void;
  removeItem: (id: number) => void;
  updateQuantity: (id: number, quantity: number) => void;
  clearCart: () => void;
  getTotal: () => number;
  getItemCount: () => number;
  isCartOpen: boolean;
  setCartOpen: (open: boolean) => void;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      isCartOpen: false,
      setCartOpen: (open) => set({ isCartOpen: open }),
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
            isCartOpen: true,
          });
        } else {
          set({ 
            items: [...currentItems, { ...product, cantidad: 1 }],
            isCartOpen: true 
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
      clearCart: () => set({ items: [] }),
      getTotal: () => {
        return get().items.reduce(
          (total, item) => total + Number(item.precio) * item.cantidad,
          0
        );
      },
      getItemCount: () => {
        return get().items.reduce((count, item) => count + item.cantidad, 0);
      },
    }),
    {
      name: 'cart-storage',
    }
  )
);
