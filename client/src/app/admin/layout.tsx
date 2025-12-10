"use client";

import { useAuthStore } from "@/store/authStore";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { Loader2 } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const { user, isAuthenticated } = useAuthStore();
    const router = useRouter();
    const [checking, setChecking] = useState(true);

    useEffect(() => {
        // Wait a bit to ensure auth state is rehydrated
        const timer = setTimeout(() => {
            if (!isAuthenticated || (!user?.is_staff && !user?.is_superuser)) {
                router.push('/');
            } else {
                setChecking(false);
            }
        }, 500); // Small delay for hydration

        return () => clearTimeout(timer);
    }, [isAuthenticated, user, router]);

    if (checking) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <Loader2 className="animate-spin text-brand-blue" size={48} />
            </div>
        );
    }

    return (
        <div className="min-h-screen bg-gray-50">
            {/* Admin Header could go here if separate from main header */}
            <div className="container mx-auto px-4 py-8">
                {children}
            </div>
        </div>
    );
}
