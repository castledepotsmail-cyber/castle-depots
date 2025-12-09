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
    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("-created_at"); // Default: Newest first

    useEffect(() => {
        productService.getCategories().then(setCategories).catch(console.error);
    }, []);

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params: any = {
                    ordering: sortBy,
                };

                if (selectedCategory) params.category__slug = selectedCategory;
                if (minPrice) params.price__gte = minPrice;
                if (maxPrice) params.price__lte = maxPrice;

                const data = await productService.getProducts(params);
                const items = Array.isArray(data) ? data : (data.results || []);
                setProducts(items);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [selectedCategory, minPrice, maxPrice, sortBy]);

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
                        <div className="relative group">
                            <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-brand-blue transition-colors text-sm font-semibold text-gray-700">
                                Sort by: {sortBy === '-created_at' ? 'Newest' : sortBy === 'price' ? 'Price: Low to High' : 'Price: High to Low'} <ChevronDown size={16} />
                            </button>
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-xl border border-gray-100 py-2 hidden group-hover:block z-20">
                                <button onClick={() => setSortBy('-created_at')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Newest</button>
                                <button onClick={() => setSortBy('price')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Price: Low to High</button>
                                <button onClick={() => setSortBy('-price')} className="block w-full text-left px-4 py-2 hover:bg-gray-50 text-sm">Price: High to Low</button>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Layout: Sidebar + Grid */}
                <div className="flex flex-col lg:flex-row gap-8">
                    {/* Sidebar */}
                    <aside className="w-full lg:w-64 flex-shrink-0 space-y-8">
                        {/* Categories */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Categories</h3>
                            <ul className="space-y-2 text-sm text-gray-600">
                                <li className="flex items-center gap-2">
                                    <input
                                        type="radio"
                                        name="category"
                                        checked={selectedCategory === null}
                                        onChange={() => setSelectedCategory(null)}
                                        className="rounded-full border-gray-300 text-brand-blue focus:ring-brand-blue"
                                    />
                                    <span>All Categories</span>
                                </li>
                                {categories.map(cat => (
                                    <li key={cat.id} className="flex items-center gap-2">
                                        <input
                                            type="radio"
                                            name="category"
                                            checked={selectedCategory === cat.slug}
                                            onChange={() => setSelectedCategory(cat.slug)}
                                            className="rounded-full border-gray-300 text-brand-blue focus:ring-brand-blue"
                                        />
                                        <span>{cat.name}</span>
                                    </li>
                                ))}
                            </ul>
                        </div>

                        {/* Price Range */}
                        <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <h3 className="font-bold text-gray-800 mb-4">Price Range</h3>
                            <div className="flex items-center gap-2">
                                <input
                                    type="number"
                                    placeholder="Min"
                                    value={minPrice}
                                    onChange={(e) => setMinPrice(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-blue"
                                />
                                <span className="text-gray-400">-</span>
                                <input
                                    type="number"
                                    placeholder="Max"
                                    value={maxPrice}
                                    onChange={(e) => setMaxPrice(e.target.value)}
                                    className="w-full px-3 py-2 bg-gray-50 border border-gray-200 rounded-md text-sm focus:outline-none focus:border-brand-blue"
                                />
                            </div>
                        </div>
                    </aside>

                    {/* Product Grid */}
                    <div className="flex-grow">
                        {loading ? (
                            <div className="flex justify-center items-center h-64">
                                <Loader2 className="animate-spin text-brand-blue" size={48} />
                            </div>
                        ) : products.length === 0 ? (
                            <div className="text-center py-12 bg-white rounded-xl border border-gray-100">
                                <p className="text-gray-500">No products found matching your filters.</p>
                                <button
                                    onClick={() => {
                                        setSelectedCategory(null);
                                        setMinPrice("");
                                        setMaxPrice("");
                                    }}
                                    className="mt-4 text-brand-blue font-bold hover:underline"
                                >
                                    Clear Filters
                                </button>
                            </div>
                        ) : (
                            <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                                {products.map((product) => (
                                    <ProductCard key={product.id} product={product} />
                                ))}
                            </div>
                        )}
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
