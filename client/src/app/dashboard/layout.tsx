"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, User, Heart, LogOut } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";

export default function DashboardLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();
    const { user } = useAuthStore();
    
    const handleLogout = () => {
        authService.logout();
        window.location.href = '/';
    };

    const links = [
        { href: "/dashboard", label: "Overview", icon: LayoutDashboard },
        { href: "/dashboard/orders", label: "Orders", icon: Package },
        { href: "/dashboard/profile", label: "Profile", icon: User },
        { href: "/dashboard/wishlist", label: "Wishlist", icon: Heart },
    ];

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="flex flex-col md:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="md:w-64 flex-shrink-0">
                        <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-4">
                            <div className="flex items-center gap-3 mb-6 px-2">
                                {user?.profile_picture ? (
                                    <img src={user.profile_picture} alt="Profile" className="w-12 h-12 rounded-full" />
                                ) : (
                                    <div className="w-12 h-12 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold text-xl">
                                        {user?.first_name?.[0]}{user?.last_name?.[0]}
                                    </div>
                                )}
                                <div>
                                    <h3 className="font-bold text-gray-800">{user?.first_name} {user?.last_name}</h3>
                                    <p className="text-xs text-gray-500">{user?.email}</p>
                                </div>
                            </div>

                            <nav className="space-y-1">
                                {links.map((link) => {
                                    const Icon = link.icon;
                                    const isActive = pathname === link.href;
                                    return (
                                        <Link
                                            key={link.href}
                                            href={link.href}
                                            className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-blue-50 text-brand-blue font-bold' : 'text-gray-600 hover:bg-gray-50'}`}
                                        >
                                            <Icon size={20} />
                                            {link.label}
                                        </Link>
                                    );
                                })}
                                <button onClick={handleLogout} className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-500 hover:bg-red-50 transition-colors mt-4">
                                    <LogOut size={20} />
                                    Logout
                                </button>
                            </nav>
                        </div>
                    </aside>

                    {/* Content */}
                    <div className="flex-grow">
                        {children}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
