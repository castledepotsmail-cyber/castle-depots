"use client";

import Link from "next/link";
import { Plus, Search, Edit, Trash2, ChevronLeft, ChevronRight } from "lucide-react";
import CastleLoader from "@/components/ui/CastleLoader";
import { useEffect, useState, useCallback } from "react";
import { productService, Product } from "@/services/productService";
import Image from "next/image";
import debounce from "lodash/debounce";

export default function AdminProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState("");
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const pageSize = 10;

    // Debounced search function
    const debouncedSearch = useCallback(
        debounce((term: string) => {
            setPage(1); // Reset to page 1 on search
            fetchProducts(1, term);
        }, 500),
        []
    );

    useEffect(() => {
        fetchProducts(page, searchTerm);
    }, [page]); // Only re-fetch on page change. Search is handled by debounce.

    const fetchProducts = async (currentPage: number, search: string) => {
        setLoading(true);
        try {
            const data = await productService.getProductsPaginated(currentPage, search, pageSize);
            setProducts(data.results);
            setTotalPages(Math.ceil(data.count / pageSize));
        } catch (error) {
            console.error("Failed to fetch products", error);
        } finally {
            setLoading(false);
        }
    };

    const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const term = e.target.value;
        setSearchTerm(term);
        debouncedSearch(term);
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this product?")) {
            try {
                const { default: api } = await import('@/lib/api');
                await api.delete(`/products/${id}/`);
                // Refresh current page
                fetchProducts(page, searchTerm);
            } catch (error) {
                console.error("Failed to delete product", error);
                alert("Failed to delete product");
            }
        }
    };

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
                        onChange={handleSearchChange}
                        className="w-full pl-10 pr-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                    />
                </div>
            </div>

            {/* Product Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="overflow-x-auto">
                    <table className="w-full text-left">
                        <thead className="bg-gray-50 text-gray-500 text-sm uppercase">
                            <tr>
                                <th className="px-4 md:px-6 py-4 font-semibold">Product</th>
                                <th className="hidden md:table-cell px-6 py-4 font-semibold">Category</th>
                                <th className="px-4 md:px-6 py-4 font-semibold">Price</th>
                                <th className="hidden sm:table-cell px-6 py-4 font-semibold">Stock</th>
                                <th className="px-4 md:px-6 py-4 font-semibold">Status</th>
                                <th className="px-4 md:px-6 py-4 font-semibold text-right">Actions</th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-gray-100">
                            {loading ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 flex justify-center">
                                        <CastleLoader size="md" text="Loading Products..." />
                                    </td>
                                </tr>
                            ) : products.length === 0 ? (
                                <tr>
                                    <td colSpan={6} className="px-6 py-12 text-center text-gray-500">
                                        No products found.
                                    </td>
                                </tr>
                            ) : (
                                products.map((product) => (
                                    <tr key={product.id} className="hover:bg-gray-50 transition-colors">
                                        <td className="px-4 md:px-6 py-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                                                    {product.image_main ? (
                                                        <Image src={product.image_main} alt={product.name} fill className="object-cover" sizes="40px" />
                                                    ) : (
                                                        <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                                    )}
                                                </div>
                                                <span className="font-bold text-gray-900 line-clamp-1 max-w-[120px] sm:max-w-xs">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="hidden md:table-cell px-6 py-4 text-gray-600">{product.category_name || '-'}</td>
                                        <td className="px-4 md:px-6 py-4 font-bold text-gray-900 text-sm md:text-base">KES {parseFloat(product.price).toLocaleString()}</td>
                                        <td className="hidden sm:table-cell px-6 py-4 text-gray-600">{product.stock_quantity}</td>
                                        <td className="px-4 md:px-6 py-4">
                                            <span className={`px-2 md:px-3 py-1 rounded-full text-[10px] md:text-xs font-bold ${product.stock_quantity > 0 ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>
                                                {product.stock_quantity > 0 ? 'Active' : 'Out'}
                                            </span>
                                        </td>
                                        <td className="px-4 md:px-6 py-4 text-right">
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
                                ))
                            )}
                        </tbody>
                    </table>
                </div>

                {/* Pagination Controls */}
                {!loading && totalPages > 1 && (
                    <div className="flex justify-between items-center px-6 py-4 border-t border-gray-100 bg-gray-50">
                        <button
                            onClick={() => setPage(Math.max(1, page - 1))}
                            disabled={page === 1}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                            <ChevronLeft size={16} /> Previous
                        </button>
                        <span className="text-sm text-gray-600 font-medium">
                            Page {page} of {totalPages}
                        </span>
                        <button
                            onClick={() => setPage(Math.min(totalPages, page + 1))}
                            disabled={page === totalPages}
                            className="flex items-center gap-1 px-3 py-2 rounded-lg bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed text-sm font-medium"
                        >
                            Next <ChevronRight size={16} />
                        </button>
                    </div>
                )}
            </div>
        </div>
    );
}
