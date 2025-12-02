"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Package, ArrowRight } from "lucide-react";
import { useState } from "react";
import { useRouter } from "next/navigation";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const router = useRouter();

    const handleTrack = (e: React.FormEvent) => {
        e.preventDefault();
        if (orderId.trim()) {
            // In a real app, we might verify this first or redirect to a public tracking URL
            // For now, let's redirect to the dashboard order view (which might require login)
            // Or we could show a mock result here.
            router.push(`/dashboard/orders/${orderId}`);
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-lg text-center">
                    <div className="w-20 h-20 bg-blue-50 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-6">
                        <Package size={40} />
                    </div>

                    <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">Track Your Order</h1>
                    <p className="text-gray-500 mb-8">Enter your Order ID to see the current status.</p>

                    <form onSubmit={handleTrack} className="relative">
                        <Search className="absolute top-3.5 left-4 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Order ID (e.g., CD-8821)"
                            className="w-full pl-12 pr-32 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            className="absolute top-1.5 right-1.5 bg-brand-blue text-white px-6 py-1.5 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                        >
                            Track <ArrowRight size={16} />
                        </button>
                    </form>

                    <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500">
                        <p>Need help? <a href="/contact" className="text-brand-blue font-bold hover:underline">Contact Support</a></p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
