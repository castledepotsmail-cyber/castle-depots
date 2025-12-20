"use client";

import ProductCard from "@/components/product/ProductCard";
import { Product } from "@/store/cartStore";
import { Filter } from "lucide-react";
import Image from "next/image";
import { useState } from "react";

interface CategoryClientProps {
    initialProducts: Product[];
    category: any;
    slug: string;
}

export default function CategoryClient({ initialProducts, category, slug }: CategoryClientProps) {
    const [products, setProducts] = useState<Product[]>(initialProducts);

    // Format slug for display (fallback)
    const categoryName = category?.name || (slug ? slug.charAt(0).toUpperCase() + slug.slice(1).replace(/-/g, " ") : "Category");

    return (
        <>
            {/* Hero Section */}
            <div className="relative h-64 md:h-80 w-full bg-gray-900 overflow-hidden">
                {category?.image ? (
                    <Image
                        src={category.image}
                        alt={categoryName}
                        fill
                        className="object-cover opacity-60"
                        priority
                    />
                ) : (
                    <div className="absolute inset-0 bg-gradient-to-r from-brand-blue to-gray-900 opacity-80" />
                )}
                <div className="absolute inset-0 flex flex-col justify-center items-center text-center px-4">
                    <h1 className="font-display text-4xl md:text-5xl font-bold text-white mb-4 drop-shadow-lg">
                        {categoryName}
                    </h1>
                    <p className="text-gray-200 text-lg max-w-2xl drop-shadow-md">
                        Explore our premium collection of {categoryName.toLowerCase()}.
                    </p>
                </div>
            </div>

            <main className="container mx-auto px-4 py-12 flex-grow">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-6">
                    <a href="/" className="hover:text-brand-blue">Home</a> / <a href="/shop" className="hover:text-brand-blue">Shop</a> / <span className="text-gray-900 font-semibold">{categoryName}</span>
                </div>

                <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4 bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                    <p className="text-gray-600 font-medium">Showing {products.length} results</p>

                    <div className="flex items-center gap-3">
                        <span className="text-sm text-gray-500">Sort by:</span>
                        <select className="bg-gray-50 border border-gray-200 text-gray-700 text-sm rounded-lg focus:ring-brand-blue focus:border-brand-blue block p-2.5 outline-none">
                            <option>Most Popular</option>
                            <option>Newest Arrivals</option>
                            <option>Price: Low to High</option>
                            <option>Price: High to Low</option>
                        </select>
                        <button className="flex items-center gap-2 bg-white px-4 py-2 rounded-lg border border-gray-200 hover:border-brand-blue transition-colors text-sm font-semibold text-gray-700 shadow-sm ml-2">
                            <Filter size={16} /> Filter
                        </button>
                    </div>
                </div>

                {products.length > 0 ? (
                    <div className="grid grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-6">
                        {products.map((product) => (
                            <ProductCard key={product.id} product={product} />
                        ))}
                    </div>
                ) : (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <p className="text-gray-500 text-lg mb-4">No products found in this category.</p>
                        <button
                            onClick={() => window.location.reload()}
                            className="text-brand-blue font-bold hover:underline"
                        >
                            Try Refreshing
                        </button>
                    </div>
                )}
            </main>
        </>
    );
}
