"use client";

import { Search, Mail, Phone, MoreHorizontal } from "lucide-react";

export default function AdminCustomersPage() {
    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative text-gray-500">
                    <Search className="absolute top-3 left-3" size={20} />
                    <input type="text" placeholder="Search customers by name, email or phone..." className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Customer</th>
                            <th className="px-6 py-4 font-semibold">Contact</th>
                            <th className="px-6 py-4 font-semibold">Orders</th>
                            <th className="px-6 py-4 font-semibold">Total Spent</th>
                            <th className="px-6 py-4 font-semibold">Joined</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">JD</div>
                                        <div>
                                            <p className="font-bold text-gray-900">John Doe</p>
                                            <p className="text-xs text-gray-500">ID: #CUST-{i}23</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Mail size={14} /> john@example.com
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <Phone size={14} /> +254 712 345 678
                                    </div>
                                </td>
                                <td className="px-6 py-4 font-bold text-gray-900">12</td>
                                <td className="px-6 py-4 font-bold text-green-600">KES 145,000</td>
                                <td className="px-6 py-4 text-gray-500">Nov 20, 2025</td>
                                <td className="px-6 py-4 text-right">
                                    <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                        <MoreHorizontal size={20} />
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
