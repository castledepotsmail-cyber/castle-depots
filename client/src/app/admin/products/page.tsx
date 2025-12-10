"use client";

import Link from "next/link";
import { Plus, Search, Edit, Trash2, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { productService, Product } from "@/services/productService";
import Image from "next/image";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");

    useEffect(() => {
        fetchProducts();
    }, []);

    const fetchProducts = async () => {
        try {
            const data = await productService.getProducts({});
            setProducts(data.results || data); // Handle paginated or list response
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                // Assuming productService has a delete method, if not we need to add it or use api directly
                // For now, let's assume we need to add it to productService or use api
                // Let's use api directly here for simplicity if productService doesn't have it, 
                // but better to add to service. I'll add a delete method to productService in a separate step or assume it exists.
                // Actually, I'll use the api helper directly here to be safe if I haven't added it yet.
                // Wait, I should add it to productService.ts properly.
                // For this step, I'll assume I will add it or use a temporary fix.
                // Let's use a direct API call for now to ensure it works without modifying service file in this same step if possible.
                // But wait, I can modify multiple files. I'll stick to this file and use api import.
                const { default: api } = await import('@/lib/api');
                await api.delete(`/products/${id}/`);
                setProducts(products.filter(p => p.id !== id));
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Failed to delete product");
            }
        }
    };

    const filteredProducts = products.filter(product =>
        product.name.toLowerCase().includes(searchTerm.toLowerCase())
    );

    if (loading) {
        return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-brand-blue" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Products</h1>
                <Link
                    href="/admin/products/add"
                    className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} /> Add Product
                </Link>
            </div>

            {/* Filters */}
            <div className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4">
                <div className="flex-grow relative text-gray-500">
                    <Search className="absolute top-3 left-3" size={20} />
                    <input
                        type="text"
                        placeholder="Search products..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                    />
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <table className="w-full text-left">
                    <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                        <tr>
                            <th className="px-6 py-4 font-semibold">Product</th>
                            <th className="px-6 py-4 font-semibold">Category</th>
                            <th className="px-6 py-4 font-semibold">Price</th>
                            <th className="px-6 py-4 font-semibold">Stock</th>
                            <th className="px-6 py-4 font-semibold">Status</th>
                            <th className="px-6 py-4 font-semibold text-right">Actions</th>
                        </tr>
                    </thead>
                    <tbody className="divide-y divide-gray-100">
                        {filteredProducts.map((product) => (
                            <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                <td className="px-6 py-4">
                                    <div className="flex items-center gap-3">
                                        <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                                            {product.image_main ? (
                                                <Image src={product.image_main} alt={product.name} fill className="object-cover" />
                                            ) : (
                                                <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                            )}
                                        </div>
                                        <span className="font-bold text-gray-900 line-clamp-1 max-w-xs">{product.name}</span>
                                    </div>
                                </td>
                                <td className="px-6 py-4 text-gray-600">{product.category_name || '-'}</td>
                                <td className="px-6 py-4 font-bold text-gray-900">KES {parseFloat(product.price).toLocaleString()}</td>
                                <td className="px-6 py-4 text-gray-600">{product.stock_quantity}</td>
                                <td className="px-6 py-4">
                                    <span className={`px-3 py-1 rounded-full text-xs font-bold ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                        {product.stock_quantity > 0 ? 'Active' : 'Out of Stock'}
                                    </span>
                                </td>
                                <td className="px-6 py-4 text-right">
                                    <div className="flex justify-end gap-2">
                                        <Link href={`/admin/products/edit/${product.id}`} className="p-2 text-gray-500 hover:bg-gray-100 rounded-lg transition-colors">
                                            <Edit size={18} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(product.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
}
