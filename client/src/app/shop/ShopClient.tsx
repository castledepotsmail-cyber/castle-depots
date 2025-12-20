"use client";

import ProductCard from "@/components/product/ProductCard";
import { ChevronDown, Loader2 } from "lucide-react";
import { useState, useEffect } from "react";
import { productService } from "@/services/productService";
import { Product } from "@/store/cartStore";
import { useRouter, useSearchParams } from "next/navigation";

interface ShopClientProps {
    initialProducts: Product[];
    initialCategories: any[];
}

export default function ShopClient({ initialProducts, initialCategories }: ShopClientProps) {
    const searchParams = useSearchParams();
    const router = useRouter();
    const searchQuery = searchParams.get('search') || '';

    const [products, setProducts] = useState<Product[]>(initialProducts);
    const [categories, setCategories] = useState<any[]>(initialCategories);
    const [loading, setLoading] = useState(false);

    // Filter States
    const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
    const [minPrice, setMinPrice] = useState("");
    const [maxPrice, setMaxPrice] = useState("");
    const [sortBy, setSortBy] = useState("-created_at");

    // We only fetch client-side if filters change. 
    // Initial load is handled by server.
    // However, if URL params change (like search), we might need to refetch.

    useEffect(() => {
        // Skip first render if we have initial data and no active filters that differ
        // But simpler: just fetch when dependencies change.
        // To avoid double fetch on mount, we can use a ref or just accept it.
        // Actually, if we pass initial data matching the default state, we can skip.

        // Let's just fetch when user INTERACTS.
        // But wait, if user searches via Navbar, the URL changes, this component mounts with new URL.
        // The Server Component should handle the URL params!

        // If we do client-side filtering, we need to update the list.
        if (loading) return; // Prevent re-entry?

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params: any = {
                    ordering: sortBy,
                };

                if (selectedCategory) params.category__slug = selectedCategory;
                if (minPrice) params.price__gte = minPrice;
                if (maxPrice) params.price__lte = maxPrice;
                if (searchQuery) params.search = searchQuery;

                const data = await productService.getProducts(params);
                const items = Array.isArray(data) ? data : (data.results || []);
                setProducts(items);
            } catch (error) {
                console.error("Failed to fetch products", error);
            } finally {
                setLoading(false);
            }
        };

        // Only fetch if we are NOT in the initial state (or if we want to support client-side updates)
        // For simplicity, let's fetch whenever filters change.
        // To avoid double fetch on mount, we can check if current state matches initial props?
        // Actually, the easiest way is: 
        // 1. Initial render uses props.
        // 2. useEffect triggers on changes. 
        // We need to be careful not to trigger on mount if props are already fresh.
        // But `selectedCategory` starts null. If URL has category, server handles it?
        // The current `ShopPage` didn't read URL for category, only search.

        // Let's keep it simple: Fetch on change.
        // But we need to avoid fetching on mount if possible.
        // We can use a `isMounted` ref.

    }, [selectedCategory, minPrice, maxPrice, sortBy, searchQuery]);

    // Better approach: 
    // The server passes `initialProducts` based on `searchParams`.
    // So on mount, `products` is correct.
    // We only need to fetch if the user changes filters LOCALLY.
    // But `searchQuery` comes from URL.

    // Let's use a ref to track first render.
    const [isFirstRender, setIsFirstRender] = useState(true);

    useEffect(() => {
        if (isFirstRender) {
            setIsFirstRender(false);
            return;
        }

        const fetchProducts = async () => {
            setLoading(true);
            try {
                const params: any = {
                    ordering: sortBy,
                };

                if (selectedCategory) params.category__slug = selectedCategory;
                if (minPrice) params.price__gte = minPrice;
                if (maxPrice) params.price__lte = maxPrice;
                if (searchQuery) params.search = searchQuery;

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
    }, [selectedCategory, minPrice, maxPrice, sortBy, searchQuery]);


    return (
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
                {/* Header inside grid area for mobile layout consistency */}
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-gray-800">
                            {searchQuery ? `Search Results for "${searchQuery}"` : 'Shop All Products'}
                        </h1>
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
                                // Also clear search if possible?
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
    );
}
