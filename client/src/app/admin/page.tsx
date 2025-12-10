"use client";

import { DollarSign, ShoppingBag, Users, TrendingUp, Package } from "lucide-react";
import { useEffect, useState } from "react";
import { adminService, AdminStats } from "@/services/adminService";

export default function AdminDashboard() {
    const [stats, setStats] = useState<AdminStats | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchStats = async () => {
            try {
                const data = await adminService.getStats();
                setStats(data);
            } catch (error) {
                console.error("Failed to fetch admin stats", error);
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) {
        return <div className="p-12 text-center">Loading dashboard...</div>;
    }

    if (!stats) {
        return <div className="p-12 text-center">Failed to load stats.</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="text-2xl font-bold text-gray-800">Dashboard Overview</h1>

            {/* Stats Cards */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-green-100 text-green-600 p-3 rounded-full">
                            <DollarSign size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">KES {stats.total_revenue.toLocaleString()}</h3>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 text-brand-blue p-3 rounded-full">
                            <ShoppingBag size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.total_orders}</h3>
                    <p className="text-sm text-gray-500">Total Orders</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                            <Users size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.total_customers}</h3>
                    <p className="text-sm text-gray-500">Total Customers</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                            <Package size={24} />
                        </div>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">{stats.total_products}</h3>
                    <p className="text-sm text-gray-500">Total Products</p>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800">Recent Orders</h2>
                </div>
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                            <tr>
                                <th className="px-6 py-4 font-semibold">Order ID</th>
                                <th className="px-6 py-4 font-semibold">Customer</th>
                                <th className="px-6 py-4 font-semibold">Date</th>
                                <th className="px-6 py-4 font-semibold">Amount</th>
                                <th className="px-6 py-4 font-semibold">Status</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {stats.recent_orders.map((order: any) => (
                                <tr key={order.id} className="hover:bg-gray-50 transition-colors">
                                    <td className="px-6 py-4 font-bold text-gray-900">#{order.id.slice(0, 8)}</td>
                                    <td className="px-6 py-4 text-gray-600">{order.user || 'Guest'}</td>
                                    <td className="px-6 py-4 text-gray-500">{new Date(order.created_at).toLocaleDateString()}</td>
                                    <td className="px-6 py-4 font-bold text-gray-900">KES {parseFloat(order.total_amount).toLocaleString()}</td>
                                    <td className="px-6 py-4">
                                        <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'processing' || order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                            }`}>
                                            {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
