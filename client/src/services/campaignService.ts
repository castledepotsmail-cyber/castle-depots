import api from '@/lib/api';

export interface CampaignBanner {
    id: string;
    type: 'top_bar' | 'hero_slide' | 'flash_sale' | 'popup' | 'sidebar';
    is_active: boolean;
    heading: string;
    subheading: string;
    image: string;
    link: string;
    button_text: string;
    display_pages: string[]; // or JSON
}

export interface Campaign {
    id: string;
    title: string;
    slug: string;
    description: string;
    start_time: string;
    end_time: string;
    is_active: boolean;
    theme_mode: string;
    primary_color: string;
    secondary_color: string;
    accent_color: string;
    product_selection_type: 'manual' | 'category' | 'all';
    target_category: string | null; // ID
    products: any[]; // Product objects
    banners: CampaignBanner[];
}

export const campaignService = {
    getCampaigns: async () => {
        const response = await api.get('/campaigns/');
        return response.data;
    },

    getCampaign: async (id: string) => {
        const response = await api.get(`/campaigns/${id}/`);
        return response.data;
    },

    createCampaign: async (data: any) => {
        const response = await api.post('/campaigns/', data);
        return response.data;
    },

    updateCampaign: async (id: string, data: any) => {
        const response = await api.patch(`/campaigns/${id}/`, data);
        return response.data;
    },

    deleteCampaign: async (id: string) => {
        const response = await api.delete(`/campaigns/${id}/`);
        return response.data;
    },

    getActiveCampaigns: async () => {
        const response = await api.get('/campaigns/active/');
        return response.data;
    },

    createBanner: async (data: any) => {
        const response = await api.post('/campaigns/banners/', data);
        return response.data;
    },

    updateBanner: async (id: string, data: any) => {
        const response = await api.patch(`/campaigns/banners/${id}/`, data);
        return response.data;
    },

    deleteBanner: async (id: string) => {
        const response = await api.delete(`/campaigns/banners/${id}/`);
        return response.data;
    }
};
