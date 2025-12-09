"use client";

import Link from "next/link";
import { useState } from "react";
import { Lock, ArrowRight, Loader2, CheckCircle } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

import { authService } from "@/services/authService";
import { useSearchParams } from "next/navigation";
import { Suspense } from "react";

function ResetPasswordForm() {
    const searchParams = useSearchParams();
    const [loading, setLoading] = useState(false);
    const [success, setSuccess] = useState(false);
    const [formData, setFormData] = useState({
        new_password: "",
        confirm_password: ""
    });

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        const uid = searchParams.get('uid');
        const token = searchParams.get('token');

        if (!uid || !token) {
            alert("Invalid reset link");
            setLoading(false);
            return;
        }

        try {
            await authService.confirmPasswordReset({
                uid,
                token,
                new_password: formData.new_password,
                confirm_password: formData.confirm_password
            });
            setSuccess(true);
        } catch (error) {
            console.error("Failed to reset password", error);
            alert("Failed to reset password. Link may be expired.");
        } finally {
            setLoading(false);
        }
    };

    if (success) {
        return (
            <div className="text-center space-y-6">
                <div className="w-16 h-16 bg-green-100 text-green-600 rounded-full flex items-center justify-center mx-auto">
                    <CheckCircle size={32} />
                </div>
                <div>
                    <h3 className="font-bold text-gray-800 text-lg">Password Reset Successful</h3>
                    <p className="text-gray-500">You can now sign in with your new password.</p>
                </div>
                <Link
                    href="/auth/login"
                    className="block w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors shadow-lg"
                >
                    Sign In
                </Link>
            </div>
        );
    }

    return (
        <form onSubmit={handleSubmit} className="space-y-6">
            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">New Password</label>
                <div className="relative">
                    <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                        type="password"
                        required
                        value={formData.new_password}
                        onChange={(e) => setFormData({ ...formData, new_password: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <div>
                <label className="block text-sm font-bold text-gray-700 mb-2">Confirm Password</label>
                <div className="relative">
                    <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                    <input
                        type="password"
                        required
                        value={formData.confirm_password}
                        onChange={(e) => setFormData({ ...formData, confirm_password: e.target.value })}
                        className="w-full pl-10 pr-4 py-3 bg-gray-50 border border-gray-200 rounded-xl focus:outline-none focus:border-brand-blue focus:ring-1 focus:ring-brand-blue transition-all"
                        placeholder="••••••••"
                    />
                </div>
            </div>

            <button
                type="submit"
                disabled={loading}
                className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-xl disabled:opacity-70 disabled:cursor-not-allowed"
            >
                {loading ? <Loader2 className="animate-spin" size={20} /> : "Reset Password"}
                {!loading && <ArrowRight size={20} />}
            </button>
        </form>
    );
}

export default function ResetPasswordPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-4">
                <div className="bg-white p-8 rounded-2xl shadow-lg border border-gray-100 w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">Reset Password</h1>
                        <p className="text-gray-500">Create a new secure password</p>
                    </div>
                    <Suspense fallback={<div className="flex justify-center"><Loader2 className="animate-spin" /></div>}>
                        <ResetPasswordForm />
                    </Suspense>
                </div>
            </main>
            <Footer />
        </div>
    );
}
