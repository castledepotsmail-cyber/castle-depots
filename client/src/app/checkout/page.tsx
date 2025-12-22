"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useCartStore } from "@/store/cartStore";
import { useState, useEffect } from "react";
import { CheckCircle, CreditCard, Truck } from "lucide-react";
import Link from "next/link";
import { orderService } from "@/services/orderService";
import Image from "next/image";
import dynamic from "next/dynamic";
import { addressService, Address } from "@/services/addressService";
import { useAuthStore } from "@/store/authStore";

const PaystackHandler = dynamic(() => import("@/components/checkout/PaystackHandler"), { ssr: false });
const AddressMap = dynamic(() => import("@/components/common/AddressMap"), {
    ssr: false,
    loading: () => <div className="h-64 w-full bg-gray-100 animate-pulse rounded-lg flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function CheckoutPage() {
    const { items, totalPrice, clearCart } = useCartStore();
    const { user } = useAuthStore();
    const total = totalPrice();
    const [step, setStep] = useState(1);
    const [loading, setLoading] = useState(false);
    const [showPaystack, setShowPaystack] = useState(false);
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [formData, setFormData] = useState<{
        firstName: string;
        lastName: string;
        email: string;
        phone: string;
        address: string;
        city: string;
        county: string;
        paymentMethod: string;
        latitude?: number;
        longitude?: number;
    }>({
        firstName: "",
        lastName: "",
        email: "",
        phone: "",
        address: "",
        city: "",
        county: "",
        paymentMethod: "paystack"
    });

    useEffect(() => {
        if (user) {
            addressService.getAddresses().then(setAddresses).catch(console.error);
            setFormData(prev => ({
                ...prev,
                firstName: user.first_name || "",
                lastName: user.last_name || "",
                email: user.email || "",
                phone: user.phone_number || ""
            }));
        }
    }, [user]);

    const handleSelectAddress = (addr: Address) => {
        setFormData(prev => ({
            ...prev,
            firstName: addr.full_name.split(" ")[0] || prev.firstName,
            lastName: addr.full_name.split(" ").slice(1).join(" ") || prev.lastName,
            phone: addr.phone_number,
            address: addr.street_address,
            city: addr.city,
            county: addr.postal_code || prev.county,
            latitude: addr.latitude,
            longitude: addr.longitude
        }));
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        setFormData({ ...formData, [e.target.name]: e.target.value });
    };

    const handlePayment = async () => {
        if (formData.paymentMethod === 'paystack') {
            setShowPaystack(true);
        } else {
            await processOrder();
        }
    };

    const [shippingCost, setShippingCost] = useState(0);
    const [shippingDistance, setShippingDistance] = useState(0);
    const [calculatingShipping, setCalculatingShipping] = useState(false);

    useEffect(() => {
        const calculate = async () => {
            if (formData.latitude && formData.longitude) {
                setCalculatingShipping(true);
                try {
                    const data = await orderService.calculateShipping(formData.latitude, formData.longitude);
                    if (data.error) {
                        // toast.error(data.error); // Optional: notify user
                        setShippingCost(0);
                    } else {
                        setShippingCost(data.cost);
                        setShippingDistance(data.distance);
                    }
                } catch (error) {
                    console.error("Shipping calculation failed", error);
                } finally {
                    setCalculatingShipping(false);
                }
            }
        };
        calculate();
    }, [formData.latitude, formData.longitude]);

    const finalTotal = total + shippingCost;

    const processOrder = async (reference?: string) => {
        setLoading(true);
        try {
            const orderData = {
                payment_method: formData.paymentMethod,
                total_amount: finalTotal,
                shipping_cost: shippingCost,
                delivery_address: `${formData.address}, ${formData.city}, ${formData.county}`,
                delivery_latitude: formData.latitude,
                delivery_longitude: formData.longitude,
                items: items.map(item => ({
                    product_id: item.id,
                    quantity: item.quantity,
                    selected_options: item.selectedOptions || {}
                })),
                paystack_ref: reference,
                is_paid: !!reference
            };

            await orderService.createOrder(orderData);
            setStep(3);
            clearCart();
        } catch (error: any) {
            console.error("Order creation failed", error);
            if (error.response) {
                console.error("Server Error Data:", error.response.data);
                alert(`Failed to place order: ${JSON.stringify(error.response.data)}`);
            } else {
                alert("Failed to place order. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    const config = {
        reference: (new Date()).getTime().toString(),
        email: formData.email,
        amount: finalTotal * 100, // Paystack expects amount in kobo/cents
        currency: 'KES',
        publicKey: process.env.NEXT_PUBLIC_PAYSTACK_PUBLIC_KEY || 'pk_test_1867c5794041877b51043f44775ebc1d50b3a462',
    };

    if (items.length === 0 && step !== 3) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <main className="container mx-auto px-4 py-20 text-center flex-grow">
                    <h2 className="text-2xl font-bold text-gray-400 mb-4">Your cart is empty</h2>
                    <Link href="/shop" className="text-brand-blue hover:underline">Return to Shop</Link>
                </main>
                <Footer />
            </div>
        );
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-8 flex-grow">
                <h1 className="font-display text-3xl font-bold text-gray-800 mb-8 text-center">Checkout</h1>

                {showPaystack && (
                    <PaystackHandler
                        config={config}
                        onSuccess={(reference: any) => {
                            setShowPaystack(false);
                            processOrder(reference.reference);
                        }}
                        onClose={() => {
                            setShowPaystack(false);
                            alert("Payment cancelled.");
                        }}
                    />
                )}

                {step === 3 ? (
                    <div className="max-w-md mx-auto bg-white p-8 rounded-2xl shadow-lg text-center">
                        <div className="w-20 h-20 bg-green-100 text-green-500 rounded-full flex items-center justify-center mx-auto mb-6">
                            <CheckCircle size={40} />
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">Order Confirmed!</h2>
                        <p className="text-gray-600 mb-8">
                            Thank you for your purchase. Your order has been placed successfully.
                        </p>
                        <Link href="/shop" className="block w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-brand-gold hover:text-brand-blue transition-colors">
                            Continue Shopping
                        </Link>
                    </div>
                ) : (
                    <div className="flex flex-col lg:flex-row gap-8 max-w-6xl mx-auto">
                        {/* Left Column: Forms */}
                        <div className="lg:w-2/3">
                            {/* Steps Indicator */}
                            <div className="flex items-center mb-8">
                                <div className={`flex items-center gap-2 ${step >= 1 ? 'text-brand-blue font-bold' : 'text-gray-400'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 1 ? 'border-brand-blue bg-blue-50' : 'border-gray-300'}`}>1</div>
                                    <span>Delivery</span>
                                </div>
                                <div className="w-12 h-0.5 bg-gray-300 mx-4"></div>
                                <div className={`flex items-center gap-2 ${step >= 2 ? 'text-brand-blue font-bold' : 'text-gray-400'}`}>
                                    <div className={`w-8 h-8 rounded-full flex items-center justify-center border-2 ${step >= 2 ? 'border-brand-blue bg-blue-50' : 'border-gray-300'}`}>2</div>
                                    <span>Payment</span>
                                </div>
                            </div>

                            {step === 1 && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <Truck className="text-brand-blue" /> Delivery Details
                                    </h2>

                                    {/* Saved Addresses */}
                                    {addresses.length > 0 && (
                                        <div className="mb-6">
                                            <h3 className="text-sm font-bold text-gray-700 mb-3">Saved Addresses</h3>
                                            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                                                {addresses.map(addr => (
                                                    <div
                                                        key={addr.id}
                                                        onClick={() => handleSelectAddress(addr)}
                                                        className={`p-3 border rounded-lg cursor-pointer transition-colors ${formData.address === addr.street_address ? 'border-brand-blue bg-blue-50' : 'border-gray-200 hover:border-brand-blue'}`}
                                                    >
                                                        <div className="flex justify-between items-start">
                                                            <span className="font-bold text-gray-800 text-sm">{addr.title}</span>
                                                            {addr.is_default && <span className="text-xs bg-brand-blue text-white px-1.5 py-0.5 rounded">Default</span>}
                                                        </div>
                                                        <p className="text-xs text-gray-600 mt-1">
                                                            {addr.full_name}<br />
                                                            {addr.street_address}, {addr.city}
                                                        </p>
                                                    </div>
                                                ))}
                                            </div>
                                            <div className="relative flex py-5 items-center">
                                                <div className="flex-grow border-t border-gray-200"></div>
                                                <span className="flex-shrink-0 mx-4 text-gray-400 text-xs uppercase">Or enter new address</span>
                                                <div className="flex-grow border-t border-gray-200"></div>
                                            </div>
                                        </div>
                                    )}

                                    <div className="space-y-4">
                                        <div>
                                            <label className="block text-sm font-bold text-gray-700 mb-1">Pin Location on Map</label>
                                            <p className="text-xs text-gray-500 mb-2">Click on the map to set the exact delivery location.</p>
                                            <AddressMap
                                                latitude={formData.latitude}
                                                longitude={formData.longitude}
                                                onLocationSelect={(lat, lng) => setFormData(prev => ({ ...prev, latitude: lat, longitude: lng }))}
                                            />
                                            {formData.latitude && (
                                                <p className="text-xs text-green-600 mt-1">Location selected: {formData.latitude.toFixed(6)}, {formData.longitude?.toFixed(6)}</p>
                                            )}
                                        </div>

                                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                            <input name="firstName" value={formData.firstName} onChange={handleInputChange} type="text" placeholder="First Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                                            <input name="lastName" value={formData.lastName} onChange={handleInputChange} type="text" placeholder="Last Name" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                                            <input name="email" value={formData.email} onChange={handleInputChange} type="email" placeholder="Email Address" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue md:col-span-2" />
                                            <input name="phone" value={formData.phone} onChange={handleInputChange} type="text" placeholder="Phone Number (M-Pesa)" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue md:col-span-2" />
                                            <input name="address" value={formData.address} onChange={handleInputChange} type="text" placeholder="Street Address / Location" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue md:col-span-2" />
                                            <input name="city" value={formData.city} onChange={handleInputChange} type="text" placeholder="City / Town" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                                            <input name="county" value={formData.county} onChange={handleInputChange} type="text" placeholder="County" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                                        </div>
                                    </div>
                                    <button
                                        onClick={() => setStep(2)}
                                        className="w-full bg-brand-blue text-white py-4 rounded-xl font-bold hover:bg-blue-700 transition-colors"
                                    >
                                        Continue to Payment
                                    </button>
                                </div>
                            )}

                            {step === 2 && (
                                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 space-y-6">
                                    <h2 className="text-xl font-bold flex items-center gap-2">
                                        <CreditCard className="text-brand-blue" /> Payment Method
                                    </h2>

                                    <div className="space-y-3">
                                        <label className="flex items-center gap-4 p-4 border border-brand-blue bg-blue-50 rounded-xl cursor-pointer">
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="paystack"
                                                checked={formData.paymentMethod === 'paystack'}
                                                onChange={handleInputChange}
                                                className="text-brand-blue focus:ring-brand-blue"
                                            />
                                            <div className="flex-grow">
                                                <span className="font-bold block text-gray-900">Paystack (Card / M-Pesa)</span>
                                                <span className="text-sm text-gray-500">Secure payment via M-Pesa or Credit Card</span>
                                            </div>
                                        </label>

                                        <label className={`flex items-center gap-4 p-4 border rounded-xl cursor-pointer transition-colors ${(formData.city.toLowerCase().includes('nairobi') || formData.county.toLowerCase().includes('nairobi'))
                                            ? 'border-gray-200 hover:bg-gray-50'
                                            : 'border-gray-100 bg-gray-50 opacity-60 cursor-not-allowed'
                                            }`}>
                                            <input
                                                type="radio"
                                                name="paymentMethod"
                                                value="pod"
                                                checked={formData.paymentMethod === 'pod'}
                                                onChange={handleInputChange}
                                                disabled={!(formData.city.toLowerCase().includes('nairobi') || formData.county.toLowerCase().includes('nairobi'))}
                                                className="text-brand-blue focus:ring-brand-blue"
                                            />
                                            <div>
                                                <span className="font-bold block text-gray-900">Pay on Delivery</span>
                                                <span className="text-sm text-gray-500">Pay via M-Pesa upon receipt (Nairobi Only)</span>
                                                {!(formData.city.toLowerCase().includes('nairobi') || formData.county.toLowerCase().includes('nairobi')) && (
                                                    <span className="block text-xs text-red-500 mt-1 font-semibold">Not available for your location. Only available in Nairobi.</span>
                                                )}
                                            </div>
                                        </label>
                                    </div>

                                    <button
                                        onClick={handlePayment}
                                        disabled={loading}
                                        className="w-full bg-brand-gold text-brand-blue py-4 rounded-xl font-bold hover:bg-yellow-400 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                                    >
                                        {loading ? "Processing..." : `Pay KES ${finalTotal.toLocaleString()}`}
                                    </button>
                                    <button
                                        onClick={() => setStep(1)}
                                        className="w-full text-gray-500 py-2 font-semibold hover:text-gray-800"
                                    >
                                        Back to Delivery
                                    </button>
                                </div>
                            )}
                        </div>

                        {/* Right Column: Order Summary */}
                        <div className="lg:w-1/3">
                            <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 sticky top-24">
                                <h3 className="font-bold text-lg mb-4">Order Summary</h3>
                                <div className="space-y-4 max-h-60 overflow-y-auto mb-4 pr-2">
                                    {items.map(item => (
                                        <div key={item.cartItemId} className="flex gap-3 text-sm">
                                            <div className="w-12 h-12 bg-gray-100 rounded flex-shrink-0 relative overflow-hidden">
                                                {item.image ? (
                                                    <Image
                                                        src={item.image}
                                                        alt={item.name}
                                                        fill
                                                        className="object-cover"
                                                    />
                                                ) : (
                                                    <div className="w-full h-full flex items-center justify-center text-xs text-gray-400">No Img</div>
                                                )}
                                            </div>
                                            <div className="flex-grow">
                                                <p className="font-semibold text-gray-800 line-clamp-1">{item.name}</p>
                                                {item.selectedOptions && Object.keys(item.selectedOptions).length > 0 && (
                                                    <div className="text-xs text-gray-500">
                                                        {Object.entries(item.selectedOptions).map(([k, v]) => `${k}: ${v}`).join(', ')}
                                                    </div>
                                                )}
                                                <p className="text-gray-500">Qty: {item.quantity}</p>
                                            </div>
                                            <p className="font-bold">KES {((item.discountPrice || item.price) * item.quantity).toLocaleString()}</p>
                                        </div>
                                    ))}
                                </div>
                                <div className="border-t border-gray-100 pt-4 space-y-2">
                                    <div className="flex justify-between text-gray-600">
                                        <span>Subtotal</span>
                                        <span>KES {total.toLocaleString()}</span>
                                    </div>
                                    <div className="flex justify-between text-gray-600">
                                        <span>Shipping {shippingDistance > 0 && <span className="text-xs text-gray-400">({shippingDistance.toFixed(1)} km)</span>}</span>
                                        <span>{calculatingShipping ? 'Calculating...' : (shippingCost > 0 ? `KES ${shippingCost.toLocaleString()}` : 'Free')}</span>
                                    </div>
                                    <div className="flex justify-between font-bold text-xl text-brand-blue pt-2">
                                        <span>Total</span>
                                        <span>KES {finalTotal.toLocaleString()}</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                )}
            </main>

            <Footer />
        </div>
    );
}
