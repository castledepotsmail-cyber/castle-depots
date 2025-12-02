"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { Star, Truck, ShieldCheck, ArrowLeft, Minus, Plus, ShoppingCart } from "lucide-react";
import Link from "next/link";
import { useState, use } from "react";

// Mock Data Fetcher
const getProduct = (id: string) => {
    return {
        id,
        name: "Premium Gold Chafing Dish 8L",
        price: 4500,
        discountPrice: 3800,
        description: "Elevate your catering service with this premium gold-finish chafing dish. Features a durable stainless steel construction, 8L capacity, and elegant design perfect for weddings and high-end events. Includes fuel holder and water pan.",
        images: ["/placeholder.png", "/placeholder.png", "/placeholder.png"],
        stock: 15,
        category: "Catering",
        rating: 4.8,
        reviews: 124,
    };
};

export default function ProductDetailPage({ params }: { params: Promise<{ id: string }> }) {
    const { id } = use(params);
    const product = getProduct(id);
    const [quantity, setQuantity] = useState(1);
    const addItem = useCartStore((state) => state.addItem);

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) {
            addItem({
                id: product.id,
                name: product.name,
                price: product.price,
                image: product.images[0],
                discountPrice: product.discountPrice
            });
        }
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <Link href="/shop" className="inline-flex items-center gap-2 text-gray-500 hover:text-brand-blue mb-6 transition-colors">
                    <ArrowLeft size={20} /> Back to Shop
                </Link>

                <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6 md:p-8">
                    <div className="flex flex-col md:flex-row gap-8 lg:gap-12">

                        {/* Image Gallery */}
                        <div className="md:w-1/2 space-y-4">
                            <div className="bg-gray-100 rounded-xl h-80 md:h-96 flex items-center justify-center text-gray-400 relative overflow-hidden">
                                <span className="text-lg">Main Image</span>
                                {product.discountPrice && (
                                    <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full font-bold text-sm">
                                        {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                    </div>
                                )}
                            </div>
                            <div className="grid grid-cols-4 gap-4">
                                {product.images.map((_, i) => (
                                    <div key={i} className="bg-gray-100 rounded-lg h-20 flex items-center justify-center text-gray-400 cursor-pointer hover:ring-2 ring-brand-blue transition-all">
                                        Thumb
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Product Info */}
                        <div className="md:w-1/2">
                            <div className="flex items-center gap-2 mb-2">
                                <span className="bg-blue-100 text-brand-blue px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wide">{product.category}</span>
                                <div className="flex items-center text-yellow-400 text-sm">
                                    <Star size={16} fill="currentColor" />
                                    <span className="text-gray-600 ml-1">{product.rating} ({product.reviews} reviews)</span>
                                </div>
                            </div>

                            <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                            <div className="flex items-end gap-4 mb-6">
                                {product.discountPrice ? (
                                    <>
                                        <span className="text-4xl font-bold text-brand-blue">KES {product.discountPrice.toLocaleString()}</span>
                                        <span className="text-xl text-gray-400 line-through mb-1">KES {product.price.toLocaleString()}</span>
                                    </>
                                ) : (
                                    <span className="text-4xl font-bold text-brand-blue">KES {product.price.toLocaleString()}</span>
                                )}
                            </div>

                            <p className="text-gray-600 leading-relaxed mb-8">
                                {product.description}
                            </p>

                            {/* Actions */}
                            <div className="flex flex-col sm:flex-row gap-4 mb-8">
                                <div className="flex items-center border border-gray-300 rounded-full w-max">
                                    <button
                                        onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-l-full transition-colors"
                                    >
                                        <Minus size={20} />
                                    </button>
                                    <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                    <button
                                        onClick={() => setQuantity(quantity + 1)}
                                        className="w-12 h-12 flex items-center justify-center hover:bg-gray-100 rounded-r-full transition-colors"
                                    >
                                        <Plus size={20} />
                                    </button>
                                </div>

                                <button
                                    onClick={handleAddToCart}
                                    className="flex-1 bg-brand-blue text-white px-8 py-3 rounded-full font-bold text-lg hover:bg-brand-gold hover:text-brand-blue transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    <ShoppingCart size={24} /> Add to Cart
                                </button>
                            </div>

                            {/* Trust Badges */}
                            <div className="grid grid-cols-2 gap-4 pt-8 border-t border-gray-100">
                                <div className="flex items-center gap-3">
                                    <div className="bg-green-100 text-green-600 p-2 rounded-full">
                                        <Truck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">Fast Delivery</h4>
                                        <p className="text-xs text-gray-500">Countrywide shipping available</p>
                                    </div>
                                </div>
                                <div className="flex items-center gap-3">
                                    <div className="bg-blue-100 text-brand-blue p-2 rounded-full">
                                        <ShieldCheck size={24} />
                                    </div>
                                    <div>
                                        <h4 className="font-bold text-sm text-gray-900">Secure Payment</h4>
                                        <p className="text-xs text-gray-500">Paystack & M-Pesa integrated</p>
                                    </div>
                                </div>
                            </div>

                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
