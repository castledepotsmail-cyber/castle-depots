import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface ProductOption {
    name: string;
    values: string[];
}

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
    options?: ProductOption[];
}

export interface CartItem extends Product {
    cartItemId: string; // Unique ID for cart entry (product.id + options)
    quantity: number;
    selectedOptions?: Record<string, string>;
}

interface CartState {
    items: CartItem[];
    addItem: (product: Product, selectedOptions?: Record<string, string>) => void;
    removeItem: (cartItemId: string) => void;
    updateQuantity: (cartItemId: string, quantity: number) => void;
    clearCart: () => void;
    totalItems: () => number;
    totalPrice: () => number;
}

// Helper to generate unique ID based on product ID and selected options
const generateCartItemId = (productId: string, options?: Record<string, string>) => {
    if (!options || Object.keys(options).length === 0) return productId;
    // Sort keys to ensure consistent order
    const sortedOptions = Object.keys(options).sort().reduce((acc, key) => {
        acc[key] = options[key];
        return acc;
    }, {} as Record<string, string>);
    return `${productId}-${JSON.stringify(sortedOptions)}`;
};

export const useCartStore = create<CartState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: (product, selectedOptions) => {
                const items = get().items;
                const cartItemId = generateCartItemId(product.id, selectedOptions);
                const existingItem = items.find((item) => item.cartItemId === cartItemId);

                if (existingItem) {
                    if (existingItem.quantity + 1 > product.stock_quantity) {
                        alert(`Sorry, only ${product.stock_quantity} items available in stock.`);
                        return;
                    }
                    set({
                        items: items.map((item) =>
                            item.cartItemId === cartItemId
                                ? { ...item, quantity: item.quantity + 1 }
                                : item
                        ),
                    });
                } else {
                    if (product.stock_quantity < 1) {
                        alert("Sorry, this item is out of stock.");
                        return;
                    }
                    set({
                        items: [...items, {
                            ...product,
                            quantity: 1,
                            selectedOptions,
                            cartItemId
                        }]
                    });
                }
            },
            removeItem: (cartItemId) => {
                set({ items: get().items.filter((item) => item.cartItemId !== cartItemId) });
            },
            updateQuantity: (cartItemId, quantity) => {
                const items = get().items;
                const item = items.find((i) => i.cartItemId === cartItemId);

                if (!item) return;

                if (quantity <= 0) {
                    get().removeItem(cartItemId);
                } else if (quantity > item.stock_quantity) {
                    alert(`Sorry, only ${item.stock_quantity} items available in stock.`);
                    set({
                        items: items.map((i) =>
                            i.cartItemId === cartItemId ? { ...i, quantity: item.stock_quantity } : i
                        ),
                    });
                } else {
                    set({
                        items: items.map((i) =>
                            i.cartItemId === cartItemId ? { ...i, quantity } : i
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
