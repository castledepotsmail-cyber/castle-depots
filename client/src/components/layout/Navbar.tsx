"use client";

import Link from "next/link";
import { useState, useEffect, useRef } from "react";
import { Search, ShoppingCart, Menu, X, User, ChevronDown, LogOut, Store, LayoutDashboard } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useAuthStore } from "@/store/authStore";
import { authService } from "@/services/authService";
import Notifications from "../common/Notifications";

export default function Navbar() {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const [isDropdownOpen, setIsDropdownOpen] = useState(false);
    const totalItems = useCartStore((state) => state.totalItems());
    const { user, isAuthenticated } = useAuthStore();

    const dropdownRef = useRef<HTMLDivElement>(null);

    const handleLogout = () => {
        authService.logout();
        window.location.href = '/';
    };

    useEffect(() => {
        const handleClickOutside = (event: MouseEvent) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
                setIsDropdownOpen(false);
            }
        };

        document.addEventListener('mousedown', handleClickOutside);
        return () => document.removeEventListener('mousedown', handleClickOutside);
    }, []);

    return (
        <nav className="bg-brand-blue shadow-lg sticky top-0 z-50">
            <div className="container mx-auto px-4">
                <div className="flex justify-between items-center h-20">
                    {/* Logo Area with Round Bump */}
                    <div className="relative z-10">
                        <div className="absolute top-1/2 -translate-y-1/2 left-0 w-32 h-32 bg-brand-blue rounded-full flex items-center justify-center shadow-lg -ml-4 mt-4">
                            <Link href="/" className="relative w-[120px] h-[120px] rounded-full overflow-hidden border-4 border-white/20">
                                <img src="/logo.png" alt="Castle Depots" className="w-full h-full object-cover" />
                            </Link>
                        </div>
                        {/* Spacer to push content */}
                        <div className="w-28"></div>
                    </div>

                    {/* Desktop Search */}
                    <div className="hidden md:flex flex-1 max-w-xl mx-8 relative">
                        <input
                            type="text"
                            placeholder="Search for products..."
                            className="w-full pl-4 pr-12 py-2.5 bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-full focus:outline-none focus:bg-white/20 focus:border-white/40 focus:ring-1 focus:ring-white/40 transition-all"
                        />
                        <button className="absolute right-3 top-1/2 -translate-y-1/2 text-white/60 hover:text-white">
                            <Search size={20} />
                        </button>
                    </div>

                    {/* Desktop Actions */}
                    <div className="hidden md:flex items-center gap-6">
                        <Notifications />

                        <Link href="/shop" className="p-2 text-white/90 hover:text-white transition-colors" title="Shop">
                            <Store size={24} />
                        </Link>

                        <Link href="/cart" className="relative p-2 text-white/90 hover:text-white transition-colors">
                            <ShoppingCart size={24} />
                            <CartCount count={totalItems} />
                        </Link>

                        {isAuthenticated && user ? (
                            <div ref={dropdownRef} className="relative pl-4 border-l border-white/20">
                                <button
                                    onClick={() => setIsDropdownOpen(!isDropdownOpen)}
                                    className="flex items-center gap-2 hover:bg-white/10 p-2 rounded-lg transition-colors"
                                >
                                    {user.profile_picture ? (
                                        <img src={user.profile_picture} alt="Profile" className="w-8 h-8 rounded-full border border-white/20" />
                                    ) : (
                                        <div className="w-8 h-8 bg-white text-brand-blue rounded-full flex items-center justify-center font-bold text-sm">
                                            {user.first_name?.[0]}{user.last_name?.[0]}
                                        </div>
                                    )}
                                    <div className="text-sm text-left">
                                        <p className="font-bold text-white leading-none">{user.first_name} {user.last_name}</p>
                                        <p className="text-xs text-white/70">My Account</p>
                                    </div>
                                    <ChevronDown size={16} className={`text-white/70 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`} />
                                </button>

                                {isDropdownOpen && (
                                    <div className="absolute right-0 top-full mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 z-50">
                                        {(user.is_staff || user.is_superuser) && (
                                            <Link href="/admin" className="flex items-center gap-3 px-4 py-2 text-brand-blue font-bold hover:bg-blue-50">
                                                <LayoutDashboard size={16} /> Admin Panel
                                            </Link>
                                        )}
                                        <Link href="/dashboard" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                            <User size={16} /> Dashboard
                                        </Link>
                                        <Link href="/dashboard/profile" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                            <User size={16} /> Profile
                                        </Link>
                                        <Link href="/dashboard/orders" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                            <ShoppingCart size={16} /> Orders
                                        </Link>
                                        <Link href="/dashboard/wishlist" className="flex items-center gap-3 px-4 py-2 text-gray-700 hover:bg-gray-50">
                                            <User size={16} /> Wishlist
                                        </Link>
                                        <hr className="my-2" />
                                        <button onClick={handleLogout} className="flex items-center gap-3 px-4 py-2 text-red-500 hover:bg-red-50 w-full text-left">
                                            <LogOut size={16} /> Logout
                                        </button>
                                    </div>
                                )}
                            </div>
                        ) : (
                            <div className="flex items-center gap-4 pl-4 border-l border-white/20">
                                <Link href="/auth/login" className="font-bold text-white hover:text-white/80">Sign In</Link>
                                <Link href="/auth/register" className="bg-white text-brand-blue px-5 py-2 rounded-full font-bold hover:bg-gray-100 transition-colors">Register</Link>
                            </div>
                        )}
                    </div>

                    {/* Mobile Menu Button */}
                    <button
                        className="md:hidden p-2 text-white"
                        onClick={() => setIsMenuOpen(!isMenuOpen)}
                    >
                        {isMenuOpen ? <X size={24} /> : <Menu size={24} />}
                    </button>
                </div>
            </div>

            {/* Mobile Menu */}
            {
                isMenuOpen && (
                    <div className="md:hidden bg-white border-t border-gray-100 p-4 space-y-4 shadow-lg absolute w-full left-0 text-gray-800">
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search..."
                                className="w-full pl-4 pr-10 py-3 bg-gray-50 border border-gray-200 rounded-xl"
                            />
                            <Search className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        </div>

                        <nav className="space-y-2">
                            <Link href="/shop" className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700">Shop All</Link>
                            {isAuthenticated && user && (
                                <>
                                    {(user.is_staff || user.is_superuser) && (
                                        <Link href="/admin" className="block px-4 py-3 rounded-lg hover:bg-blue-50 font-bold text-brand-blue">Admin Panel</Link>
                                    )}
                                    <Link href="/dashboard" className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700">Dashboard</Link>
                                    <Link href="/dashboard/orders" className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700">My Orders</Link>
                                    <Link href="/dashboard/wishlist" className="block px-4 py-3 rounded-lg hover:bg-gray-50 font-semibold text-gray-700">Wishlist</Link>
                                </>
                            )}
                        </nav>

                        <div className="pt-4 border-t border-gray-100 flex flex-col gap-3">
                            {isAuthenticated && user ? (
                                <>
                                    <div className="flex items-center gap-3 px-4 py-2">
                                        {user.profile_picture ? (
                                            <img src={user.profile_picture} alt="Profile" className="w-10 h-10 rounded-full" />
                                        ) : (
                                            <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                                                {user.first_name?.[0]}{user.last_name?.[0]}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-gray-800">{user.first_name} {user.last_name}</p>
                                            <p className="text-sm text-gray-500">{user.email}</p>
                                        </div>
                                    </div>
                                    <button onClick={handleLogout} className="flex items-center gap-2 text-red-500 font-bold px-4">
                                        <LogOut size={20} /> Logout
                                    </button>
                                </>
                            ) : (
                                <>
                                    <Link href="/auth/login" className="block w-full text-center py-3 font-bold text-gray-600 border border-gray-200 rounded-xl">Sign In</Link>
                                    <Link href="/auth/register" className="block w-full text-center py-3 font-bold text-white bg-brand-blue rounded-xl">Create Account</Link>
                                </>
                            )}
                        </div>
                    </div>
                )
            }
        </nav >
    );
}

function CartCount({ count }: { count: number }) {
    if (count === 0) return null;
    return (
        <span className="absolute -top-1 -right-1 bg-red-500 text-white text-[10px] font-bold w-5 h-5 flex items-center justify-center rounded-full border-2 border-white">
            {count}
        </span>
    );
}
