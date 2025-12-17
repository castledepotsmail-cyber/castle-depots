"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { productService } from "@/services/productService";
import { Campaign } from "@/services/campaignService";
import { Product } from "@/store/cartStore";

const defaultImages = [
    "https://images.unsplash.com/photo-1556910103-1c02745a30bf?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1556909212-d5b604d0c90d?auto=format&fit=crop&q=80&w=600",
    "https://images.unsplash.com/photo-1556911220-e15b29be8c8f?auto=format&fit=crop&q=80&w=600",
];

export default function FlashSaleCarousel({ campaign, bannerTheme }: { campaign?: Campaign, bannerTheme?: string }) {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            if (!campaign) {
                setLoading(false);
                return;
            }

            try {
                let data: Product[] = [];
                if (campaign.product_selection_type === 'manual') {
                    // Products are already included in the campaign object if fetched via detail, 
                    // but here we might have a list view object. 
                    // If products are missing, we might need to rely on what's passed or fetch.
                    // Assuming campaign.products is populated or we need to fetch.
                    // For now, let's assume if it's manual, we might need to fetch if empty.
                    if (campaign.products && campaign.products.length > 0) {
                        data = campaign.products;
                    }
                } else if (campaign.product_selection_type === 'category' && campaign.target_category) {
                    data = await productService.getProducts({ category: campaign.target_category });
                } else if (campaign.product_selection_type === 'all') {
                    data = await productService.getProducts({});
                }

                if (data.length > 0) {
                    setProducts(data.slice(0, 10)); // Limit to 10 for carousel
                }
            } catch (error) {
                console.error("Failed to fetch campaign products", error);
            } finally {
                setLoading(false);
            }
        };

        fetchProducts();
    }, [campaign]);

    const displayItems = products.length > 0 ? products : defaultImages.map((src, i) => ({ id: i, image_main: src, isDefault: true }));

    // Duplicate for infinite scroll
    const carouselItems = [...displayItems, ...displayItems];

    // Determine theme
    const activeTheme = (bannerTheme && bannerTheme !== 'inherit') ? bannerTheme : campaign?.theme_mode;
    const gradientFrom = activeTheme === 'red' ? 'from-red-600/60' : activeTheme === 'green' ? 'from-green-600/60' : activeTheme === 'dark' ? 'from-gray-900/60' : 'from-brand-blue/60';

    return (
        <div className="w-full md:w-1/2 h-full relative overflow-hidden flex items-center group">
            {/* Gradient Overlays for smooth fade edges */}
            <div className={`absolute left-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-r ${gradientFrom} to-transparent pointer-events-none`}></div>
            <div className={`absolute right-0 top-0 bottom-0 w-12 z-10 bg-gradient-to-l ${gradientFrom} to-transparent pointer-events-none`}></div>

            <div className="flex gap-4 animate-scroll hover:[animation-play-state:paused] w-max">
                {carouselItems.map((item: any, index) => (
                    <Link
                        href={item.isDefault ? '#' : `/product/${item.slug}`}
                        key={index}
                        className="relative w-48 h-48 md:w-64 md:h-64 flex-shrink-0 rounded-xl overflow-hidden border-2 border-white/20 shadow-lg transform transition-transform hover:scale-105 bg-white"
                    >
                        <Image
                            src={item.image_main || item}
                            alt={item.name || `Flash Sale Item ${index}`}
                            fill
                            className="object-cover"
                        />
                        {!item.isDefault && (
                            <div className="absolute bottom-0 left-0 right-0 bg-black/60 p-2 text-white">
                                <p className="text-sm font-bold truncate">{item.name}</p>
                                <div className="flex items-center gap-2">
                                    <span className="font-bold text-brand-gold">KES {item.discount_price || item.price}</span>
                                    {item.discount_price && (
                                        <span className="text-xs line-through text-gray-300">KES {item.price}</span>
                                    )}
                                </div>
                            </div>
                        )}
                        <div className="absolute inset-0 bg-black/10 group-hover:bg-transparent transition-colors"></div>
                    </Link>
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
                    animation: scroll 30s linear infinite;
                }
                .animate-scroll:hover {
                    animation-play-state: paused;
                }
            `}</style>
        </div>
    );
}
