"use client";

import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { Plus, Search, Trash2, Edit } from "lucide-react";
import Link from "next/link";

export default function AdminCategoriesPage() {
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        loadCategories();
    }, []);

    const loadCategories = async () => {
        setLoading(true);
        setError("");
        try {
            const data = await productService.getCategories();
            setCategories(data);
        } catch (error) {
            console.error("Failed to load categories", error);
            setError("Failed to load categories. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div>
            <div className="flex justify-between items-center mb-8">
                <div>
                    <h1 className="font-display text-2xl font-bold text-gray-800">Categories</h1>
                    <p className="text-gray-500">Manage your product categories</p>
                </div>
                <Link
                    href="/admin/categories/add"
                    className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold flex items-center gap-2 hover:bg-brand-gold hover:text-brand-blue transition-colors"
                >
                    <Plus size={20} /> Add Category
                </Link>
            </div>

            <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
                <div className="p-4 border-b border-gray-200 flex gap-4">
                    <div className="relative flex-grow max-w-md">
                        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
                        <input
                            type="text"
                            placeholder="Search categories..."
                            className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                        />
                    </div>
                </div>

                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-600 font-semibold text-sm">
                        <tr>
                            <th className="p-4">Image</th>
                            <th className="p-4">Name</th>
                            <th className="p-4">Slug</th>
                            <th className="p-4 text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {categories.map((cat) => (
                            <tr key={cat.id} className="hover:bg-gray-50 transition-colors">
                                <td className="p-4">
                                    <div className="w-12 h-12 bg-gray-100 rounded-lg overflow-hidden">
                                        {cat.image ? (
                                            <img src={cat.image} alt={cat.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                        )}
                                    </div>
                                </td>
                                <td className="p-4 font-medium text-gray-900">{cat.name}</td>
                                <td className="p-4 text-gray-500">{cat.slug}</td>
                                <td className="p-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <button className="p-2 text-blue-500 hover:bg-blue-50 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </button>
                                        <button className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {error && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-red-500 bg-red-50">
                                    <p>{error}</p>
                                    <button onClick={loadCategories} className="mt-2 text-sm underline font-bold">Retry</button>
                                </td>
                            </tr>
                        )}
                        {categories.length === 0 && !loading && !error && (
                            <tr>
                                <td colSpan={4} className="p-8 text-center text-gray-500">No categories found.</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
