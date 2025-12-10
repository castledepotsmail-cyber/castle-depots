"use client";

import { Search, Mail, Phone, MoreHorizontal, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchCustomers();
    }, []);

    const fetchCustomers = async () => {
        try {
            const data = await adminService.getCustomers();
            setCustomers(data.results || data);
        } catch (error) {
            console.error("Failed to fetch customers", error);
        } finally {
            setLoading(false);
        }
    };

    const filteredCustomers = customers.filter(customer =>
        (customer.username && customer.username.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.email && customer.email.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.first_name && customer.first_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (customer.last_name && customer.last_name.toLowerCase().includes(searchTerm.toLowerCase()))
    );

    if (loading) {
        return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-brand-blue" /></div>;
    }

    return (
        <div className="space-y-6">
            <h1 className="text-2xl font-bold text-gray-800">Customers</h1>

            {/* Search */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="relative text-gray-500">
                    <Search className="absolute top-3 left-3" size={20} />
                    <input
                        type="text"
                        placeholder="Search customers by name, email..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                    />
                </div>
            </div>

            {/* Customers Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Customer</th>
                            <th className="px-6 py-4 font-semibold">Contact</th>
                            <th className="px-6 py-4 font-semibold">Role</th>
                            <th className="px-6 py-4 font-semibold">Joined</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredCustomers.map((customer) => (
                            <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        {customer.profile_picture ? (
                                            <img src={customer.profile_picture} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                        ) : (
                                            <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold">
                                                {customer.first_name?.[0] || customer.username?.[0] || 'U'}
                                            </div>
                                        )}
                                        <div>
                                            <p className="font-bold text-gray-900">{customer.first_name} {customer.last_name}</p>
                                            <p className="text-xs text-gray-500">@{customer.username}</p>
                                        </div>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-sm text-gray-600">
                                    <div className="flex items-center gap-2 mb-1">
                                        <Mail size={14} /> {customer.email}
                                    </div>
                                    {customer.phone_number && (
                                        <div className="flex items-center gap-2">
                                            <Phone size={14} /> {customer.phone_number}
                                        </div>
                                    )}
                                </td>
                                <td className="px-6 py-4">
                                    {customer.is_superuser ? (
                                        <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-xs font-bold">Super Admin</span>
                                    ) : customer.is_staff ? (
                                        <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-xs font-bold">Staff</span>
                                    ) : (
                                        <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-xs font-bold">Customer</span>
                                    )}
                                </td>
                                <td className="px-6 py-4 text-gray-500">{new Date(customer.date_joined || Date.now()).toLocaleDateString()}</td>
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
