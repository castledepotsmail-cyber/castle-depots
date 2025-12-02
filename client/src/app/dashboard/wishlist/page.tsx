"use client";

import { useWishlistStore } from "@/store/wishlistStore";
import ProductCard from "@/components/product/ProductCard";
import Link from "next/link";
import { Heart } from "lucide-react";

import { useEffect } from "react";

export default function WishlistPage() {
    const { items, syncWithApi } = useWishlistStore();

    useEffect(() => {
        syncWithApi();
    }, [syncWithApi]);

    if (items.length === 0) {
        return (
            <div className="text-center py-20 bg-white rounded-xl shadow-sm border border-gray-100">
                <div className="w-20 h-20 bg-red-50 text-red-500 rounded-full flex items-center justify-center mx-auto mb-6">
                    <Heart size={40} />
                </div>
                <h2 className="text-2xl font-bold text-gray-800 mb-2">Your Wishlist is Empty</h2>
                <p className="text-gray-500 mb-8">Save items you love to buy later.</p>
                <Link href="/shop" className="inline-block bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-brand-gold hover:text-brand-blue transition-colors">
                    Start Shopping
                </Link>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-bold text-gray-800">My Wishlist ({items.length})</h1>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {items.map((product) => (
                    <ProductCard key={product.id} product={product} />
                ))}
            </div>
        </div>
    );
}
