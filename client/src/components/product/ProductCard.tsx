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
            <Link href={`/product/${product.id}`} className="h-48 bg-gray-100 rounded-xl mb-4 relative overflow-hidden block">
                {product.image ? (
                    <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        className="object-cover transition-transform duration-500 group-hover:scale-110"
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    />
                ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-gray-400 bg-gray-50">
                        <span className="text-xs text-gray-400">No Image</span>
                    </div>
                )}
            </Link>

            {/* Content */}
            <Link href={`/product/${product.id}`}>
                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-brand-blue transition-colors">
                    {product.name}
                </h3>
            </Link>

            {/* Rating */}
            <div className="flex items-center gap-1 mb-2">
                <div className="flex text-yellow-400">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <svg
                            key={star}
                            className={`w-3 h-3 ${star <= (product.average_rating || 0) ? 'fill-current' : 'text-gray-300'}`}
                            viewBox="0 0 20 20"
                            xmlns="http://www.w3.org/2000/svg"
                        >
                            <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" fill="currentColor" />
                        </svg>
                    ))}
                </div>
                <span className="text-xs text-gray-400">({product.review_count || 0})</span>
            </div>

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
