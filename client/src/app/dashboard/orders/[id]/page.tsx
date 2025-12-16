"use client";

import { CheckCircle, Package, Truck, MapPin, ArrowLeft, Loader2, CreditCard } from "lucide-react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import { productService } from "@/services/productService";
import Image from "next/image";
import dynamic from "next/dynamic";

const PaystackPaymentButton = dynamic(
    () => import("@/components/common/PaystackPaymentButton"),
    { ssr: false }
);
import { useAuthStore } from "@/store/authStore";

export default function OrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();
    const [reviewModalOpen, setReviewModalOpen] = useState(false);
    const [selectedProductForReview, setSelectedProductForReview] = useState<{ id: string, name: string } | null>(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const data = await orderService.getOrder(orderId);
                setOrder(data);
            } catch (error) {
                console.error("Failed to fetch order", error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrder();
    }, [orderId]);

    const handlePaymentSuccess = async (reference: any) => {
        try {
            await orderService.updateOrderPayment(orderId, reference.reference);
            // Refresh order data
            const data = await orderService.getOrder(orderId);
            setOrder(data);
            alert("Payment successful! Your order is now paid.");
        } catch (error) {
            console.error("Payment update failed", error);
            alert("Payment received but failed to update order. Please contact support.");
        }
    };

    if (loading) {
        return <div className="flex justify-center p-12"><Loader2 className="animate-spin text-brand-blue" /></div>;
    }

    if (!order) {
        return <div className="p-12 text-center">Order not found.</div>;
    }

    // Determine current step based on status
    const getStepStatus = (status: string) => {
        const statusMap: Record<string, number> = {
            'placed': 1,
            'payment_confirmed': 2,
            'processing': 2,
            'shipped': 3,
            'delivered': 4,
            'cancelled': 0
        };
        return statusMap[status] || 1;
    };

    const currentStep = getStepStatus(order.status);
    const needsPayment = order.status === 'delivered' && !order.is_paid && order.payment_method === 'pod';
    const canDownloadReceipt = order.status === 'delivered' && order.is_paid;

    const trackingSteps = [
        { label: "Order Placed", icon: Package, step: 1 },
        { label: "Processing", icon: CheckCircle, step: 2 },
        { label: "Shipped", icon: Truck, step: 3 },
        { label: "Delivered", icon: MapPin, step: 4 },
    ];

    const openReviewModal = (product: { id: string, name: string }) => {
        setSelectedProductForReview(product);
        setReviewModalOpen(true);
    };

    return (
        <div className="space-y-6">
            <Link href="/dashboard/orders" className="inline-flex items-center gap-2 text-brand-blue font-semibold hover:underline">
                <ArrowLeft size={20} /> Back to Orders
            </Link>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4 mb-6">
                    <div>
                        <h1 className="font-display text-2xl font-bold text-gray-800">Order #{order.id.slice(0, 8)}...</h1>
                        <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                    </div>
                    <div className="flex flex-wrap items-center gap-3">
                        <span className={`px-4 py-2 rounded-full text-sm font-bold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                            order.status === 'processing' || order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                                order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                    'bg-blue-100 text-blue-700'
                            }`}>
                            {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                        </span>
                        {canDownloadReceipt && (
                            <>
                                <button
                                    onClick={async () => {
                                        const { generateReceipt } = await import("@/utils/receiptGenerator");
                                        generateReceipt(order, 'view');
                                    }}
                                    className="bg-gray-100 text-gray-700 px-4 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center gap-2 shadow-md text-sm whitespace-nowrap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                                        <circle cx="12" cy="12" r="3"></circle>
                                    </svg>
                                    View Receipt
                                </button>
                                <button
                                    onClick={async () => {
                                        const { generateReceipt } = await import("@/utils/receiptGenerator");
                                        generateReceipt(order);
                                    }}
                                    className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-md text-sm whitespace-nowrap"
                                >
                                    <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                        <polyline points="7 10 12 15 17 10"></polyline>
                                        <line x1="12" y1="15" x2="12" y2="3"></line>
                                    </svg>
                                    Download Receipt
                                </button>
                            </>
                        )}
                    </div>
                </div>

                {/* Payment Alert for POD */}
                {needsPayment && (
                    <div className="mb-6 p-4 bg-orange-50 border border-orange-200 rounded-lg">
                        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                            <div className="flex items-center gap-3">
                                <CreditCard className="text-orange-600 flex-shrink-0" size={24} />
                                <div>
                                    <h3 className="font-bold text-orange-900">Payment Required</h3>
                                    <p className="text-sm text-orange-700">Your order has been delivered. Please complete your payment.</p>
                                </div>
                            </div>
                            <PaystackPaymentButton
                                email={user?.email || ''}
                                amount={Math.round(parseFloat(order.total_amount) * 100)}
                                publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_1867c5794041877b51043f44775ebc1d50b3a462'}
                                text="Pay Now"
                                onSuccess={handlePaymentSuccess}
                                onClose={() => console.log("Payment closed")}
                                className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 shadow-lg w-full md:w-auto justify-center"
                            />
                        </div>
                    </div>
                )}

                {/* Tracking Timeline */}
                {order.status !== 'cancelled' && (
                    <div className="mb-8 overflow-x-auto pb-4">
                        <h2 className="font-bold text-lg text-gray-800 mb-6">Order Tracking</h2>
                        <div className="relative min-w-[300px]">
                            <div className="absolute top-5 left-0 right-0 h-1 bg-gray-200">
                                <div
                                    className="h-full bg-brand-blue transition-all duration-500"
                                    style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                                ></div>
                            </div>

                            <div className="relative flex justify-between">
                                {trackingSteps.map((item) => {
                                    const Icon = item.icon;
                                    const isCompleted = currentStep >= item.step;
                                    return (
                                        <div key={item.step} className="flex flex-col items-center">
                                            <div className={`w-10 h-10 rounded-full flex items-center justify-center transition-all ${isCompleted ? 'bg-brand-blue text-white' : 'bg-gray-200 text-gray-400'
                                                }`}>
                                                <Icon size={20} />
                                            </div>
                                            <p className={`mt-2 text-xs font-medium ${isCompleted ? 'text-brand-blue' : 'text-gray-400'}`}>
                                                {item.label}
                                            </p>
                                        </div>
                                    );
                                })}
                            </div>
                        </div>
                    </div>
                )}

                {/* Order Items */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800 mb-4">Items in Order</h2>
                    <div className="space-y-4">
                        {order.items.map((item: any) => (
                            <div key={item.id} className="flex flex-col sm:flex-row gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                                <div className="flex gap-4 flex-1">
                                    <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden">
                                        {item.product.image_main ? (
                                            <Image
                                                src={item.product.image_main}
                                                alt={item.product.name}
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                        )}
                                    </div>
                                    <div>
                                        <h3 className="font-bold text-gray-900">{item.product.name}</h3>
                                        <p className="text-sm text-gray-500">Qty: {item.quantity}</p>
                                        <p className="font-bold text-brand-blue mt-1">KES {parseFloat(item.price).toLocaleString()}</p>
                                    </div>
                                </div>
                                {order.status === 'delivered' && (
                                    <div className="flex items-center sm:justify-end">
                                        <button
                                            onClick={() => openReviewModal(item.product)}
                                            className="text-sm font-bold text-brand-blue hover:bg-blue-50 px-4 py-2 rounded-lg transition-colors border border-brand-blue/20"
                                        >
                                            Write Review
                                        </button>
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>
                    <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Payment Method</span>
                            <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Payment Status</span>
                            <span className={`font-semibold ${order.is_paid ? 'text-green-600' : 'text-orange-600'}`}>
                                {order.is_paid ? 'Paid' : 'Unpaid'}
                            </span>
                        </div>
                        <div className="flex justify-between items-center text-gray-600">
                            <span>Delivery Address</span>
                            <span className="text-right max-w-xs">{order.delivery_address}</span>
                        </div>
                        <div className="flex justify-between items-center pt-2 border-t border-gray-50">
                            <span className="font-bold text-gray-800">Total Amount</span>
                            <span className="font-bold text-xl text-brand-blue">KES {parseFloat(order.total_amount).toLocaleString()}</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* Review Modal */}
            {reviewModalOpen && selectedProductForReview && (
                <ReviewModal
                    product={selectedProductForReview}
                    onClose={() => setReviewModalOpen(false)}
                />
            )}
        </div>
    );
}

function ReviewModal({ product, onClose }: { product: { id: string, name: string }, onClose: () => void }) {
    const [rating, setRating] = useState(5);
    const [comment, setComment] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState("");

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setSubmitting(true);
        setError("");

        try {
            await productService.createReview(product.id, rating, comment);
            alert("Review submitted successfully!");
            onClose();
        } catch (err: any) {
            console.error(err);
            if (err.response && err.response.data) {
                const msg = typeof err.response.data === 'string' ? err.response.data :
                    (err.response.data[0] || JSON.stringify(err.response.data));
                setError(msg);
            } else {
                setError("Failed to submit review.");
            }
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-2xl p-6 w-full max-w-md shadow-2xl relative animate-in fade-in zoom-in duration-200">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-gray-600"
                >
                    ✕
                </button>
                <h3 className="font-bold text-xl text-gray-800 mb-2">Review Product</h3>
                <p className="text-sm text-gray-500 mb-6">How was your experience with <span className="font-semibold">{product.name}</span>?</p>

                <form onSubmit={handleSubmit} className="space-y-4">
                    {error && (
                        <div className="bg-red-50 text-red-600 p-3 rounded-lg text-sm">
                            {error}
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
                                    className={`text-3xl transition-colors ${star <= rating ? 'text-yellow-400' : 'text-gray-300'}`}
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
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue h-32 resize-none"
                            placeholder="Tell us what you liked or didn't like..."
                        ></textarea>
                    </div>

                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            className="flex-1 py-2 rounded-lg font-bold text-gray-600 hover:bg-gray-100 transition-colors"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={submitting}
                            className="flex-1 bg-brand-blue text-white py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors disabled:opacity-50"
                        >
                            {submitting ? "Submitting..." : "Submit Review"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
