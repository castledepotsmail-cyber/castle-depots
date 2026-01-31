"use client";

import { useState, useEffect, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { adminService } from "@/services/adminService";
import {
    ArrowLeft, MapPin, Phone, Mail, User, Calendar, CreditCard,
    Package, ExternalLink, Printer, CheckCircle, AlertCircle,
    Truck, ChevronDown
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";
import dynamic from "next/dynamic";

const AddressMap = dynamic(() => import("@/components/common/AddressMap"), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function AdminOrderDetailsPage() {
    const params = useParams();
    const router = useRouter();
    const orderId = params.id as string;
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [updating, setUpdating] = useState(false);
    const [isStatusOpen, setIsStatusOpen] = useState(false);
    const statusDropdownRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        fetchOrder();
    }, [orderId]);

    useEffect(() => {
        function handleClickOutside(event: MouseEvent) {
            if (statusDropdownRef.current && !statusDropdownRef.current.contains(event.target as Node)) {
                setIsStatusOpen(false);
            }
        }
        document.addEventListener("mousedown", handleClickOutside);
        return () => {
            document.removeEventListener("mousedown", handleClickOutside);
        };
    }, []);

    const fetchOrder = async () => {
        try {
            const data = await adminService.getOrder(orderId);
            setOrder(data);
        } catch (error) {
            console.error("Failed to fetch order", error);
        } finally {
            setLoading(false);
        }
    };

    const handleStatusUpdate = async (newStatus: string) => {
        if (!confirm(`Are you sure you want to change the status to ${newStatus}?`)) return;

        setUpdating(true);
        try {
            await adminService.updateOrderStatus(orderId, newStatus);
            await fetchOrder(); // Refresh data
            alert("Order status updated successfully.");
        } catch (error) {
            console.error("Failed to update status", error);
            alert("Failed to update order status.");
        } finally {
            setUpdating(false);
        }
    };

    const handleMarkAsPaid = async () => {
        if (!confirm("Mark this order as paid?")) return;

        setUpdating(true);
        try {
            await adminService.updateOrder(orderId, {
                is_paid: true,
                paystack_ref: `MANUAL-ADMIN-${Date.now()}`
            });
            await fetchOrder();
            alert("Order marked as paid.");
        } catch (error) {
            console.error("Failed to update payment", error);
            alert("Failed to update payment status.");
        } finally {
            setUpdating(false);
        }
    };

    if (loading) {
        return (
            <div className="flex items-center justify-center h-96">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-brand-blue"></div>
            </div>
        );
    }

    if (!order) {
        return (
            <div className="text-center py-12">
                <h2 className="text-2xl font-bold text-gray-800">Order not found</h2>
                <Link href="/admin/orders" className="text-brand-blue hover:underline mt-4 inline-block">
                    Back to Orders
                </Link>
            </div>
        );
    }

    const statusColors: Record<string, string> = {
        'placed': 'bg-blue-100 text-blue-700',
        'processing': 'bg-yellow-100 text-yellow-700',
        'shipped': 'bg-purple-100 text-purple-700',
        'delivered': 'bg-green-100 text-green-700',
        'cancelled': 'bg-red-100 text-red-700'
    };

    const googleMapsUrl = order.delivery_latitude && order.delivery_longitude
        ? `https://www.google.com/maps/dir/?api=1&destination=${order.delivery_latitude},${order.delivery_longitude}`
        : null;

    return (
        <div className="space-y-6 max-w-7xl mx-auto px-4 md:px-0">
            {/* Header / Navigation */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/orders" className="p-2 hover:bg-gray-100 rounded-full transition-colors flex-shrink-0">
                        <ArrowLeft size={24} className="text-gray-600" />
                    </Link>
                    <div className="min-w-0">
                        <h1 className="text-xl md:text-2xl font-bold text-gray-900 flex flex-wrap items-center gap-2 md:gap-3">
                            Order #{order.id.slice(0, 8)}
                            <span className={`px-2 py-0.5 md:px-3 md:py-1 rounded-full text-xs md:text-sm font-bold ${statusColors[order.status] || 'bg-gray-100 text-gray-700'}`}>
                                {order.status.toUpperCase()}
                            </span>
                        </h1>
                        <p className="text-gray-500 flex items-center gap-2 text-xs md:text-sm mt-1">
                            <Calendar size={14} />
                            {new Date(order.created_at).toLocaleString()}
                        </p>
                    </div>
                </div>

                <div className="flex flex-wrap items-center gap-3">
                    <div className="relative" ref={statusDropdownRef}>
                        <button
                            onClick={() => setIsStatusOpen(!isStatusOpen)}
                            className="flex items-center gap-2 bg-white border border-gray-300 px-4 py-2 rounded-lg font-medium text-gray-700 hover:bg-gray-50 transition-colors shadow-sm text-sm"
                        >
                            Update Status <ChevronDown size={16} />
                        </button>
                        {isStatusOpen && (
                            <div className="absolute right-0 mt-2 w-48 bg-white rounded-xl shadow-xl border border-gray-100 overflow-hidden z-50">
                                {['placed', 'processing', 'shipped', 'delivered', 'cancelled'].map((status) => (
                                    <button
                                        key={status}
                                        onClick={() => {
                                            handleStatusUpdate(status);
                                            setIsStatusOpen(false);
                                        }}
                                        disabled={updating || order.status === status}
                                        className={`w-full text-left px-4 py-3 text-sm hover:bg-gray-50 transition-colors capitalize ${order.status === status ? 'bg-blue-50 text-brand-blue font-bold' : 'text-gray-700'}`}
                                    >
                                        {status}
                                    </button>
                                ))}
                            </div>
                        )}
                    </div>

                    <button
                        onClick={async () => {
                            const { generateReceipt } = await import("@/utils/receiptGenerator");
                            generateReceipt(order);
                        }}
                        className="flex items-center gap-2 bg-brand-blue text-white px-4 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors shadow-md text-sm"
                    >
                        <Printer size={18} /> <span className="hidden sm:inline">Print Invoice</span><span className="sm:hidden">Print</span>
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left Column: Order Details */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Items */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                        <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                            <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2">
                                <Package className="text-brand-blue" size={20} /> Order Items
                            </h2>
                            <span className="text-gray-500 text-sm">{order.items.length} items</span>
                        </div>
                        <div className="divide-y divide-gray-50">
                            {order.items.map((item: any) => (
                                <div key={item.id} className="p-4 flex gap-4 items-center hover:bg-gray-50 transition-colors">
                                    <div className="w-16 h-16 bg-gray-100 rounded-lg flex-shrink-0 relative overflow-hidden border border-gray-200">
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
                                    <div className="flex-grow min-w-0">
                                        <h3 className="font-bold text-gray-900 truncate">{item.product.name}</h3>
                                        {item.selected_options && Object.keys(item.selected_options).length > 0 && (
                                            <div className="flex flex-wrap gap-1 my-1">
                                                {Object.entries(item.selected_options).map(([key, value]) => (
                                                    <span key={key} className="text-[10px] md:text-xs bg-gray-100 text-gray-600 px-2 py-0.5 rounded border border-gray-200">
                                                        {key}: {String(value)}
                                                    </span>
                                                ))}
                                            </div>
                                        )}
                                        <p className="text-xs md:text-sm text-gray-500">SKU: {item.product.sku || item.product.id.slice(0, 8).toUpperCase()}</p>
                                    </div>
                                    <div className="text-right flex-shrink-0">
                                        <p className="font-bold text-gray-900">x{item.quantity}</p>
                                        <p className="text-brand-blue font-bold text-sm md:text-base">KES {parseFloat(item.price).toLocaleString()}</p>
                                    </div>
                                </div>
                            ))}
                        </div>
                        <div className="p-6 bg-gray-50 border-t border-gray-100">
                            <div className="flex justify-between items-center mb-2">
                                <span className="text-gray-600">Subtotal</span>
                                <span className="font-bold text-gray-900">KES {parseFloat(order.total_amount).toLocaleString()}</span>
                            </div>
                            <div className="flex justify-between items-center text-lg font-bold text-brand-blue pt-2 border-t border-gray-200 mt-2">
                                <span>Total Amount</span>
                                <span>KES {parseFloat(order.total_amount).toLocaleString()}</span>
                            </div>
                        </div>
                    </div>

                    {/* Payment Info */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
                            <CreditCard className="text-brand-blue" size={20} /> Payment Details
                        </h2>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Payment Method</p>
                                <p className="font-bold text-gray-900 capitalize">{order.payment_method.replace('_', ' ')}</p>
                            </div>
                            <div>
                                <p className="text-sm text-gray-500 mb-1">Payment Status</p>
                                <div className="flex items-center gap-3">
                                    <span className={`inline-flex items-center gap-1 px-3 py-1 rounded-full text-sm font-bold ${order.is_paid ? 'bg-green-100 text-green-700' : 'bg-orange-100 text-orange-700'}`}>
                                        {order.is_paid ? <CheckCircle size={14} /> : <AlertCircle size={14} />}
                                        {order.is_paid ? 'Paid' : 'Pending Payment'}
                                    </span>
                                    {!order.is_paid && (
                                        <button
                                            onClick={handleMarkAsPaid}
                                            disabled={updating}
                                            className="text-xs font-bold text-brand-blue hover:underline"
                                        >
                                            Mark as Paid
                                        </button>
                                    )}
                                </div>
                            </div>
                            {order.paystack_ref && (
                                <div className="md:col-span-2">
                                    <p className="text-sm text-gray-500 mb-1">Transaction Reference</p>
                                    <p className="font-mono text-sm bg-gray-100 px-3 py-1 rounded inline-block text-gray-700 break-all">
                                        {order.paystack_ref}
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Right Column: Logistics & Customer */}
                <div className="space-y-6">
                    {/* Customer Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
                            <User className="text-brand-blue" size={20} /> Customer Details
                        </h2>
                        <div className="space-y-4">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-blue-50 rounded-full flex items-center justify-center text-brand-blue font-bold">
                                    {order.user?.first_name?.[0] || 'U'}
                                </div>
                                <div className="min-w-0">
                                    <p className="font-bold text-gray-900 truncate">{order.user?.first_name} {order.user?.last_name}</p>
                                    <p className="text-xs text-gray-500">Customer</p>
                                </div>
                            </div>
                            <div className="pt-4 border-t border-gray-50 space-y-3">
                                <a href={`mailto:${order.user?.email}`} className="flex items-center gap-3 text-gray-600 hover:text-brand-blue transition-colors p-2 hover:bg-gray-50 rounded-lg truncate block">
                                    <Mail size={18} className="flex-shrink-0" />
                                    <span className="text-sm truncate">{order.user?.email}</span>
                                </a>
                                <a href={`tel:${order.user?.phone_number}`} className="flex items-center gap-3 text-gray-600 hover:text-brand-blue transition-colors p-2 hover:bg-gray-50 rounded-lg">
                                    <Phone size={18} className="flex-shrink-0" />
                                    <span className="text-sm">{order.user?.phone_number || 'No phone number'}</span>
                                </a>
                            </div>
                        </div>
                    </div>

                    {/* Delivery Card */}
                    <div className="bg-white rounded-2xl shadow-sm border border-gray-100 p-6">
                        <h2 className="font-bold text-lg text-gray-800 flex items-center gap-2 mb-4">
                            <Truck className="text-brand-blue" size={20} /> Delivery Logistics
                        </h2>

                        <div className="mb-4">
                            <p className="text-sm text-gray-500 mb-1">Delivery Address</p>
                            <p className="font-medium text-gray-900">{order.delivery_address}</p>
                        </div>

                        {order.delivery_latitude && order.delivery_longitude ? (
                            <div className="space-y-4">
                                <div className="rounded-xl overflow-hidden border border-gray-200 shadow-inner">
                                    <AddressMap
                                        latitude={order.delivery_latitude}
                                        longitude={order.delivery_longitude}
                                    />
                                </div>

                                <a
                                    href={googleMapsUrl!}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="block w-full bg-brand-blue text-white text-center py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-md flex items-center justify-center gap-2"
                                >
                                    <ExternalLink size={18} /> Open Directions
                                </a>
                                <p className="text-xs text-center text-gray-500">
                                    Opens Google Maps for navigation and distance calculation.
                                </p>
                            </div>
                        ) : (
                            <div className="bg-gray-50 p-4 rounded-lg text-center text-gray-500 text-sm">
                                <MapPin className="mx-auto mb-2 text-gray-400" size={24} />
                                No precise location data available for this order.
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
