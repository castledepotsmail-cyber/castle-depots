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

    getOrders: async () => {
        const response = await api.get('/orders/admin/');
        return response.data;
    },

    updateOrderStatus: async (id: string, status: string) => {
        const response = await api.patch(`/orders/admin/${id}/`, { status });
        return response.data;
    },

    getCustomers: async () => {
        const response = await api.get('/accounts/users/'); // Need to check if this route exists or register it
        return response.data;
    },

    getCampaigns: async () => {
        const response = await api.get('/campaigns/');
        return response.data;
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
        return response.data;
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
