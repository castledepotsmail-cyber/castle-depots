"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { LayoutDashboard, Package, ShoppingBag, Users, Settings, LogOut, Megaphone } from "lucide-react";

export default function AdminLayout({ children }: { children: React.ReactNode }) {
    const pathname = usePathname();

    const links = [
        { href: "/admin", label: "Overview", icon: LayoutDashboard },
        { href: "/admin/products", label: "Products", icon: Package },
        { href: "/admin/categories", label: "Categories", icon: Package }, // Reusing Package icon for now
        { href: "/admin/orders", label: "Orders", icon: ShoppingBag },
        { href: "/admin/campaigns", label: "Campaigns", icon: Megaphone },
        { href: "/admin/customers", label: "Customers", icon: Users },
        { href: "/admin/settings", label: "Settings", icon: Settings },
    ];

    return (
        <div className="min-h-screen flex bg-gray-100">
            {/* Sidebar */}
            <aside className="w-64 bg-gray-900 text-white flex-shrink-0 hidden md:flex flex-col">
                <div className="p-6">
                    <h1 className="font-display text-xl font-bold tracking-wide">CASTLE ADMIN</h1>
                </div>

                <nav className="flex-grow px-4 space-y-2">
                    {links.map((link) => {
                        const Icon = link.icon;
                        const isActive = pathname === link.href || pathname.startsWith(link.href + '/');
                        return (
                            <Link
                                key={link.href}
                                href={link.href}
                                className={`flex items-center gap-3 px-4 py-3 rounded-lg transition-colors ${isActive ? 'bg-brand-blue text-white font-bold' : 'text-gray-400 hover:bg-gray-800 hover:text-white'}`}
                            >
                                <Icon size={20} />
                                {link.label}
                            </Link>
                        );
                    })}
                </nav>

                <div className="p-4 border-t border-gray-800">
                    <button className="w-full flex items-center gap-3 px-4 py-3 rounded-lg text-red-400 hover:bg-gray-800 transition-colors">
                        <LogOut size={20} />
                        Logout
                    </button>
                </div>
            </aside>

            {/* Content */}
            <main className="flex-grow overflow-y-auto h-screen">
                <header className="bg-white shadow-sm border-b border-gray-200 p-4 flex justify-between items-center md:hidden">
                    <h1 className="font-bold text-gray-800">Castle Admin</h1>
                    <button className="p-2 bg-gray-100 rounded">Menu</button>
                </header>
                <div className="p-8">
                    {children}
                </div>
            </main>
        </div>
    );
}
