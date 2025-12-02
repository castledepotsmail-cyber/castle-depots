"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { Mail, Phone, MapPin, Send } from "lucide-react";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-12 flex-grow">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">Get in Touch</h1>
                        <p className="text-gray-500">We'd love to hear from you. Our team is always here to chat.</p>
                    </div>

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
                                    <a href="mailto:support@castledepots.co.ke" className="text-brand-blue font-bold hover:underline">support@castledepots.co.ke</a>
                                </div>
                            </div>

                            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-start gap-4">
                                <div className="bg-blue-50 text-brand-blue p-3 rounded-lg">
                                    <Phone size={24} />
                                </div>
                                <div>
                                    <h3 className="font-bold text-gray-800 mb-1">Phone</h3>
                                    <p className="text-sm text-gray-600 mb-2">Mon-Fri from 8am to 5pm.</p>
                                    <a href="tel:+254712345678" className="text-brand-blue font-bold hover:underline">+254 712 345 678</a>
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
                            <form className="space-y-6">
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">First Name</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue" placeholder="John" />
                                    </div>
                                    <div>
                                        <label className="block text-sm font-bold text-gray-700 mb-2">Last Name</label>
                                        <input type="text" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue" placeholder="Doe" />
                                    </div>
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                    <input type="email" className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue" placeholder="you@example.com" />
                                </div>

                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-2">Message</label>
                                    <textarea className="w-full px-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue h-32" placeholder="How can we help you?"></textarea>
                                </div>

                                <button className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg">
                                    <Send size={20} /> Send Message
                                </button>
                            </form>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
