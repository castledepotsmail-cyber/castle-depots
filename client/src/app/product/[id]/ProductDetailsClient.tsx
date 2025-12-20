"use client";

import { ShoppingCart, Heart, Star, Minus, Plus, Share2, AlertCircle } from "lucide-react";
import { useState } from "react";
import { useCartStore, Product } from "@/store/cartStore";
import { useWishlistStore } from "@/store/wishlistStore";
import { productService } from "@/services/productService";
import ProductCard from "@/components/product/ProductCard";
import Image from "next/image";
import Link from "next/link";

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
    reviews?: any[];
    average_rating?: number;
    review_count?: number;
}

interface ProductDetailsClientProps {
    product: ProductDetails;
    relatedProducts: Product[];
}

export default function ProductDetailsClient({ product }: { product: ProductDetails }) {
    const [quantity, setQuantity] = useState(1);
    const [selectedImage, setSelectedImage] = useState<string | null>(product.image || null);

    const addItem = useCartStore((state) => state.addItem);
    const { addItem: addToWishlist, removeItem: removeFromWishlist, isInWishlist } = useWishlistStore();

    const isWishlisted = isInWishlist(product.id);
    const isOutOfStock = product.stock_quantity <= 0;
    const maxQuantity = product.stock_quantity;

    const handleAddToCart = () => {
        if (isOutOfStock) return;

        if (quantity > product.stock_quantity) {
            alert(`Sorry, only ${product.stock_quantity} items available in stock.`);
            return;
        }

        let addedCount = 0;
        for (let i = 0; i < quantity; i++) {
            addItem(product);
            addedCount++;
        }

        if (addedCount > 0) {
            alert("Added to cart!");
        }
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
        ...(product.image ? [{ id: 'main', image: product.image }] : []),
        ...(product.images || [])
    ];

    return (
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
                            {[1, 2, 3, 4, 5].map((star) => (
                                <Star
                                    key={star}
                                    size={20}
                                    fill={star <= (product.average_rating || 0) ? "currentColor" : "none"}
                                    className={star <= (product.average_rating || 0) ? "" : "text-gray-300"}
                                />
                            ))}
                        </div>
                        <span className="text-gray-500 text-sm">({product.average_rating || 0} / 5.0 based on {product.review_count || 0} reviews)</span>

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
                        <button
                            onClick={() => {
                                if (navigator.share) {
                                    navigator.share({
                                        title: product.name,
                                        text: `Check out ${product.name} on Castle Depots!`,
                                        url: window.location.href,
                                    }).catch(console.error);
                                } else {
                                    navigator.clipboard.writeText(window.location.href);
                                    alert("Link copied to clipboard!");
                                }
                            }}
                            className="flex items-center gap-2 hover:text-brand-blue transition-colors"
                        >
                            <Share2 size={16} /> Share this product
                        </button>
                        <span>SKU: {product.id.slice(0, 8).toUpperCase()}</span>
                        <span>Category: {product.category?.name}</span>
                    </div>
                </div>
            </div>

            {/* Reviews Section */}
            <div className="mt-20 border-t border-gray-100 pt-12">
                <h2 className="font-display text-2xl font-bold text-gray-800 mb-8">Customer Reviews</h2>

                <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
                    {/* Reviews List */}
                    <div className="lg:col-span-2 space-y-8">
                        {product.reviews && product.reviews.length > 0 ? (
                            product.reviews.map((review: any) => (
                                <div key={review.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                                    <div className="flex items-center justify-between mb-4">
                                        <div className="flex items-center gap-2">
                                            <div className="w-10 h-10 bg-gray-200 rounded-full flex items-center justify-center font-bold text-gray-600">
                                                {review.user ? review.user[0].toUpperCase() : 'U'}
                                            </div>
                                            <div>
                                                <p className="font-bold text-gray-800">{review.user || 'Anonymous'}</p>
                                                <p className="text-xs text-gray-500">{new Date(review.created_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="flex text-yellow-400">
                                            {[1, 2, 3, 4, 5].map((star) => (
                                                <Star
                                                    key={star}
                                                    size={16}
                                                    fill={star <= review.rating ? "currentColor" : "none"}
                                                    className={star <= review.rating ? "" : "text-gray-300"}
                                                />
                                            ))}
                                        </div>
                                    </div>
                                    <p className="text-gray-600">{review.comment}</p>
                                </div>
                            ))
                        ) : (
                            <p className="text-gray-500 italic">No reviews yet. Be the first to review!</p>
                        )}
                    </div>

                    {/* Write Review Form */}
                    <div className="bg-gray-50 p-6 rounded-xl h-fit">
                        <h3 className="font-bold text-lg text-gray-800 mb-4">Write a Review</h3>
                        <ReviewForm productId={product.id} onReviewSubmitted={() => window.location.reload()} />
                    </div>
                </div>
            </div>
        </main>
    );
}

function ReviewForm({ productId, onReviewSubmitted }: { productId: string, onReviewSubmitted: () => void }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            await productService.createReview(productId, rating, comment);
            alert("Review submitted successfully!");
            setComment("");
            onReviewSubmitted();
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data) {
                // Handle DRF validation errors
                const msg = typeof err.response.data === 'string' ? err.response.data :
                    (err.response.data[0] || JSON.stringify(err.response.data));
                setError(msg);
            } else {
                setError("Failed to submit review. Please ensure you have purchased and received this product.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="space-y-4">
            {error && (
                <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm flex items-start gap-2">
                    <AlertCircle size={16} className="mt-0.5 flex-shrink-0" />
                    <span>{error}</span>
                </div>
            )}

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Rating</label>
                <div className="flex gap-2">
                    {[1, 2, 3, 4, 5].map((star) => (
                        <button
                            key={star}
                            type="button"
                            onClick={() => setRating(star)}
                            className={`text-2xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
                        >
                            ★
                        </button>
                    ))}
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-1">Your Review</label>
                <textarea
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    required
                    className="w-full px-4 py-2 bg-white border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue h-32 resize-none"
                    placeholder="Tell us what you liked or didn't like..."
                ></textarea>
            </div>

            <button
                type="submit"
                disabled={submitting}
                className="w-full bg-brand-blue text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
                {submitting ? "Submitting..." : "Submit Review"}
            </button>
        </form>
    );
}
