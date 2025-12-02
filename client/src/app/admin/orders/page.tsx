"use client";

import { Search, Filter, Eye, MoreVertical } from "lucide-react";

export default function AdminOrdersPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Order Management</h1>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="flex-grow relative text-gray-500">
                    <Search className="absolute top-3 left-3" size={20} />
                    <input type="text" placeholder="Search orders..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                </div>
                <select className="px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue text-gray-700">
                    <option>Status: All</option>
                    <option>Processing</option>
                    <option>Shipped</option>
                    <option>Delivered</option>
                </select>
                <button className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2">
                    <Filter size={18} /> More Filters
                </button>
            </div>

            {/* Orders Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Order ID</th>
                            <th className="px-6 py-4 font-semibold">Customer</th>
                            <th className="px-6 py-4 font-semibold">Date</th>
                            <th className="px-6 py-4 font-semibold">Total</th>
                            <th className="px-6 py-4 font-semibold">Payment</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">#CD-882{i}</td>
                                <td className="px-6 py-4">
                                    <p className="font-bold text-gray-800">John Doe</p>
                                    <p className="text-xs text-gray-500">john@example.com</p>
                                </td>
                                <td className="px-6 py-4 text-gray-500">Nov 29, 2025</td>
                                <td className="px-6 py-4 font-bold text-gray-900">KES 12,500</td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-100 text-green-700 px-2 py-1 rounded text-xs font-bold">Paid</span>
                                </td>
                                <td className="px-6 py-4">
                                    <select className="bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm focus:outline-none focus:border-brand-blue">
                                        <option>Processing</option>
                                        <option>Shipped</option>
                                        <option>Delivered</option>
                                        <option>Cancelled</option>
                                    </select>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                        <Eye size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
