"use client";

import { CheckCircle, Package, Truck, MapPin, ArrowLeft, Loader2 } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { orderService } from "@/services/orderService";
import Image from "next/image";

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);

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
    const isCancelled = order.status === 'cancelled';

    const steps = [
        { id: 1, label: "Order Placed", date: new Date(order.created_at).toLocaleDateString(), completed: currentStep >= 1, icon: Package },
        { id: 2, label: "Processing", date: currentStep >= 2 ? "Confirmed" : "Pending", completed: currentStep >= 2, icon: CheckCircle },
        { id: 3, label: "Shipped", date: currentStep >= 3 ? "On the way" : "Pending", completed: currentStep >= 3, icon: Truck },
        { id: 4, label: "Delivered", date: currentStep >= 4 ? "Delivered" : "Estimated", completed: currentStep >= 4, icon: MapPin },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/orders" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <div>
                    <h1 className="font-display text-2xl font-bold text-gray-800">Order #{orderId.slice(0, 8)}...</h1>
                    <p className="text-sm text-gray-500">Placed on {new Date(order.created_at).toLocaleString()}</p>
                </div>
                {isCancelled && <span className="bg-red-100 text-red-600 px-3 py-1 rounded-full text-sm font-bold ml-auto">Cancelled</span>}
            </div>

            {/* Tracking Timeline */}
            {!isCancelled && (
                <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                    <h2 className="font-bold text-lg text-gray-800 mb-8">Order Status</h2>

                    <div className="relative">
                        {/* Progress Bar Background */}
                        <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 hidden md:block"></div>

                        {/* Progress Bar Active */}
                        <div
                            className="absolute top-1/2 left-0 h-1 bg-brand-blue -translate-y-1/2 hidden md:block transition-all duration-1000"
                            style={{ width: `${((currentStep - 1) / 3) * 100}%` }}
                        ></div>

                        <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                            {steps.map((step) => {
                                const Icon = step.icon;
                                return (
                                    <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2">
                                        <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 transition-colors ${step.completed ? 'bg-brand-blue border-blue-100 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
                                            <Icon size={20} />
                                        </div>
                                        <div className="md:text-center">
                                            <p className={`font-bold ${step.completed ? 'text-gray-900' : 'text-gray-500'}`}>{step.label}</p>
                                            <p className="text-xs text-gray-500">{step.date}</p>
                                        </div>
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
                        <div key={item.id} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
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
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 space-y-2">
                    <div className="flex justify-between items-center text-gray-600">
                        <span>Payment Method</span>
                        <span className="capitalize">{order.payment_method.replace('_', ' ')}</span>
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
    );
}
