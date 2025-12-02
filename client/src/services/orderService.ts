import api from '@/lib/api';

export const orderService = {
    createOrder: async (orderData: any) => {
        const response = await api.post('/orders/', orderData);
        return response.data;
    },

    getOrders: async () => {
        const response = await api.get('/orders/');
        return response.data;
    },

    getOrder: async (id: string) => {
        const response = await api.get(`/orders/${id}/`);
        return response.data;
    }
};
