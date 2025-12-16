"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { ShoppingCart, Heart, Star, Minus, Plus, Share2, Loader2, AlertCircle } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore, Product } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { useParams } from "next/navigation";
import { productService } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import Image from "next/image";

interface ProductImage {
    id: string;
    image: string;
}

interface ProductDetails extends Product {
    description: string;
    category: {
        id: string;
        name: string;
        slug: string;
    };
    stock_quantity: number;
    images?: ProductImage[];
}

export default function ProductDetailsPage() {
    const params = useParams();
    const id = params.id as string;

    const [product, setProduct] = useState<ProductDetails | null>(null);
    const [relatedProducts, setRelatedProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(null);

    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

    useEffect(() => {
        const fetchProduct = async () => {
            setLoading(true);
            try {
                const data = await productService.getProduct(id);
                setProduct(data);
                setSelectedImage(data.image); // Default to main image

                // Fetch related products if category is available
                if (data.category) {
                    const related = await productService.getRelatedProducts(data.category.slug, id);
                    setRelatedProducts(related);
                }
            } catch (error) {
                console.error("Failed to fetch product", error);
            } finally {
                setLoading(false);
            }
        };

        if (id) fetchProduct();
    }, [id]);

    if (loading) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex justify-center items-center">
                    <Loader2 className="animate-spin text-brand-blue" size={48} />
                </div>
                <Footer />
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex justify-center items-center">
                    <p className="text-gray-500">Product not found.</p>
                </div>
                <Footer />
            </div>
        );
    }

    const isWishlisted = isInWishlist(product.id);
    const isOutOfStock = product.stock_quantity <= 0;
    const maxQuantity = product.stock_quantity;

    const handleAddToCart = () => {
        if (isOutOfStock) return;
        // Simple loop to add quantity
        for (let i = 0; i < quantity; i++) {
            addItem(product);
        }
        alert("Added to cart!"); // Simple feedback
    };

    const toggleWishlist = () => {
        if (isWishlisted) {
            removeFromWishlist(product.id);
        } else {
            addToWishlist(product);
        }
    };

    // Combine main image and additional images
    const allImages = [
        { id: 'main', image: product.image },
        ...(product.images || [])
    ].filter(img => img.image); // Filter out empty

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 flex-grow">
                {/* Breadcrumb */}
                <div className="text-sm text-gray-500 mb-8">
                    Home / Shop / {product.category?.name} / <span className="text-gray-900 font-semibold">{product.name}</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 mb-16">
                    {/* Image Gallery */}
                    <div className="space-y-4">
                        <div className="aspect-square bg-white rounded-2xl overflow-hidden border border-gray-100 flex items-center justify-center relative shadow-sm">
                            {product.discountPrice && (
                                <div className="absolute top-4 left-4 bg-red-500 text-white px-3 py-1 rounded-full text-sm font-bold z-10">
                                    {Math.round(((product.price - product.discountPrice) / product.price) * 100)}% OFF
                                </div>
                            )}
                            <Image
                                src={selectedImage || product.image || "https://images.unsplash.com/photo-1584269600464-37b1b58a9fe7?auto=format&fit=crop&q=80&w=600"}
                                alt={product.name}
                                fill
                                className="object-contain p-4"
                                sizes="(max-width: 768px) 100vw, 50vw"
                                priority
                            />
                        </div>

                        {/* Thumbnails */}
                        {allImages.length > 1 && (
                            <div className="flex gap-4 overflow-x-auto pb-2">
                                {allImages.map((img, idx) => (
                                    <button
                                        key={img.id || idx}
                                        onClick={() => setSelectedImage(img.image)}
                                        className={`relative w-20 h-20 rounded-lg overflow-hidden border-2 flex-shrink-0 transition-all ${selectedImage === img.image ? 'border-brand-blue ring-2 ring-brand-blue/20' : 'border-gray-200 hover:border-gray-300'
                                            }`}
                                    >
                                        <Image
                                            src={img.image}
                                            alt={`${product.name} view ${idx + 1}`}
                                            fill
                                            className="object-cover"
                                        />
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    {/* Product Info */}
                    <div>
                        <h1 className="font-display text-3xl md:text-4xl font-bold text-gray-900 mb-4">{product.name}</h1>

                        <div className="flex items-center gap-4 mb-6">
                            <div className="flex text-yellow-400">
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" />
                                <Star size={20} fill="currentColor" className="text-gray-300" />
                            </div>
                            <span className="text-gray-500 text-sm">(4.0 Reviews)</span>

                            {isOutOfStock ? (
                                <span className="text-red-600 font-semibold text-sm bg-red-50 px-2 py-1 rounded flex items-center gap-1">
                                    <AlertCircle size={14} /> Out of Stock
                                </span>
                            ) : (
                                <span className="text-green-600 font-semibold text-sm bg-green-50 px-2 py-1 rounded">
                                    In Stock ({product.stock_quantity} available)
                                </span>
                            )}
                        </div>

                        <div className="mb-8">
                            {product.discountPrice ? (
                                <div className="flex items-end gap-3">
                                    <span className="text-4xl font-bold text-brand-blue">KES {product.discountPrice.toLocaleString()}</span>
                                    <span className="text-xl text-gray-400 line-through mb-1">KES {product.price.toLocaleString()}</span>
                                </div>
                            ) : (
                                <span className="text-4xl font-bold text-brand-blue">KES {product.price.toLocaleString()}</span>
                            )}
                        </div>

                        <p className="text-gray-600 leading-relaxed mb-8">
                            {product.description || "No description available."}
                        </p>

                        {/* Actions */}
                        <div className="flex flex-col sm:flex-row gap-4 mb-8">
                            <div className="flex items-center border border-gray-300 rounded-full w-max">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    disabled={isOutOfStock}
                                    className="p-3 hover:bg-gray-100 rounded-l-full transition-colors disabled:opacity-50"
                                >
                                    <Minus size={20} />
                                </button>
                                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(Math.min(maxQuantity, quantity + 1))}
                                    disabled={isOutOfStock || quantity >= maxQuantity}
                                    className="p-3 hover:bg-gray-100 rounded-r-full transition-colors disabled:opacity-50"
                                >
                                    <Plus size={20} />
                                </button>
                            </div>

                            <button
                                onClick={handleAddToCart}
                                disabled={isOutOfStock}
                                className={`flex-1 py-3 px-8 rounded-full font-bold transition-all shadow-lg flex items-center justify-center gap-2 ${isOutOfStock
                                        ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                                        : 'bg-brand-blue text-white hover:bg-brand-gold hover:text-brand-blue'
                                    }`}
                            >
                                <ShoppingCart size={20} /> {isOutOfStock ? 'Out of Stock' : 'Add to Cart'}
                            </button>

                            <button
                                onClick={toggleWishlist}
                                className={`p-3 rounded-full border transition-colors ${isWishlisted ? 'border-red-500 text-red-500 bg-red-50' : 'border-gray-300 text-gray-500 hover:border-red-500 hover:text-red-500'}`}
                            >
                                <Heart size={24} fill={isWishlisted ? "currentColor" : "none"} />
                            </button>
                        </div>

                        <div className="flex items-center gap-4 text-sm text-gray-500 border-t border-gray-100 pt-6">
                            <span className="flex items-center gap-2"><Share2 size={16} /> Share this product</span>
                            <span>SKU: {product.id.slice(0, 8).toUpperCase()}</span>
                            <span>Category: {product.category?.name}</span>
                        </div>
                    </div>
                </div>

                {/* Related Products */}
                {relatedProducts.length > 0 && (
                    <div className="mt-20">
                        <h2 className="font-display text-2xl font-bold text-gray-800 mb-8">Related Products</h2>
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                            {relatedProducts.map((p) => (
                                <ProductCard key={p.id} product={p} />
                            ))}
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
