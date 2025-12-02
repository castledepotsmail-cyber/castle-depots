"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductCard from "@/components/product/ProductCard";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { Product } from "@/store/cartStore";
import { Loader2, Filter } from "lucide-react";

export default function CategoryPage() {
    const params = useParams();
    const slug = params.slug as string;
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    // Format slug for display (e.g., "kitchenware" -> "Kitchenware")
    const categoryName = slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : "Category";

    useEffect(() => {
        const fetchProducts = async () => {
            setLoading(true);
            try {
                // In a real app, we'd pass the category slug to the API
                // For now, we'll fetch all and filter client-side or just show all if API doesn't support filter yet
                // Ideally: const data = await productService.getProducts({ category: slug });
                const data = await productService.getProducts({ category: slug });
                const items = Array.isArray(data) ? data : (data.results || []);
                setProducts(items);
            } catch (error) {
                console.error("Failed to fetch products", error);
                // Fallback mock data
                setProducts([]);
            } finally {
                setLoading(false);
            }
        };

        if (slug) {
            fetchProducts();
        }
    }, [slug]);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
                    <div>
                        <h1 className="font-display text-3xl font-bold text-gray-800">{categoryName}</h1>
                        <p className="text-gray-500 text-sm">Explore our collection of {categoryName}</p>
                    </div>

                    <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-brand-blue transition-colors text-sm font-semibold text-gray-700">
                        <Filter size={16} /> Filter
                    </button>
                </div>

                {loading ? (
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-brand-blue" size={48} />
                    </div>
                ) : products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4 md:gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20">
                        <p className="text-gray-500 text-lg">No products found in this category.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="mt-4 text-brand-blue font-bold hover:underline"
                        >
                            Try Refreshing
                        </button>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
