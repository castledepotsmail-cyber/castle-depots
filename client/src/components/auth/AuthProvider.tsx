"use client";

import { useEffect } from 'react';
import { authService } from '@/services/authService';

export default function AuthProvider({ children }: { children: React.ReactNode }) {
    useEffect(() => {
        // Initialize auth state on app load
        authService.getCurrentUser();
    }, []);

    return <>{children}</>;
}