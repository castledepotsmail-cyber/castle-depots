"use client";

import Link from "next/link";
import { Facebook, Instagram, Twitter } from "lucide-react";
import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";

export default function Footer() {
    const [email, setEmail] = useState("");
    const [loading, setLoading] = useState(false);

    const handleSubscribe = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/communication/newsletter/subscribe/', { email });
            toast.success("Successfully subscribed to newsletter!");
            setEmail("");
        } catch (error) {
            toast.error("Failed to subscribe. Please try again.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };
    return (
        <footer className="bg-gray-900 text-white pt-12 pb-6 mt-12">
            <div className="container mx-auto px-4">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
                    {/* Brand */}
                    <div>
                        <div className="mb-4">
                            <img src="/logo.png" alt="Castle Depots" className="h-16 w-auto" />
                        </div>
                        <p className="text-gray-400 text-sm">
                            Your digital department store for hardware, trends, and catering essentials.
                            Quality you can trust, delivered to your door.
                        </p>
                    </div>

                    {/* Links */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-brand-gold">Shop</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/shop" className="hover:text-white">All Products</Link></li>
                            <li><Link href="/category/kitchenware" className="hover:text-white">Kitchenware</Link></li>
                            <li><Link href="/category/fashion" className="hover:text-white">Fashion</Link></li>
                            <li><Link href="/category/catering" className="hover:text-white">Catering Equipment</Link></li>
                        </ul>
                    </div>

                    {/* Support */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-brand-gold">Support</h3>
                        <ul className="space-y-2 text-gray-400 text-sm">
                            <li><Link href="/track-order" className="hover:text-white">Track Order</Link></li>
                            <li><Link href="/faq" className="hover:text-white">FAQs</Link></li>
                            <li><Link href="/contact" className="hover:text-white">Contact Us</Link></li>
                            <li><Link href="/returns" className="hover:text-white">Returns Policy</Link></li>
                        </ul>
                    </div>

                    {/* Newsletter */}
                    <div>
                        <h3 className="font-bold text-lg mb-4 text-brand-gold">Stay Updated</h3>
                        <p className="text-gray-400 text-sm mb-4">
                            Subscribe for flash sales and exclusive deals.
                        </p>
                        <form onSubmit={handleSubscribe} className="flex">
                            <input
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter your email"
                                className="bg-gray-800 text-white px-4 py-2 rounded-l-md w-full focus:outline-none border border-gray-700 focus:border-brand-gold"
                                required
                            />
                            <button
                                type="submit"
                                disabled={loading}
                                className="bg-brand-gold text-brand-blue px-4 py-2 rounded-r-md font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50"
                            >
                                {loading ? '...' : 'Join'}
                            </button>
                        </form>
                        <div className="flex gap-4 mt-6 text-gray-400">
                            <Facebook className="hover:text-brand-gold cursor-pointer" size={20} />
                            <Instagram className="hover:text-brand-gold cursor-pointer" size={20} />
                            <Twitter className="hover:text-brand-gold cursor-pointer" size={20} />
                        </div>
                    </div>
                </div>

                <div className="border-t border-gray-800 pt-6 text-center text-gray-500 text-xs">
                    &copy; {new Date().getFullYear()} Castle Depots. All rights reserved.
                </div>
            </div>
        </footer>
    );
}
