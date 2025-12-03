import api from '@/lib/api';
import { signInWithPopup } from 'firebase/auth';
import { auth, googleProvider } from '@/lib/firebase';
import { useAuthStore } from '@/store/authStore';

export const authService = {
    login: async (username: string, password: string) => {
        const response = await api.post('/auth/login/', { username, password });
        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);

            // Get user data
            const userResponse = await api.get('/auth/me/');
            useAuthStore.getState().setUser(userResponse.data);
        }
        return response.data;
    },

    register: async (userData: Record<string, any>) => {
        const response = await api.post('/auth/register/', userData);
        return response.data;
    },

    googleAuth: async () => {
        const result = await signInWithPopup(auth, googleProvider);
        const user = result.user;

        const response = await api.post('/auth/google-auth/', {
            google_id: user.uid,
            email: user.email,
            first_name: user.displayName?.split(' ')[0] || '',
            last_name: user.displayName?.split(' ').slice(1).join(' ') || '',
            profile_picture: user.photoURL
        });

        if (response.data.access) {
            localStorage.setItem('access_token', response.data.access);
            localStorage.setItem('refresh_token', response.data.refresh);
            useAuthStore.getState().setUser(response.data.user);
        }
        return response.data;
    },

    logout: () => {
        localStorage.removeItem('access_token');
        localStorage.removeItem('refresh_token');
        useAuthStore.getState().logout();
    },

    getCurrentUser: async () => {
        const token = localStorage.getItem('access_token');
        if (token) {
            try {
                const response = await api.get('/auth/me/');
                useAuthStore.getState().setUser(response.data);
                return response.data;
            } catch {
                return null;
            }
        }
        return null;
    }
};
