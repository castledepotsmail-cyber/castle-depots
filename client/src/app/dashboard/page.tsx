"use client";

import Link from "next/link";
import { Package, Clock, CheckCircle } from "lucide-react";
import { useAuthStore } from "@/store/authStore";
import { useEffect, useState } from "react";
import { authService } from "@/services/authService";
import { orderService } from "@/services/orderService";

export default function DashboardPage() {
    const { user, isAuthenticated } = useAuthStore();
    const [orders, setOrders] = useState<any[]>([]);
    const [stats, setStats] = useState({ total: 0, pending: 0, completed: 0 });
    
    useEffect(() => {
        if (!user && isAuthenticated) {
            authService.getCurrentUser();
        }
    }, [user, isAuthenticated]);
    
    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const orderData = await orderService.getOrders();
                setOrders(orderData.slice(0, 3)); // Recent 3 orders
                
                // Calculate stats
                const total = orderData.length;
                const pending = orderData.filter((o: any) => ['placed', 'processing', 'shipped'].includes(o.status)).length;
                const completed = orderData.filter((o: any) => o.status === 'delivered').length;
                setStats({ total, pending, completed });
            } catch (error) {
                console.error('Failed to fetch orders', error);
            }
        };
        
        if (isAuthenticated) {
            fetchOrders();
        }
    }, [isAuthenticated]);
    
    if (!isAuthenticated) {
        return (
            <div className="text-center py-12">
                <p className="text-gray-500">Please log in to view your dashboard.</p>
            </div>
        );
    }
    return (
        <div className="space-y-6">
            <div>
                <h1 className="font-display text-2xl font-bold text-gray-800">
                    Welcome back, {user?.first_name || 'User'}!
                </h1>
                <p className="text-gray-500 mt-1">Here's what's happening with your orders</p>
            </div>

            {/* Stats */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-blue-100 text-brand-blue p-3 rounded-full">
                        <Package size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.total}</h3>
                        <p className="text-sm text-gray-500">Total Orders</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                        <Clock size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.pending}</h3>
                        <p className="text-sm text-gray-500">Pending Delivery</p>
                    </div>
                </div>
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4">
                    <div className="bg-green-100 text-green-600 p-3 rounded-full">
                        <CheckCircle size={24} />
                    </div>
                    <div>
                        <h3 className="text-2xl font-bold text-gray-900">{stats.completed}</h3>
                        <p className="text-sm text-gray-500">Completed</p>
                    </div>
                </div>
            </div>

            {/* Recent Orders */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                    <h2 className="font-bold text-lg text-gray-800">Recent Orders</h2>
                    <Link href="/dashboard/orders" className="text-brand-blue text-sm font-semibold hover:underline">View All</Link>
                </div>
                <div className="divide-y divide-gray-100">
                    {orders.length === 0 ? (
                        <div className="p-6 text-center text-gray-500">
                            No orders yet. <Link href="/shop" className="text-brand-blue hover:underline">Start shopping!</Link>
                        </div>
                    ) : (
                        orders.map((order) => (
                            <div key={order.id} className="p-6 flex flex-col md:flex-row justify-between items-center gap-4">
                                <div className="flex items-center gap-4">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex items-center justify-center text-xs text-gray-400">Order</div>
                                    <div>
                                        <h4 className="font-bold text-gray-800">Order #{order.id}</h4>
                                        <p className="text-sm text-gray-500">{order.items?.length || 0} items • KES {parseFloat(order.total_amount).toLocaleString()}</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${
                                        order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                        order.status === 'processing' || order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                                        order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                        'bg-blue-100 text-blue-700'
                                    }`}>
                                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                                    </span>
                                    <Link href={`/dashboard/orders/${order.id}`} className="text-brand-blue font-semibold text-sm hover:underline">View Order</Link>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>
        </div>
    );
}
