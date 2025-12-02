import { DollarSign, ShoppingBag, Users, TrendingUp } from "lucide-react";

export default function AdminDashboard() {
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
                        <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                            <TrendingUp size={16} /> +12%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">KES 450k</h3>
                    <p className="text-sm text-gray-500">Total Revenue</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-blue-100 text-brand-blue p-3 rounded-full">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                            <TrendingUp size={16} /> +5%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">1,240</h3>
                    <p className="text-sm text-gray-500">Total Orders</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-purple-100 text-purple-600 p-3 rounded-full">
                            <Users size={24} />
                        </div>
                        <span className="text-green-600 text-sm font-bold flex items-center gap-1">
                            <TrendingUp size={16} /> +18%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">850</h3>
                    <p className="text-sm text-gray-500">Active Customers</p>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <div className="flex items-center justify-between mb-4">
                        <div className="bg-yellow-100 text-yellow-600 p-3 rounded-full">
                            <ShoppingBag size={24} />
                        </div>
                        <span className="text-red-500 text-sm font-bold flex items-center gap-1">
                            -2%
                        </span>
                    </div>
                    <h3 className="text-3xl font-bold text-gray-900">12</h3>
                    <p className="text-sm text-gray-500">Low Stock Items</p>
                </div>
            </div>

            {/* Recent Activity Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6 border-b border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800">Recent Orders</h2>
                </div>
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
                        {[1, 2, 3, 4, 5].map((i) => (
                            <tr key={i} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4 font-bold text-gray-900">#CD-882{i}</td>
                                <td className="px-6 py-4 text-gray-600">John Doe</td>
                                <td className="px-6 py-4 text-gray-500">Nov 29, 2025</td>
                                <td className="px-6 py-4 font-bold text-gray-900">KES 12,500</td>
                                <td className="px-6 py-4">
                                    <span className="bg-green-100 text-green-700 px-3 py-1 rounded-full text-xs font-bold">
                                        Paid
                                    </span>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
