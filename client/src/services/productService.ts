import api from '@/lib/api';

export const productService = {
    getProducts: async (params: Record<string, any> = {}) => {
        const response = await api.get('/products/', { params });
        const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
        // Map backend fields to frontend interface
        return data.map((p: any) => ({
            ...p,
            image: p.image_main,
            discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
            price: parseFloat(p.price)
        }));
    },

    getProduct: async (id: string) => {
        const response = await api.get(`/products/${id}/`);
        const p = response.data;
        return {
            ...p,
            image: p.image_main,
            discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
            price: parseFloat(p.price)
        };
    },

    getRelatedProducts: async (categorySlug: string, currentId: string) => {
        // Fetch products in the same category
        const response = await api.get('/products/', { params: { category__slug: categorySlug } });
        const data = Array.isArray(response.data) ? response.data : (response.data.results || []);
        const products = data.map((p: any) => ({
            ...p,
            image: p.image_main,
            discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
            price: parseFloat(p.price)
        }));
        // Filter out current product and limit to 4
        return products.filter((p: any) => p.id !== currentId).slice(0, 4);
    },

    getCategories: async () => {
        const response = await api.get('/products/categories/');
        return response.data;
    }
};
