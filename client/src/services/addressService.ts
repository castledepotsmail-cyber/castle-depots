import api from '@/lib/api';

export interface Address {
    id: string;
    title: string;
    full_name: string;
    phone_number: string;
    street_address: string;
    city: string;
    postal_code?: string;
    is_default: boolean;
}

export const addressService = {
    getAddresses: async () => {
        const response = await api.get('/auth/addresses/');
        return response.data;
    },

    createAddress: async (data: Omit<Address, 'id'>) => {
        const response = await api.post('/auth/addresses/', data);
        return response.data;
    },

    updateAddress: async (id: string, data: Partial<Address>) => {
        const response = await api.patch(`/auth/addresses/${id}/`, data);
        return response.data;
    },

    deleteAddress: async (id: string) => {
        await api.delete(`/auth/addresses/${id}/`);
    }
};
