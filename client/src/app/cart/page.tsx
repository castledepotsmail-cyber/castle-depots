import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CartClient from "./CartClient";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

export default function CartPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <h1 className="font-display text-3xl font-bold text-gray-800 mb-8">Shopping Cart</h1>
                <Suspense fallback={
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-brand-blue" size={48} />
                    </div>
                }>
                    <CartClient />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
