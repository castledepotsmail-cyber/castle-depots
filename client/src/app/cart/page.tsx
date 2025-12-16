"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import Link from "next/link";
import { Trash2, Minus, Plus, ArrowRight } from "lucide-react";

export default function CartPage() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart } = useCartStore();
    const total = totalPrice();

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <h1 className="font-display text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>

                {items.length === 0 ? (
                    <div className="text-center py-20 bg-white rounded-2xl shadow-sm border border-gray-100">
                        <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
                        <Link href="/shop" className="inline-block bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-brand-gold hover:text-brand-blue transition-colors">
                            Start Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8">
                        {/* Cart Items */}
                        <div className="lg:w-2/3 space-y-4">
                            {items.map((item) => (
                                <div key={item.id} className="bg-white p-4 rounded-xl shadow-sm border border-gray-100 flex gap-4 items-center">
                                    <div className="w-24 h-24 bg-gray-100 rounded-lg flex-shrink-0 flex items-center justify-center overflow-hidden">
                                        {item.image ? (
                                            <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <span className="text-gray-400 text-xs">No Image</span>
                                        )}
                                    </div>

                                    <div className="flex-grow">
                                        <h3 className="font-bold text-gray-800 mb-1">{item.name}</h3>
                                        <p className="text-brand-blue font-bold">KES {(item.discountPrice || item.price).toLocaleString()}</p>
                                    </div>

                                    <div className="flex items-center gap-3">
                                        <div className="flex items-center border border-gray-200 rounded-lg">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="p-2 hover:bg-gray-50 text-gray-600"
                                            >
                                                <Minus size={16} />
                                            </button>
                                            <span className="w-8 text-center font-semibold text-sm">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                disabled={item.quantity >= item.stock_quantity}
                                                className={`p-2 hover:bg-gray-50 ${item.quantity >= item.stock_quantity ? 'text-gray-300 cursor-not-allowed' : 'text-gray-600'}`}
                                            >
                                                <Plus size={16} />
                                            </button>
                                        </div>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-2 text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={20} />
                                        </button>
                                    </div>
                                </div>
                            ))}

                            <button
                                onClick={clearCart}
                                className="text-red-500 text-sm font-semibold hover:underline"
                            >
                                Clear Cart
                            </button>
                        </div>

                        {/* Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                                <h2 className="font-display text-xl font-bold mb-6">Order Summary</h2>

                                <div className="space-y-4 mb-6">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>KES {total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping</span>
                                        <span className="text-sm text-gray-400">Calculated at checkout</span>
                                    </div>
                                    <div className="border-t border-gray-100 pt-4 flex justify-between font-bold text-lg text-gray-900">
                                        <span>Total</span>
                                        <span>KES {total.toLocaleString()}</span>
                                    </div>
                                </div>

                                <Link
                                    href="/checkout"
                                    className="block w-full bg-brand-blue text-white text-center py-4 rounded-xl font-bold hover:bg-brand-gold hover:text-brand-blue transition-all shadow-lg hover:shadow-xl flex items-center justify-center gap-2"
                                >
                                    Proceed to Checkout <ArrowRight size={20} />
                                </Link>

                                <p className="text-xs text-gray-400 text-center mt-4">
                                    Secure Checkout powered by Paystack
                                </p>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
