"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";

const defaultImages = [
    "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600",
];

export default function FlashSaleCarousel({ images = defaultImages }: { images?: string[] }) {
    // Duplicate images to create seamless loop
    const carouselImages = [...images, ...images];

    return (
        <div className="w-full md:w-1/2 h-full relative overflow-hidden flex items-center group">
            {/* Gradient Overlays for smooth fade edges */}
            <div className="absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r from-brand-blue/80 to-transparent pointer-events-none"></div>
            <div className="absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l from-brand-blue/80 to-transparent pointer-events-none"></div>

            <div className="flex gap-4 animate-scroll hover:[animation-play-state:paused] w-max">
                {carouselImages.map((src, index) => (
                    <div
                        key={index}
                        className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg transform transition-transform hover:scale-105"
                    >
                        <Image
                            src={src}
                            alt={`Flash Sale Item ${index}`}
                            fill
                            className="object-cover"
                        />
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </div>
                ))}
            </div>

            <style jsx>{`
                @keyframes scroll {
                    0% {
                        transform: translateX(0);
                    }
                    100% {
                        transform: translateX(-50%);
                    }
                }
                .animate-scroll {
                    animation: scroll 20s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
