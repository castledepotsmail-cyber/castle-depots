import api from '../lib/api';

export const wishlistService = {
    getWishlist: async () => {
        const response = await api.get('/products/wishlist/');
        return response.data;
    },

    addToWishlist: async (productId: string) => {
        const response = await api.post('/products/wishlist/', { product_id: productId });
        return response.data;
    },

    removeFromWishlist: async (id: string) => {
        const response = await api.delete(`/products/wishlist/${id}/`);
        return response.data;
    }
};
