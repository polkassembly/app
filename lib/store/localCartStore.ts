import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { CartItem } from '../net/queries/actions/useGetCartItem';
import { UpdateCartItemParams } from '../net/queries/actions/useUpdateCartItem';

interface LocalCartStore {
  items: CartItem[];
  addCartItem: (item: CartItem) => void;
  removeCartItem: (id: string) => void;
  updateCartItem: (updateCartItemParams: UpdateCartItemParams) => void;
  clearCartItems: () => void;
}

export const useLocalCartStore = create<LocalCartStore>()(
  persist(
    (set) => ({
      items: [],

      addCartItem: (item) => set((state) => {
        const exists = state.items.some((existing) => existing.id === item.id);
        if (exists) {
          return {
            items: state.items.map((existing) =>
              existing.id === item.id ? item : existing
            ),
          };
        } else {
          return {
            items: [...state.items, item],
          };
        }
      }),

      removeCartItem: (id) => set((state) => ({
        items: state.items.filter((item) => item.id !== id),
      })),

      updateCartItem: (updateCartItemParams) => set((state) => ({
        items: state.items.map((item) =>
          item.id === updateCartItemParams.id ?
            { ...item, ...updateCartItemParams } as CartItem
            : item
        ),
      })),

      clearCartItems: () => set({ items: [] }),
    }),
    {
      name: "local-cart-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);