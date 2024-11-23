import { create } from 'zustand';
import { persist } from 'zustand/middleware';

interface User {
  username: string;
  isAuthenticated: boolean;
}

interface AuthStore {
  user: User | null;
  login: (username: string, password: string) => boolean;
  logout: () => void;
}

export const useAuthStore = create<AuthStore>()(
  persist(
    (set) => ({
      user: null,
      login: (username, password) => {
        if (username === 'admin' && password === 'prabha@1234') {
          set({ user: { username, isAuthenticated: true } });
          return true;
        }
        return false;
      },
      logout: () => set({ user: null }),
    }),
    {
      name: 'auth-storage',
    }
  )
);

interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  stock: number;
  minStock: number;
  lastUpdated: string;
}

interface ProductStore {
  products: Product[];
  addProduct: (product: Omit<Product, 'id' | 'lastUpdated'>) => void;
  updateProduct: (id: string, product: Partial<Product>) => void;
  deleteProduct: (id: string) => void;
  bulkDeleteProducts: (ids: string[]) => void;
}

export const useProductStore = create<ProductStore>()(
  persist(
    (set) => ({
      products: [],
      addProduct: (product) =>
        set((state) => ({
          products: [
            ...state.products,
            {
              ...product,
              price: Number(product.price),
              stock: Number(product.stock),
              minStock: Number(product.minStock),
              id: crypto.randomUUID(),
              lastUpdated: new Date().toISOString(),
            },
          ],
        })),
      updateProduct: (id, product) =>
        set((state) => ({
          products: state.products.map((p) =>
            p.id === id
              ? {
                  ...p,
                  ...product,
                  price: product.price ? Number(product.price) : p.price,
                  stock: product.stock ? Number(product.stock) : p.stock,
                  minStock: product.minStock ? Number(product.minStock) : p.minStock,
                  lastUpdated: new Date().toISOString(),
                }
              : p
          ),
        })),
      deleteProduct: (id) =>
        set((state) => ({
          products: state.products.filter((p) => p.id !== id),
        })),
      bulkDeleteProducts: (ids) =>
        set((state) => ({
          products: state.products.filter((p) => !ids.includes(p.id)),
        })),
    }),
    {
      name: 'product-storage',
    }
  )
);