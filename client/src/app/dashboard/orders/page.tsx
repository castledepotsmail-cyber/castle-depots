"use client";

import { Package, ChevronRight, CreditCard } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import { PaystackButton } from "react-paystack";
import { useAuthStore } from "@/store/authStore";

export default function OrdersPage() {
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const { user } = useAuthStore();

    useEffect(() => {
        const fetchOrders = async () => {
            try {
                const data = await orderService.getOrders();
                setOrders(data);
            } catch (error) {
                console.error('Failed to fetch orders', error);
            } finally {
                setLoading(false);
            }
        };
        fetchOrders();
    }, []);

    const handlePaymentSuccess = async (reference: any, orderId: string) => {
        try {
            // Update order as paid
            await orderService.updateOrderPayment(orderId, reference.reference);
            // Refresh orders
            const data = await orderService.getOrders();
            setOrders(data);
            alert("Payment successful! Your order is now paid.");
        } catch (error) {
            console.error("Payment update failed", error);
            alert("Payment received but failed to update order. Please contact support.");
        }
    };

    if (loading) {
        return <div className="text-center py-8">Loading orders...</div>;
    }

    if (orders.length === 0) {
        return (
            <div className="text-center py-12">
                <Package className="mx-auto text-gray-400 mb-4" size={48} />
                <h2 className="text-xl font-bold text-gray-600 mb-2">No orders yet</h2>
                <p className="text-gray-500">Start shopping to see your orders here!</p>
            </div>
        );
    }

    return (
        <div className="space-y-6">
            <h1 className="font-display text-2xl font-bold text-gray-800">My Orders</h1>

            <div className="space-y-4">
                {orders.map((order) => {
                    const needsPayment = order.status === 'delivered' && !order.is_paid && order.payment_method === 'pay_on_delivery';

                    return (
                        <div key={order.id} className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                            <Link href={`/dashboard/orders/${order.id}`} className="block hover:opacity-80 transition-opacity">
                                <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
                                    <div className="flex items-center gap-4">
                                        <div className="bg-blue-50 text-brand-blue p-3 rounded-full">
                                            <Package size={24} />
                                        </div>
                                        <div>
                                            <h3 className="font-bold text-gray-900">Order #{order.id.slice(0, 8)}...</h3>
                                            <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleDateString()}</p>
                                        </div>
                                    </div>

                                    <div className="flex flex-col md:flex-row items-start md:items-center gap-4 md:gap-8 w-full md:w-auto">
                                        <div className="text-right">
                                            <p className="font-bold text-gray-900">KES {parseFloat(order.total_amount).toLocaleString()}</p>
                                            <p className="text-sm text-gray-500">{order.items?.length || 0} items</p>
                                        </div>

                                        <div className="flex items-center gap-4">
                                            <span className={`px-3 py-1 rounded-full text-xs font-bold ${order.status === 'delivered' ? 'bg-green-100 text-green-700' :
                                                order.status === 'processing' || order.status === 'shipped' ? 'bg-yellow-100 text-yellow-700' :
                                                    order.status === 'cancelled' ? 'bg-red-100 text-red-700' :
                                                        'bg-blue-100 text-blue-700'
                                                }`}>
                                                {order.status.replace('_', ' ').charAt(0).toUpperCase() + order.status.replace('_', ' ').slice(1)}
                                            </span>
                                            <ChevronRight className="text-gray-400" />
                                        </div>
                                    </div>
                                </div>
                            </Link>

                            {needsPayment && (
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-sm text-orange-600 font-medium">
                                        <span className="inline-block w-2 h-2 bg-orange-600 rounded-full mr-2"></span>
                                        Payment pending - Please complete your payment
                                    </p>
                                    <PaystackButton
                                        email={user?.email || ''}
                                        amount={Math.round(parseFloat(order.total_amount) * 100)}
                                        publicKey={process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || ''}
                                        text="Pay Now"
                                        onSuccess={(reference) => handlePaymentSuccess(reference, order.id)}
                                        onClose={() => console.log("Payment closed")}
                                        className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    />
                                </div>
                            )}

                            {order.status === 'delivered' && order.is_paid && (
                                <div className="mt-4 pt-4 border-t border-gray-100 flex items-center justify-between">
                                    <p className="text-sm text-green-600 font-medium flex items-center gap-2">
                                        <span className="inline-block w-2 h-2 bg-green-600 rounded-full"></span>
                                        Order completed and paid
                                    </p>
                                    <button
                                        onClick={async (e) => {
                                            e.preventDefault();
                                            const { generateReceipt } = await import("@/utils/receiptGenerator");
                                            generateReceipt(order);
                                        }}
                                        className="bg-brand-blue text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                                            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                                            <polyline points="7 10 12 15 17 10"></polyline>
                                            <line x1="12" y1="15" x2="12" y2="3"></line>
                                        </svg>
                                        Download Receipt
                                    </button>
                                </div>
                            )}
                        </div>
                    );
                })}
            </div>
        </div>
    );
}
