import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import { Product } from './cartStore';
import { wishlistService } from '@/services/wishlistService';

interface WishlistState {
    items: Product[];
    addItem: (product: Product) => Promise<void>;
    removeItem: (productId: string) => Promise<void>;
    isInWishlist: (productId: string) => boolean;
    clearWishlist: () => void;
    syncWithApi: () => Promise<void>;
}

export const useWishlistStore = create<WishlistState>()(
    persist(
        (set, get) => ({
            items: [],
            addItem: async (product) => {
                const items = get().items;
                if (!items.find((item) => item.id === product.id)) {
                    set({ items: [...items, product] });
                    try {
                        // Attempt to sync with API if logged in (this might fail if not logged in, which is fine for local state)
                        // Ideally we check auth state, but for now we can try/catch
                        if (localStorage.getItem('access_token')) {
                            await wishlistService.addToWishlist(product.id);
                        }
                    } catch (error) {
                        console.error("Failed to add to API wishlist", error);
                    }
                }
            },
            removeItem: async (productId) => {
                set({ items: get().items.filter((item) => item.id !== productId) });
                try {
                    if (localStorage.getItem('access_token')) {
                        // We need the wishlist ID, not product ID, to delete from API.
                        // But our store currently only stores Products.
                        // We might need to fetch the wishlist first to get the ID, or change store structure.
                        // For simplicity, let's just re-fetch the wishlist after local update or handle it differently.
                        // Actually, the API might support deleting by product_id if we adjust it, but standard is by ID.
                        // Let's assume we sync fully on load.
                        // If we want to delete by product ID, we need to find the wishlist item ID.
                        // Let's fetch wishlist items to find the ID.
                        const wishlistItems = await wishlistService.getWishlist();
                        const itemToDelete = wishlistItems.find((item: any) => item.product.id === productId);
                        if (itemToDelete) {
                            await wishlistService.removeFromWishlist(itemToDelete.id);
                        }
                    }
                } catch (error) {
                    console.error("Failed to remove from API wishlist", error);
                }
            },
            isInWishlist: (productId) => {
                return !!get().items.find((item) => item.id === productId);
            },
            clearWishlist: () => set({ items: [] }),
            syncWithApi: async () => {
                try {
                    if (localStorage.getItem('access_token')) {
                        const data = await wishlistService.getWishlist();
                        // Map API response to Product[]
                        const products = data.map((item: any) => item.product);
                        set({ items: products });
                    }
                } catch (error) {
                    console.error("Failed to sync wishlist", error);
                }
            }
        }),
        {
            name: 'castle-wishlist-storage',
        }
    )
);
