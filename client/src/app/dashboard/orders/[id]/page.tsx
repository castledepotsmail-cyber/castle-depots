"use client";

import { CheckCircle, Package, Truck, MapPin, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useParams } from "next/navigation";

export default function OrderDetailsPage() {
    const params = useParams();
    const orderId = params.id;

    // Mock tracking steps
    const steps = [
        { id: 1, label: "Order Placed", date: "Nov 29, 10:00 AM", completed: true, icon: Package },
        { id: 2, label: "Processing", date: "Nov 29, 02:30 PM", completed: true, icon: CheckCircle },
        { id: 3, label: "Shipped", date: "Nov 30, 09:00 AM", completed: false, icon: Truck },
        { id: 4, label: "Delivered", date: "Estimated Dec 01", completed: false, icon: MapPin },
    ];

    return (
        <div className="space-y-8">
            <div className="flex items-center gap-4">
                <Link href="/dashboard/orders" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="font-display text-2xl font-bold text-gray-800">Order #{orderId}</h1>
            </div>

            {/* Tracking Timeline */}
            <div className="bg-white p-8 rounded-xl shadow-sm border border-gray-100">
                <h2 className="font-bold text-lg text-gray-800 mb-8">Order Status</h2>

                <div className="relative">
                    {/* Progress Bar Background */}
                    <div className="absolute top-1/2 left-0 w-full h-1 bg-gray-200 -translate-y-1/2 hidden md:block"></div>

                    {/* Progress Bar Active (50% for now) */}
                    <div className="absolute top-1/2 left-0 w-1/2 h-1 bg-brand-blue -translate-y-1/2 hidden md:block transition-all duration-1000"></div>

                    <div className="flex flex-col md:flex-row justify-between relative z-10 gap-8 md:gap-0">
                        {steps.map((step) => {
                            const Icon = step.icon;
                            return (
                                <div key={step.id} className="flex md:flex-col items-center gap-4 md:gap-2">
                                    <div className={`w-12 h-12 rounded-full flex items-center justify-center border-4 ${step.completed ? 'bg-brand-blue border-blue-100 text-white' : 'bg-white border-gray-200 text-gray-400'}`}>
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

            {/* Order Items */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="font-bold text-lg text-gray-800 mb-4">Items in Order</h2>
                <div className="space-y-4">
                    {[1, 2].map((item) => (
                        <div key={item} className="flex gap-4 border-b border-gray-50 pb-4 last:border-0 last:pb-0">
                            <div className="w-20 h-20 bg-gray-100 rounded-lg flex-shrink-0"></div>
                            <div>
                                <h3 className="font-bold text-gray-900">Premium Gold Chafing Dish 8L</h3>
                                <p className="text-sm text-gray-500">Qty: 1</p>
                                <p className="font-bold text-brand-blue mt-1">KES 4,500</p>
                            </div>
                        </div>
                    ))}
                </div>
                <div className="mt-6 pt-4 border-t border-gray-100 flex justify-between items-center">
                    <span className="font-bold text-gray-600">Total Amount</span>
                    <span className="font-bold text-xl text-gray-900">KES 9,000</span>
                </div>
            </div>
        </div>
    );
}
