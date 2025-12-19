"use client";

import { useRef } from "react";
import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Product } from "@/store/cartStore";
import { useCartStore } from "@/store/cartStore";

interface ProductCarouselProps {
    title: string;
    products: Product[];
    viewAllLink: string;
}

export default function ProductCarousel({ title, products, viewAllLink }: ProductCarouselProps) {
    const scrollContainerRef = useRef<HTMLDivElement>(null);
    const addItem = useCartStore((state) => state.addItem);

    const scroll = (direction: 'left' | 'right') => {
        if (scrollContainerRef.current) {
            const scrollAmount = 300; // Approx width of one card + gap
            const newScrollLeft = scrollContainerRef.current.scrollLeft + (direction === 'right' ? scrollAmount : -scrollAmount);
            scrollContainerRef.current.scrollTo({
                left: newScrollLeft,
                behavior: 'smooth'
            });
        }
    };

    if (products.length === 0) return null;

    return (
        <section className="py-8 container mx-auto px-4 bg-white/90 backdrop-blur-sm relative z-10 rounded-xl my-8">
            <div className="flex justify-between items-end mb-6">
                <h2 className="font-display text-2xl font-bold text-gray-900">{title}</h2>
                <Link href={viewAllLink} className="text-brand-blue font-semibold hover:underline flex items-center gap-1">
                    View All
                </Link>
            </div>

            <div className="relative group">
                {/* Left Button */}
                <button
                    onClick={() => scroll('left')}
                    className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 z-20 bg-white text-gray-800 p-3 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-brand-blue hover:text-white disabled:opacity-0 hidden md:flex items-center justify-center"
                    aria-label="Scroll Left"
                >
                    <ChevronLeft size={24} />
                </button>

                {/* Scroll Container */}
                <div
                    ref={scrollContainerRef}
                    className="flex gap-6 overflow-x-auto pb-8 pt-2 scrollbar-hide snap-x snap-mandatory"
                    style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
                >
                    {products.map((product) => (
                        <div
                            key={product.id}
                            className="min-w-[180px] w-[180px] md:min-w-[240px] md:w-[240px] flex-shrink-0 bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100 flex flex-col relative snap-start group/card"
                        >
                            {product.discountPrice && (
                                <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded absolute top-4 left-4 z-10 shadow-sm">
                                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                </div>
                            )}

                            <Link href={`/product/${product.id}`} className="h-40 md:h-48 bg-gray-100 rounded-xl mb-4 relative overflow-hidden">
                                <img
                                    src={product.image_main || product.image || "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600"}
                                    alt={product.name}
                                    className="w-full h-full object-cover transition-transform duration-500 group-hover/card:scale-110"
                                />
                            </Link>

                            <Link href={`/product/${product.id}`}>
                                <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 text-sm md:text-base hover:text-brand-blue transition-colors h-10 md:h-12">
                                    {product.name}
                                </h3>
                            </Link>

                            <div className="mt-auto pt-2">
                                {product.discountPrice ? (
                                    <div className="flex flex-col">
                                        <p className="text-xs text-gray-400 line-through">KES {parseFloat(product.price.toString()).toLocaleString()}</p>
                                        <div className="flex justify-between items-center mt-1">
                                            <p className="text-base md:text-lg font-bold text-brand-blue">KES {product.discountPrice.toLocaleString()}</p>
                                            <button
                                                onClick={(e) => {
                                                    e.preventDefault();
                                                    addItem(product);
                                                }}
                                                className="bg-brand-blue text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-blue transition-colors shadow-md hover:shadow-lg transform active:scale-95"
                                            >
                                                +
                                            </button>
                                        </div>
                                    </div>
                                ) : (
                                    <div className="flex justify-between items-center mt-3">
                                        <p className="text-base md:text-lg font-bold text-brand-blue">KES {parseFloat(product.price.toString()).toLocaleString()}</p>
                                        <button
                                            onClick={(e) => {
                                                e.preventDefault();
                                                addItem(product);
                                            }}
                                            className="bg-brand-blue text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-blue transition-colors shadow-md hover:shadow-lg transform active:scale-95"
                                        >
                                            +
                                        </button>
                                    </div>
                                )}
                            </div>
                        </div>
                    ))}
                </div>

                {/* Right Button */}
                <button
                    onClick={() => scroll('right')}
                    className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 z-20 bg-white text-gray-800 p-3 rounded-full shadow-lg border border-gray-100 opacity-0 group-hover:opacity-100 transition-all duration-300 hover:scale-110 hover:bg-brand-blue hover:text-white disabled:opacity-0 hidden md:flex items-center justify-center"
                    aria-label="Scroll Right"
                >
                    <ChevronRight size={24} />
                </button>
            </div>
        </section>
    );
}
