"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import CampaignBanner from "@/components/campaign/CampaignBanner";
import { useEffect, useState } from "react";
import { productService } from "@/services/productService";
import { Product } from "@/store/cartStore";
import { useCartStore } from "@/store/cartStore";

import FlashSaleCarousel from "@/components/campaign/FlashSaleCarousel";

export default function Home() {
  const [topDeals, setTopDeals] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const addItem = useCartStore((state) => state.addItem);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const dealsData = await productService.getProducts({ on_sale: 'true', ordering: '-created_at' });
        if (Array.isArray(dealsData)) {
          setTopDeals(dealsData.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch top deals", error);
      }

      try {
        const catsData = await productService.getCategories();
        console.log("Categories Data:", catsData);
        if (Array.isArray(catsData)) {
          setCategories(catsData.slice(0, 4));
        }
      } catch (error) {
        console.error("Failed to fetch categories", error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  return (
    <div className="min-h-screen flex flex-col">
      <CampaignBanner />
      <Navbar />

      <main className="flex-grow">
        {/* Hero Section */}
        <section className="relative bg-brand-blue text-white py-20 md:py-32 overflow-hidden">
          {/* Background Image */}
          <div className="absolute inset-0 z-0">
            <img
              src="/images/hero_cover.png"
              alt="Hero Background"
              className="w-full h-full object-cover opacity-40 mix-blend-overlay"
            />
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/80 to-transparent"></div>
          </div>

          <div className="container mx-auto px-4 flex flex-col md:flex-row items-center relative z-10">
            <div className="md:w-1/2">
              <span className="bg-brand-gold text-brand-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 inline-block animate-pulse">
                Royal Vault Unlocked
              </span>
              <h1 className="font-display text-5xl md:text-7xl font-bold mb-6 leading-tight drop-shadow-lg">
                Upgrade Your <br />
                <span className="text-brand-gold">Lifestyle Today</span>
              </h1>
              <p className="text-blue-100 text-lg mb-8 max-w-md drop-shadow-md">
                From rugged catering equipment to the latest fashion trends.
                Quality you can trust, prices you'll love.
              </p>


              <div className="flex gap-3 md:gap-4">
                <Link
                  href="/shop"
                  className="bg-brand-gold text-brand-blue px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-yellow-400 transition-all hover:scale-105 flex items-center gap-2 shadow-lg hover:shadow-brand-gold/50 whitespace-nowrap text-sm md:text-base"
                >
                  Shop Now <ArrowRight size={20} />
                </Link>
                <Link
                  href="/category/catering"
                  className="backdrop-blur-md bg-white/10 border-2 border-white/30 text-white px-6 py-3 md:px-8 md:py-4 rounded-full font-bold hover:bg-white hover:text-brand-blue transition-all whitespace-nowrap text-sm md:text-base"
                >
                  View Catalog
                </Link>
              </div>
            </div>

            {/* Hero Image/Graphic */}
            <div className="md:w-1/2 mt-10 md:mt-0 relative hidden md:block">
              {/* Optional: You can put a floating product image here if needed, or just let the background shine */}
            </div>
          </div>
        </section>

        {/* Categories */}
        <section className="py-16 bg-gray-50">
          <div className="container mx-auto px-4">
            <h2 className="font-display text-3xl font-bold mb-10 text-center text-gray-800">Shop by Category</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {loading ? (
                <div className="col-span-4 flex justify-center py-12">
                  <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
                </div>
              ) : categories.length > 0 ? categories.map((cat) => (
                <Link
                  key={cat.id}
                  href={`/category/${cat.slug}`}
                  className="group relative h-64 rounded-2xl overflow-hidden shadow-md hover:shadow-2xl transition-all duration-300 transform hover:-translate-y-1"
                >
                  <div className="absolute inset-0">
                    <img
                      src={cat.image || '/images/placeholder_cat.png'}
                      alt={cat.name}
                      className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent opacity-80 group-hover:opacity-90 transition-opacity"></div>
                  </div>

                  <div className="absolute bottom-0 left-0 right-0 p-6 translate-y-2 group-hover:translate-y-0 transition-transform">
                    <h3 className="font-display text-2xl font-bold text-white mb-2">{cat.name}</h3>
                    <span className="text-brand-gold text-sm font-bold flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                      Explore Collection <ArrowRight size={16} />
                    </span>
                  </div>
                </Link>
              )) : (
                <div className="col-span-4 text-center text-gray-500 py-12">No categories found.</div>
              )}
            </div>
          </div>
        </section>

        {/* Special Offer Banner */}
        <section className="py-8 container mx-auto px-4">
          <div className="relative rounded-3xl overflow-hidden shadow-2xl group bg-brand-blue">
            {/* Background Image */}
            <div className="absolute inset-0 z-0">
              <img
                src="/images/promo_bg.png"
                alt="Special Offer"
                className="w-full h-full object-cover opacity-40 mix-blend-overlay"
              />
              <div className="absolute inset-0 bg-gradient-to-r from-brand-blue via-brand-blue/90 to-brand-blue/60"></div>
            </div>

            <div className="relative z-10 flex flex-col md:flex-row items-center justify-between p-6 md:p-12 gap-8">
              {/* Text Content */}
              <div className="w-full md:w-1/2 flex flex-col items-start text-white">
                <span className="bg-white text-brand-blue px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider mb-4 shadow-sm">Limited Time</span>
                <h2 className="font-display text-4xl md:text-5xl font-bold mb-4 drop-shadow-lg leading-tight">Flash Sale!</h2>
                <p className="text-lg md:text-xl mb-8 font-medium max-w-md text-blue-100">Get up to 50% off on selected premium items. Don't miss out.</p>
                <button className="bg-brand-gold text-brand-blue px-8 py-3 rounded-full font-bold hover:bg-white transition-all shadow-lg flex items-center gap-2 whitespace-nowrap hover:scale-105 active:scale-95">
                  View Offers <ArrowRight size={20} />
                </button>
              </div>

              {/* Carousel */}
              <FlashSaleCarousel />
            </div>
          </div>
        </section>

        {/* Top Deals */}
        <section className="py-12 container mx-auto px-4">
          <div className="flex justify-between items-end mb-8">
            <h2 className="font-display text-2xl font-bold">Top Deals</h2>
            <Link href="/shop" className="text-brand-blue font-semibold hover:underline">View All</Link>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
            {topDeals.map((product) => (
              <div key={product.id} className="bg-white rounded-2xl p-3 shadow-sm hover:shadow-xl transition-shadow border border-gray-100 flex flex-col relative">
                {product.discountPrice && (
                  <div className="bg-red-500 text-white text-xs font-bold px-2 py-1 rounded absolute top-4 left-4 z-10">
                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                  </div>
                )}
                <Link href={`/product/${product.id}`} className="h-48 bg-gray-100 rounded-xl mb-4 relative overflow-hidden group">
                  <img
                    src={product.image || "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600"}
                    alt={product.name}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                  />
                </Link>
                <Link href={`/product/${product.id}`}>
                  <h3 className="font-semibold text-gray-800 mb-1 line-clamp-2 hover:text-brand-blue transition-colors">
                    {product.name}
                  </h3>
                </Link>
                <div className="mt-auto pt-2">
                  {product.discountPrice ? (
                    <div className="flex flex-col">
                      <p className="text-xs text-gray-400 line-through">KES {product.price.toLocaleString()}</p>
                      <div className="flex justify-between items-center">
                        <p className="text-lg font-bold text-brand-blue">KES {product.discountPrice.toLocaleString()}</p>
                        <button
                          onClick={() => addItem(product)}
                          className="bg-brand-blue text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-blue transition-colors">
                          +
                        </button>
                      </div>
                    </div>
                  ) : (
                    <div className="flex justify-between items-center">
                      <p className="text-lg font-bold text-brand-blue">KES {product.price.toLocaleString()}</p>
                      <button
                        onClick={() => addItem(product)}
                        className="bg-brand-blue text-white w-8 h-8 rounded-full flex items-center justify-center hover:bg-brand-gold hover:text-brand-blue transition-colors">
                        +
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
            {topDeals.length === 0 && (
              <div className="col-span-4 text-center text-gray-500 py-12">No deals found at the moment.</div>
            )}
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
