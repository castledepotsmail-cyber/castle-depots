import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Product {
    id: string;
    name: string;
    price: number;
    image?: string;
    image_main?: string;
    discountPrice?: number;
    stock_quantity: number;
    average_rating?: number;
    review_count?: number;
}

export interface CartItem extends Product {
    quantity: number;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product) => void;
    removeItem: (productId: string) => void;
    updateQuantity: (productId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product) => {
                const items = get().items;
                const existingItem = items.find((item) => item.id === product.id);

                if (existingItem) {
                    if (existingItem.quantity + 1 > product.stock_quantity) {
                        alert(`Sorry, only ${product.stock_quantity} items available in stock.`);
                        return;
                    }
                    set({
                        items: items.map((item) =>
                            item.id === product.id
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    if (product.stock_quantity < 1) {
                        alert("Sorry, this item is out of stock.");
                        return;
                    }
                    set({ items: [...items, { ...product, quantity: 1 }] });
                }
            },
            removeItem: (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) });
            },
            updateQuantity: (productId, quantity) => {
                const items = get().items;
                const item = items.find((i) => i.id === productId);

                if (!item) return;

                if (quantity <= 0) {
                    get().removeItem(productId);
                } else if (quantity > item.stock_quantity) {
                    alert(`Sorry, only ${item.stock_quantity} items available in stock.`);
                    set({
                        items: items.map((i) =>
                            i.id === productId ? { ...i, quantity: item.stock_quantity } : i
                        ),
                    });
                } else {
                    set({
                        items: items.map((i) =>
                            i.id === productId ? { ...i, quantity } : i
                        ),
                    });
                }
            },
            clearCart: () => set({ items: [] }),
            totalItems: () => get().items.reduce((total, item) => total + item.quantity, 0),
            totalPrice: () =>
                get().items.reduce(
                    (total, item) =>
                        total + (item.discountPrice || item.price) * item.quantity,
                    0
                ),
        }),
        {
            name: 'castle-cart-storage',
        }
    )
);
