"use client";

import { Mail, Phone, MapPin, Send, CheckCircle } from "lucide-react";
import CastleLoader from "@/components/ui/CastleLoader";
import { useState } from "react";
import api from "@/lib/api";

export default function ContactForm() {
    const [formData, setFormData] = useState({
        firstName: "",
        lastName: "",
        email: "",
        message: ""
    });
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        try {
            await api.post('/communication/contact/', {
                name: `${formData.firstName} ${formData.lastName}`,
                email: formData.email,
                subject: "Contact Form Submission",
                message: formData.message
            });
            setSuccess(true);
            setFormData({ firstName: "", lastName: "", email: "", message: "" });
        } catch (error) {
            console.error("Failed to send message", error);
            alert("Failed to send message. Please try again.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {/* Contact Info */}
            <div className="space-y-6">
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                    <div className="bg-blue-50 text-brand-blue p-3 rounded-lg">
                        <Mail size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Email</h3>
                        <p className="text-sm text-gray-600 mb-2">Our friendly team is here to help.</p>
                        <a href="mailto:castledepotsmail@gmail.com" className="text-brand-blue font-bold hover:underline">castledepotsmail@gmail.com</a>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                    <div className="bg-blue-50 text-brand-blue p-3 rounded-lg">
                        <Phone size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
                        <p className="text-sm text-gray-600 mb-2">Mon-Fri from 8am to 5pm.</p>
                        <div className="flex flex-col">
                            <a href="tel:0700578820" className="text-brand-blue font-bold hover:underline">0700578820</a>
                            <a href="tel:0111731613" className="text-brand-blue font-bold hover:underline">0111731613</a>
                        </div>
                    </div>
                </div>

                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                    <div className="bg-blue-50 text-brand-blue p-3 rounded-lg">
                        <MapPin size={24} />
                    </div>
                    <div>
                        <h3 className="font-bold text-gray-800 mb-1">Office</h3>
                        <p className="text-sm text-gray-600 mb-2">Come say hello at our office HQ.</p>
                        <p className="text-gray-800 font-medium">Mombasa Road, Nairobi, Kenya</p>
                    </div>
                </div>
            </div>

            {/* Contact Form */}
            <div className="md:col-span-2 bg-white p-8 rounded-2xl shadow-sm border border-gray-100">
                {success ? (
                    <div className="text-center py-12">
                        <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CheckCircle size={32} />
                        </div>
                        <h3 className="text-2xl font-bold text-gray-800 mb-2">Message Sent!</h3>
                        <p className="text-gray-600 mb-6">Thank you for contacting us. We'll get back to you shortly.</p>
                        <button onClick={() => setSuccess(false)} className="text-brand-blue font-bold hover:underline">Send another message</button>
                    </div>
                ) : (
                    <form onSubmit={handleSubmit} className="space-y-6">
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.firstName}
                                    onChange={(e) => setFormData({ ...formData, firstName: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue"
                                    placeholder="John"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.lastName}
                                    onChange={(e) => setFormData({ ...formData, lastName: e.target.value })}
                                    className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue"
                                    placeholder="Doe"
                                />
                            </div>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                            <input
                                type="email"
                                required
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue"
                                placeholder="you@example.com"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                            <textarea
                                required
                                value={formData.message}
                                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                                className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue h-32"
                                placeholder="How can we help you?"
                            ></textarea>
                        </div>

                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50"
                        >
                            {loading ? <CastleLoader size="sm" /> : <Send size={20} />}
                            {loading ? "Sending..." : "Send Message"}
                        </button>
                    </form>
                )}
            </div>
        </div>
    );
}
