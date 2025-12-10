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
    }
};
