"use client";

import { Package, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getOrders();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    if (loading) {
        return <div className="text-center py-8">Loading orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <Package className="mx-auto text-gray-400 mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-600 mb-2">No orders yet</h2>
                <p className="text-gray-500">Start shopping to see your orders here!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-bold text-gray-800">My Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => (
                    <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 hover:shadow-md transition-shadow cursor-pointer group">
                        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                            <div className="flex items-center gap-4">
                                <div className="bg-blue-50 text-brand-blue p-3 rounded-full">
                                    <Package size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-900">Order #{order.id}</h3>
                                    <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                </div>
                            </div>

                            <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
                                <div className="text-right">
                                    <p className="font-bold text-gray-900">KES {parseFloat(order.total_amount).toLocaleString()}</p>
                                    <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                                </div>

                                <div className="flex items-center justify-between w-full md:w-auto gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                            order.status === 'processing' || order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                'bg-blue-100 text-blue-700'
                                        }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                    <ChevronRight className="text-gray-400 group-hover:text-brand-blue transition-colors" />
                                </div>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
}
