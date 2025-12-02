"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { Filter, ChevronDown, Loader2 } from "lucide-react";
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { Product } from "@/store/cartStore";

export default function ShopPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const data = await productService.getProducts();
                // Assuming backend returns { results: [...] } or just [...]
                const items = Array.isArray(data) ? data : (data.results || []);

                if (items.length > 0) {
                    setProducts(items);
                } else {
                    // Fallback to mock data if empty (for demo)
                    throw new Error("No products found");
                }
            } catch (error) {
                console.error("Failed to fetch products", error);
                // Fallback to mock data for demo if API fails
                setProducts(Array.from({ length: 12 }).map((_, i) => ({
                    id: `prod-${i}`,
                    name: i % 2 === 0 ? "Premium Gold Chafing Dish 8L" : "Ladies High-Waist Mummy Jeans",
                    price: i % 2 === 0 ? 4500 : 1500,
                    discountPrice: i % 3 === 0 ? (i % 2 === 0 ? 3800 : 1200) : undefined,
                    image: i % 2 === 0
                        ? "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600" // Kitchenware
                        : "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?auto=format&fit=crop&q=80&w=600", // Jeans
                })));
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 flex-grow">
                {/* Header & Filters */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-gray-800">Shop All Products</h1>
                        <p className="text-gray-500 text-sm">Showing {products.length} results</p>
                    </div>

                    <div className="flex gap-4">
                        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-brand-blue transition-colors text-sm font-semibold text-gray-700">
                            <Filter size={16} /> Filter
                        </button>
                        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-brand-blue transition-colors text-sm font-semibold text-gray-700">
                            Sort by: Recommended <ChevronDown size={16} />
                        </button>
                    </div>
                </div>

                {/* Layout: Sidebar + Grid */}
                <div className="flex gap-8">
                    {/* Sidebar (Hidden on Mobile for now) */}
                    <aside className="hidden lg:block w-64 flex-shrink-0 space-y-8">
                        {/* Categories */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                {['Kitchenware', 'Ladies Fashion', 'Catering', 'Electronics', 'Home Decor'].map(cat => (
                                    <li key={cat} className="flex items-center gap-2">
                                        <input type="checkbox" className="rounded border-gray-300 text-brand-blue focus:ring-brand-blue" />
                                        <span>{cat}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range */}
                        <div>
                            <h3 className="font-bold text-gray-800 mb-4">Price Range</h3>
                            <div className="flex items-center gap-2">
                                <input type="number" placeholder="Min" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm" />
                                <span className="text-gray-400">-</span>
                                <input type="number" placeholder="Max" className="w-full px-3 py-2 bg-white border border-gray-200 rounded-md text-sm" />
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin text-brand-blue" size={48} />
                            </div>
                        ) : (
                            <>
                                <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                    {products.map((product) => (
                                        <ProductCard key={product.id} product={product} />
                                    ))}
                                </div>

                                {/* Pagination */}
                                <div className="mt-12 flex justify-center gap-2">
                                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-brand-blue hover:text-white transition-colors">1</button>
                                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-brand-blue hover:text-white transition-colors">2</button>
                                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-brand-blue hover:text-white transition-colors">3</button>
                                    <span className="px-4 py-2 text-gray-400">...</span>
                                    <button className="px-4 py-2 bg-white border border-gray-200 rounded-md text-gray-600 hover:bg-brand-blue hover:text-white transition-colors">Next</button>
                                </div>
                            </>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
