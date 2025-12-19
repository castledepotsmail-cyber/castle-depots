"use client";

import { Search, Mail, Phone, MoreHorizontal, Loader2, ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useState } from "react";
import { adminService } from "@/services/adminService";

export default function AdminCustomersPage() {
    const [customers, setCustomers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);

    useEffect(() => {
        fetchCustomers(page);
    }, [page]);

    const fetchCustomers = async (pageNum: number) => {
        setLoading(true);
        try {
            const data = await adminService.getCustomers(pageNum);
            setCustomers(data.results || []);
            setTotalPages(Math.ceil((data.count || 0) / 10)); // Assuming page size 10
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

    if (loading && customers.length === 0) {
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
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                            <tr>
                                <th className="px-4 md:px-6 py-4 font-semibold">Customer</th>
                                <th className="hidden md:table-cell px-6 py-4 font-semibold">Contact</th>
                                <th className="px-4 md:px-6 py-4 font-semibold">Role</th>
                                <th className="hidden lg:table-cell px-6 py-4 font-semibold">Joined</th>
                                <th className="px-4 md:px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {filteredCustomers.length === 0 ? (
                                <tr>
                                    <td colSpan={5} className="px-6 py-8 text-center text-gray-500">
                                        No customers found.
                                    </td>
                                </tr>
                            ) : (
                                filteredCustomers.map((customer) => (
                                    <tr key={customer.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                {customer.profile_picture ? (
                                                    <img src={customer.profile_picture} alt="Profile" className="w-10 h-10 rounded-full object-cover" />
                                                ) : (
                                                    <div className="w-10 h-10 bg-brand-blue text-white rounded-full flex items-center justify-center font-bold flex-shrink-0">
                                                        {customer.first_name?.[0] || customer.username?.[0] || 'U'}
                                                    </div>
                                                )}
                                                <div>
                                                    <p className="font-bold text-gray-900 text-sm md:text-base">{customer.first_name} {customer.last_name}</p>
                                                    <p className="text-xs text-gray-500">@{customer.username}</p>
                                                </div>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 text-sm text-gray-600">
                                            <div className="flex items-center gap-2 mb-1">
                                                <Mail size={14} /> {customer.email}
                                            </div>
                                            {customer.phone_number && (
                                                <div className="flex items-center gap-2">
                                                    <Phone size={14} /> {customer.phone_number}
                                                </div>
                                            )}
                                        </td>
                                        <td className="px-4 md:px-6 py-4">
                                            {customer.is_superuser ? (
                                                <span className="bg-purple-100 text-purple-700 px-2 py-1 rounded text-[10px] md:text-xs font-bold">Super Admin</span>
                                            ) : customer.is_staff ? (
                                                <span className="bg-blue-100 text-blue-700 px-2 py-1 rounded text-[10px] md:text-xs font-bold">Staff</span>
                                            ) : (
                                                <span className="bg-gray-100 text-gray-700 px-2 py-1 rounded text-[10px] md:text-xs font-bold">Customer</span>
                                            )}
                                        </td>
                                        <td className="hidden lg:table-cell px-6 py-4 text-gray-500">{new Date(customer.date_joined || Date.now()).toLocaleDateString()}</td>
                                        <td className="px-4 md:px-6 py-4 text-right">
                                            <button className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                                <MoreHorizontal size={20} />
                                            </button>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination */}
                <div className="flex items-center justify-between px-6 py-4 border-t border-gray-100">
                    <button
                        onClick={() => setPage(p => Math.max(1, p - 1))}
                        disabled={page === 1}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        <ChevronLeft size={16} /> Previous
                    </button>
                    <span className="text-sm text-gray-600">
                        Page {page} of {totalPages}
                    </span>
                    <button
                        onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                        disabled={page === totalPages}
                        className="flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        Next <ChevronRight size={16} />
                    </button>
                </div>
            </div>
        </div>
    );
}
