import api from '../lib/api';

export const productService = {
    getProducts: async (params: Record<string, any> = {}) => {
        const response = await api.get('/products/', { params });
        return response.data;
    },

    getProduct: async (id: string) => {
        const response = await api.get(`/products/${id}/`);
        return response.data;
    },

    getCategories: async () => {
        const response = await api.get('/products/categories/');
        return response.data;
    }
};
