"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Search, Package, ArrowRight, Loader2, CheckCircle, XCircle } from "lucide-react";
import { useState } from "react";
import api from "@/lib/api";

export default function TrackOrderPage() {
    const [orderId, setOrderId] = useState("");
    const [loading, setLoading] = useState(false);
    const [orderStatus, setOrderStatus] = useState<any>(null);
    const [error, setError] = useState("");

    const handleTrack = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!orderId.trim()) return;

        setLoading(true);
        setError("");
        setOrderStatus(null);

        try {
            const response = await api.get(`/orders/track/${orderId}/`);
            setOrderStatus(response.data);
        } catch (err) {
            console.error("Tracking failed", err);
            setError("Order not found. Please check the ID and try again.");
        } finally {
            setLoading(false);
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

                    <form onSubmit={handleTrack} className="relative mb-6">
                        <Search className="absolute top-3.5 left-4 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Order ID (UUID)"
                            className="w-full pl-12 pr-32 py-3 bg-gray-50 border border-gray-200 rounded-full focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                            value={orderId}
                            onChange={(e) => setOrderId(e.target.value)}
                            required
                        />
                        <button
                            type="submit"
                            disabled={loading}
                            className="absolute top-1.5 right-1.5 bg-brand-blue text-white px-6 py-1.5 rounded-full font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-70"
                        >
                            {loading ? <Loader2 className="animate-spin" size={16} /> : <>Track <ArrowRight size={16} /></>}
                        </button>
                    </form>

                    {error && (
                        <div className="bg-red-50 text-red-600 p-4 rounded-xl flex items-center gap-3 text-left">
                            <XCircle size={20} className="shrink-0" />
                            <p className="text-sm font-medium">{error}</p>
                        </div>
                    )}

                    {orderStatus && (
                        <div className="bg-green-50 text-green-800 p-6 rounded-xl text-left space-y-3 border border-green-100">
                            <div className="flex items-center gap-3 mb-2">
                                <CheckCircle size={24} className="text-green-600" />
                                <h3 className="font-bold text-lg">Order Found!</h3>
                            </div>
                            <div className="grid grid-cols-2 gap-4 text-sm">
                                <div>
                                    <p className="text-green-600/70 uppercase text-xs font-bold">Status</p>
                                    <p className="font-bold capitalize">{orderStatus.status.replace('_', ' ')}</p>
                                </div>
                                <div>
                                    <p className="text-green-600/70 uppercase text-xs font-bold">Date</p>
                                    <p className="font-bold">{new Date(orderStatus.created_at).toLocaleDateString()}</p>
                                </div>
                                <div>
                                    <p className="text-green-600/70 uppercase text-xs font-bold">Total</p>
                                    <p className="font-bold">KES {orderStatus.total_amount.toLocaleString()}</p>
                                </div>
                                <div>
                                    <p className="text-green-600/70 uppercase text-xs font-bold">Items</p>
                                    <p className="font-bold">{orderStatus.items?.length || 0}</p>
                                </div>
                            </div>
                        </div>
                    )}

                    <div className="mt-8 pt-8 border-t border-gray-100 text-sm text-gray-500">
                        <p>Need help? <a href="/contact" className="text-brand-blue font-bold hover:underline">Contact Support</a></p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
