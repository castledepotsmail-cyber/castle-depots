import api from '@/lib/api';

export interface Category {
    id: string;
    name: string;
    slug: string;
    image?: string;
    product_count?: number;
}

export interface Product {
    id: string;
    name: string;
    description: string;
    price: any; // string from API, number in frontend usually, but let's be flexible or strict. API returns string for decimals.
    discount_price?: any;
    image_main?: string;
    image?: string; // mapped
    stock_quantity: number;
    category: string; // ID or object? Serializer usually returns ID or nested. Let's check.
    category_name?: string; // We might need to map this
    slug: string;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    discountPrice?: number; // mapped
    average_rating?: number;
    review_count?: number;
    reviews?: any[];
}

export const productService = {
    getProducts: async (params: Record<string, any> = {}) => {
        const response = await api.get('/products/', { params });
        // Check if it's a paginated response
        const data = response.data.results ? response.data.results : (Array.isArray(response.data) ? response.data : []);

        // Map backend fields to frontend interface
        return data.map((p: any) => ({
            ...p,
            image: p.image_main,
            discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
            price: p.price // Keep original string for editing, or parse? Let's keep original for now or handle both.
        }));
    },

    getProductsPaginated: async (page: number = 1, search: string = '', pageSize: number = 10) => {
        const params: any = { page, page_size: pageSize };
        if (search) params.search = search;

        const response = await api.get('/products/', { params });

        const results = response.data.results || (Array.isArray(response.data) ? response.data : []);
        const count = response.data.count || results.length;

        const mappedResults = results.map((p: any) => ({
            ...p,
            image: p.image_main,
            discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
            price: p.price
        }));

        return { results: mappedResults, count };
    },

    getProduct: async (id: string, options?: { raw?: boolean }) => {
        const params = options?.raw ? { raw: 'true' } : {};
        const response = await api.get(`/products/${id}/`, { params });
        const p = response.data;
        return {
            ...p,
            image: p.image_main,
            discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
            price: p.price
        };
    },

    getRelatedProducts: async (categorySlug: string, currentId: string) => {
        // Fetch products in the same category
        const response = await api.get('/products/', { params: { category__slug: categorySlug } });
        const data = response.data.results ? response.data.results : (Array.isArray(response.data) ? response.data : []);

        const products = data.map((p: any) => ({
            ...p,
            image: p.image_main,
            discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
            price: p.price
        }));
        // Filter out current product and limit to 4
        return products.filter((p: any) => p.id !== currentId).slice(0, 4);
    },

    getCategories: async () => {
        const response = await api.get('/products/categories/');
        return response.data.results || response.data;
    },

    getCategory: async (slug: string) => {
        const response = await api.get(`/products/categories/${slug}/`);
        return response.data;
    },

    createReview: async (productId: string, rating: number, comment: string) => {
        const response = await api.post('/products/reviews/', {
            product_id: productId,
            rating,
            comment
        });
        return response.data;
    }
};
