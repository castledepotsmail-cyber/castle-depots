"use client";

import { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { campaignService, Campaign } from "@/services/campaignService";
import { productService } from "@/services/productService";
import { Product } from "@/store/cartStore";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { useCartStore } from "@/store/cartStore";
import { ArrowLeft, Loader2 } from "lucide-react";

export default function CampaignPage() {
    const params = useParams();
    const router = useRouter();
    const [campaign, setCampaign] = useState<Campaign | null>(null);
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const addItem = useCartStore((state) => state.addItem);

    useEffect(() => {
        const fetchCampaign = async () => {
            try {
                // Since we don't have a direct slug lookup, fetch active campaigns and filter
                // Or fetch all campaigns if needed, but active is safer for public view
                const campaigns = await campaignService.getActiveCampaigns();
                const found = campaigns.find((c: any) => c.slug === params.slug);

                if (found) {
                    setCampaign(found);

                    // Fetch products
                    let data: Product[] = [];
                    if (found.product_selection_type === 'manual') {
                        if (found.products && found.products.length > 0) {
                            data = found.products;
                        }
                    } else if (found.product_selection_type === 'category' && found.target_category) {
                        data = await productService.getProducts({ category: found.target_category });
                    } else if (found.product_selection_type === 'all') {
                        data = await productService.getProducts({});
                    }
                    setProducts(data);
                } else {
                    // Handle not found
                    console.error("Campaign not found");
                }
            } catch (error) {
                console.error("Failed to load campaign", error);
            } finally {
                setLoading(false);
            }
        };

        if (params.slug) {
            fetchCampaign();
        }
    }, [params.slug]);

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center bg-gray-50">
                <Loader2 className="animate-spin text-brand-blue" size={48} />
            </div>
        );
    }

    if (!campaign) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Campaign Not Found</h1>
                    <p className="text-gray-600 mb-8">The campaign you are looking for does not exist or has expired.</p>
                    <Link href="/shop" className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Determine theme colors
    const isRed = campaign.theme_mode === 'red';
    const isGreen = campaign.theme_mode === 'green';
    const isDark = campaign.theme_mode === 'dark';

    const bgClass = isRed ? 'bg-red-50' : isGreen ? 'bg-green-50' : isDark ? 'bg-gray-900' : 'bg-blue-50';
    const textClass = isDark ? 'text-white' : 'text-gray-900';
    const accentClass = isRed ? 'text-red-600' : isGreen ? 'text-green-600' : 'text-brand-blue';
    const buttonClass = isRed ? 'bg-red-600 hover:bg-red-700' : isGreen ? 'bg-green-600 hover:bg-green-700' : 'bg-brand-blue hover:bg-brand-gold hover:text-brand-blue';

    return (
        <div className={`min-h-screen flex flex-col ${bgClass}`}>
            <Navbar />

            <main className="flex-grow container mx-auto px-4 py-8">
                <button onClick={() => router.back()} className={`flex items-center gap-2 mb-6 font-medium ${isDark ? 'text-gray-300 hover:text-white' : 'text-gray-600 hover:text-gray-900'}`}>
                    <ArrowLeft size={20} /> Back
                </button>

                {/* Header */}
                <div className={`rounded-3xl p-8 md:p-12 mb-12 relative overflow-hidden shadow-xl ${isRed ? 'bg-red-600' : isGreen ? 'bg-green-600' : isDark ? 'bg-gray-800' : 'bg-brand-blue'} text-white`}>
                    <div className="relative z-10 max-w-3xl">
                        <span className="inline-block bg-white/20 backdrop-blur-md px-4 py-1 rounded-full text-sm font-bold uppercase tracking-wider mb-4 border border-white/30">
                            Limited Time Offer
                        </span>
                        <h1 className="font-display text-4xl md:text-6xl font-bold mb-6 leading-tight">
                            {campaign.title}
                        </h1>
                        <p className="text-lg md:text-xl text-white/90 max-w-2xl leading-relaxed">
                            {campaign.description}
                        </p>
                    </div>

                    {/* Decorative Background Elements */}
                    <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
                    <div className="absolute bottom-0 left-0 w-64 h-64 bg-black/10 rounded-full blur-2xl translate-y-1/3 -translate-x-1/4"></div>
                </div>

                {/* Products Grid */}
                <div className="mb-12">
                    <h2 className={`font-display text-2xl font-bold mb-8 ${textClass}`}>
                        Campaign Products <span className="text-sm font-normal opacity-60 ml-2">({products.length} items)</span>
                    </h2>

                    {products.length === 0 ? (
                        <div className={`text-center py-12 rounded-xl border-2 border-dashed ${isDark ? 'border-gray-700 text-gray-500' : 'border-gray-200 text-gray-500'}`}>
                            No products found for this campaign.
                        </div>
                    ) : (
                        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                            {products.map((product) => (
                                <div
                                    key={product.id}
                                    className={`rounded-2xl p-3 shadow-sm hover:shadow-xl transition-all duration-300 border flex flex-col relative group ${isDark ? 'bg-gray-800 border-gray-700' : 'bg-white border-gray-100'}`}
                                >
                                    {product.discountPrice && (
                                        <div className="bg-red-500 text-white text-[10px] font-bold px-2 py-1 rounded absolute top-4 left-4 z-10 shadow-sm">
                                            {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                        </div>
                                    )}

                                    <Link href={`/product/${product.id}`} className={`h-40 md:h-56 rounded-xl mb-4 relative overflow-hidden ${isDark ? 'bg-gray-700' : 'bg-gray-100'}`}>
                                        <img
                                            src={product.image || "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600"}
                                            alt={product.name}
                                            className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                                        />
                                    </Link>

                                    <Link href={`/product/${product.id}`}>
                                        <h3 className={`font-semibold mb-1 line-clamp-2 text-sm md:text-base transition-colors h-10 md:h-12 ${isDark ? 'text-gray-100 hover:text-brand-gold' : 'text-gray-800 hover:text-brand-blue'}`}>
                                            {product.name}
                                        </h3>
                                    </Link>

                                    <div className="mt-auto pt-2">
                                        {product.discountPrice ? (
                                            <div className="flex flex-col">
                                                <p className="text-xs text-gray-400 line-through">KES {parseFloat(product.price.toString()).toLocaleString()}</p>
                                                <div className="flex justify-between items-center mt-1">
                                                    <p className={`text-base md:text-lg font-bold ${isDark ? 'text-brand-gold' : 'text-brand-blue'}`}>KES {product.discountPrice.toLocaleString()}</p>
                                                    <button
                                                        onClick={(e) => {
                                                            e.preventDefault();
                                                            addItem(product);
                                                        }}
                                                        className={`${buttonClass} text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md hover:shadow-lg transform active:scale-95`}
                                                    >
                                                        +
                                                    </button>
                                                </div>
                                            </div>
                                        ) : (
                                            <div className="flex justify-between items-center mt-3">
                                                <p className={`text-base md:text-lg font-bold ${isDark ? 'text-brand-gold' : 'text-brand-blue'}`}>KES {parseFloat(product.price.toString()).toLocaleString()}</p>
                                                <button
                                                    onClick={(e) => {
                                                        e.preventDefault();
                                                        addItem(product);
                                                    }}
                                                    className={`${buttonClass} text-white w-8 h-8 rounded-full flex items-center justify-center transition-colors shadow-md hover:shadow-lg transform active:scale-95`}
                                                >
                                                    +
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
