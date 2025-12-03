import api from '@/lib/api';

export const userService = {
    getProfile: async () => {
        const response = await api.get('/auth/me/');
        return response.data;
    },

    updateProfile: async (userData: any) => {
        const response = await api.patch('/auth/me/', userData);
        return response.data;
    },

    getAddresses: async () => {
        const response = await api.get('/auth/addresses/');
        return response.data;
    },

    addAddress: async (addressData: any) => {
        const response = await api.post('/auth/addresses/', addressData);
        return response.data;
    },

    updateAddress: async (id: string, addressData: any) => {
        const response = await api.patch(`/auth/addresses/${id}/`, addressData);
        return response.data;
    },

    deleteAddress: async (id: string) => {
        const response = await api.delete(`/auth/addresses/${id}/`);
        return response.data;
    }
};
