"use client";

import Link from "next/link";
import { useState } from "react";
import { User, Lock, ArrowRight, Loader2 } from "lucide-react";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { authService } from "@/services/authService";
import { useRouter } from "next/navigation";
import FloatingBackground from "@/components/auth/FloatingBackground";
import Image from "next/image";

function GoogleIcon() {
    return (
        <svg width="20" height="20" viewBox="0 0 24 24">
            <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" />
            <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" />
            <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" />
            <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" />
        </svg>
    );
}

export default function LoginPage() {
    const [loading, setLoading] = useState(false);
    const [googleLoading, setGoogleLoading] = useState(false);
    const router = useRouter();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);
        const formData = new FormData(e.currentTarget as HTMLFormElement);
        const username = formData.get("username") as string;
        const password = formData.get("password") as string;

        try {
            await authService.login(username, password);
            router.push("/dashboard");
        } catch (error) {
            console.error("Login failed", error);
            alert("Login failed. Please check your credentials.");
        } finally {
            setLoading(false);
        }
    };

    const handleGoogleSignIn = async () => {
        setGoogleLoading(true);
        try {
            await authService.googleAuth();
            router.push("/dashboard");
        } catch (error) {
            console.error("Google sign in failed", error);
            alert("Google sign in failed. Please try again.");
        } finally {
            setGoogleLoading(false);
        }
    };

    return (
        <FloatingBackground>
            <Navbar />

            <main className="flex-grow flex items-center justify-center p-4">
                <div className="relative bg-gray-900/80 backdrop-blur-md p-8 rounded-3xl shadow-[0_35px_60px_-15px_rgba(0,0,0,0.6)] border border-white/10 w-full max-w-md transform transition-all hover:scale-[1.01] overflow-hidden group">

                    {/* Card Background Image & Overlay */}
                    <div className="absolute inset-0 z-0">
                        <Image
                            src="/images/auth_background.png"
                            alt="Card Background"
                            fill
                            className="object-cover opacity-40 transition-transform duration-1000 group-hover:scale-110"
                            priority
                            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        />
                        <div className="absolute inset-0 bg-gradient-to-b from-gray-900/50 via-gray-900/80 to-gray-900"></div>
                    </div>

                    {/* Content */}
                    <div className="relative z-10">
                        <div className="text-center mb-8">
                            <h1 className="font-display text-3xl font-bold text-white mb-2 drop-shadow-md">Welcome Back</h1>
                            <p className="text-gray-300">Sign in to access your account</p>
                        </div>

                        <button
                            type="button"
                            onClick={handleGoogleSignIn}
                            disabled={googleLoading}
                            className="w-full bg-white text-gray-800 py-3 rounded-xl font-bold hover:bg-gray-100 transition-colors flex items-center justify-center gap-3 mb-6 shadow-lg"
                        >
                            {googleLoading ? <Loader2 className="animate-spin" size={20} /> : <GoogleIcon />}
                            Continue with Google
                        </button>

                        <div className="relative mb-6">
                            <div className="absolute inset-0 flex items-center">
                                <div className="w-full border-t border-gray-600"></div>
                            </div>
                            <div className="relative flex justify-center text-sm">
                                <span className="px-4 bg-transparent text-gray-400">Or sign in with email</span>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="space-y-6">
                            <div>
                                <label className="block text-sm font-bold text-gray-300 mb-2">Username</label>
                                <div className="relative">
                                    <User className="absolute top-3 left-3 text-gray-400" size={20} />
                                    <input
                                        name="username"
                                        type="text"
                                        required
                                        autoComplete="username"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all placeholder-gray-500"
                                        placeholder="johndoe"
                                    />
                                </div>
                            </div>

                            <div>
                                <div className="flex justify-between items-center mb-2">
                                    <label className="block text-sm font-bold text-gray-300">Password</label>
                                    <Link href="/auth/forgot-password" className="text-xs text-brand-gold font-semibold hover:underline">
                                        Forgot Password?
                                    </Link>
                                </div>
                                <div className="relative">
                                    <Lock className="absolute top-3 left-3 text-gray-400" size={20} />
                                    <input
                                        name="password"
                                        type="password"
                                        required
                                        autoComplete="current-password"
                                        className="w-full pl-10 pr-4 py-3 bg-gray-800/50 border border-gray-600 text-white rounded-xl focus:outline-none focus:border-brand-gold focus:ring-1 focus:ring-brand-gold transition-all placeholder-gray-500"
                                        placeholder="••••••••"
                                    />
                                </div>
                            </div>

                            <button
                                type="submit"
                                disabled={loading}
                                className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-600 transition-colors flex items-center justify-center gap-2 shadow-lg hover:shadow-brand-blue/50 disabled:opacity-70 disabled:cursor-not-allowed"
                            >
                                {loading ? <Loader2 className="animate-spin" size={20} /> : "Sign In"}
                                {!loading && <ArrowRight size={20} />}
                            </button>
                        </form>

                        <div className="mt-8 text-center">
                            <p className="text-gray-400 text-sm">
                                Don't have an account?{" "}
                                <Link href="/auth/register" className="text-brand-gold font-bold hover:underline">
                                    Create Account
                                </Link>
                            </p>
                        </div>
                    </div>
                </div>
            </main>

            <Footer />
        </FloatingBackground>
    );
}
