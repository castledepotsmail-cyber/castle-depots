"use client";

import Link from "next/link";
import { useState } from "react";
import { Mail, ArrowRight, Loader2, ArrowLeft } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ForgotPasswordPage() {
    const [loading, setLoading] = useState(false);
    const [sent, setSent] = useState(false);

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        // Simulate API call
        setTimeout(() => {
            setLoading(false);
            setSent(true);
        }, 2000);
    };

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
                    <div className="mb-6">
                        <Link href="/auth/login" className="text-gray-500 hover:text-brand-blue flex items-center gap-2 text-sm font-semibold transition-colors">
                            <ArrowLeft size={16} /> Back to Login
                        </Link>
                    </div>

                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">Forgot Password?</h1>
                        <p className="text-gray-500">Enter your email to receive reset instructions</p>
                    </div>

                    {sent ? (
                        <div className="text-center space-y-6">
                            <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                                <Mail size={32} />
                            </div>
                            <div>
                                <h3 className="font-bold text-gray-800 text-lg">Check your email</h3>
                                <p className="text-gray-500">We have sent a password reset link to your email address.</p>
                            </div>
                            <button
                                onClick={() => setSent(false)}
                                className="text-brand-blue font-bold hover:underline"
                            >
                                Try another email
                            </button>
                        </div>
                    ) : (
                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-2">Email Address</label>
                                <div className="relative">
                                    <Mail className="absolute top-3 left-3 text-gray-400" size={20} />
                                    <input
                                        type="email"
                                        required
                                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                                        placeholder="you@example.com"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Send Reset Link"}
                                {!loading && <ArrowRight size={20} />}
                            </button>
                        </form>
                    )}
                </div>
            </main>

            <Footer />
        </div>
    );
}
