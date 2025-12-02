"use client";

import Image from "next/image";
import Link from "next/link";
import { ShoppingCart, Heart } from "lucide-react";
import { useCartStore, Product } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";

interface ProductCardProps {
    product: Product;
}

export default function ProductCard({ product }: ProductCardProps) {
    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();
    const isWishlisted = isInWishlist(product.id);

    const toggleWishlist = (e: React.MouseEvent) => {
        e.preventDefault(); // Prevent navigation
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    return (
        <div className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all border border-gray-100 flex flex-col group relative">
            {/* Discount Badge */}
            {product.discountPrice && (
                <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded absolute top-4 left-4 z-10">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                </div>
            )}

            {/* Wishlist Button */}
            <button
                onClick={toggleWishlist}
                className={`absolute top-4 right-4 z-10 p-2 rounded-full transition-colors ${isWishlisted ? 'text-red-500 bg-red-50 opacity-100' : 'text-gray-400 hover:text-red-500 bg-white/80 opacity-0 group-hover:opacity-100'}`}
            >
                <Heart size={20} fill={isWishlisted ? "currentColor" : "none"} />
            </button>

            {/* Image Area */}
            <Link href={`/product/${product.id}`} className="h-48 bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
                    {/* Placeholder for actual image */}
                    <span className="text-xs text-gray-400">Image: {product.name}</span>
                </div>
            </Link>

            {/* Content */}
            <Link href={`/product/${product.id}`}>
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-brand-blue transition-colors">
                    {product.name}
                </h3>
            </Link>

            <div className="mt-auto pt-2">
                {product.discountPrice ? (
                    <div className="flex flex-col">
                        <p className="text-xs text-gray-400 line-through">KES {product.price.toLocaleString()}</p>
                        <p className="text-lg font-bold text-brand-blue">KES {product.discountPrice.toLocaleString()}</p>
                    </div>
                ) : (
                    <p className="text-lg font-bold text-brand-blue">KES {product.price.toLocaleString()}</p>
                )}

                <div className="flex justify-end mt-[-2rem]">
                    <button
                        onClick={(e) => {
                            e.preventDefault();
                            addItem(product);
                        }}
                        className="bg-brand-blue text-white w-10 h-10 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-blue transition-all shadow-md hover:shadow-lg transform active:scale-95"
                    >
                        <ShoppingCart size={18} />
                    </button>
                </div>
            </div>
        </div>
    );
}
