import api from '@/lib/api';

export interface AdminStats {
    total_orders: number;
    total_revenue: number;
    total_customers: number;
    total_products: number;
    recent_orders: any[];
}

export const adminService = {
    getStats: async (): Promise<AdminStats> => {
        const response = await api.get('/orders/stats/');
        return response.data;
    },

    getOrders: async (page = 1) => {
        const response = await api.get(`/orders/admin/?page=${page}`);
        return response.data.results ? response.data : { results: response.data, count: response.data.length };
    },

    updateOrderStatus: async (id: string, status: string) => {
        const response = await api.patch(`/orders/admin/${id}/`, { status });
        return response.data;
    },

    getCustomers: async (page = 1) => {
        const response = await api.get(`/auth/users/?page=${page}`);
        return response.data.results ? response.data : { results: response.data, count: response.data.length };
    },

    getCampaigns: async () => {
        const response = await api.get('/campaigns/');
        return response.data.results || response.data;
    },

    createCampaign: async (data: any) => {
        const response = await api.post('/campaigns/', data);
        return response.data;
    },

    deleteCampaign: async (id: string) => {
        const response = await api.delete(`/campaigns/${id}/`);
        return response.data;
    },

    getStoreSettings: async () => {
        const response = await api.get('/orders/settings/');
        return response.data.results || response.data;
    },

    updateStoreSettings: async (data: any) => {
        const response = await api.post('/orders/settings/', data);
        return response.data;
    }
};

export interface Campaign {
    id: string;
    title: string;
    description: string;
    image: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    discount_percentage?: number;
}
