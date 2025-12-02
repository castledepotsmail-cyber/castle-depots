import Link from "next/link";
import { Home } from "lucide-react";

export default function NotFound() {
    return (
        <div className="min-h-screen flex flex-col items-center justify-center bg-gray-50 text-center px-4">
            <h1 className="font-display text-9xl font-bold text-brand-blue mb-4">404</h1>
            <h2 className="text-2xl font-bold text-gray-800 mb-2">Page Not Found</h2>
            <p className="text-gray-500 mb-8 max-w-md">
                Oops! The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
            </p>
            <Link
                href="/"
                className="bg-brand-blue text-white px-8 py-3 rounded-full font-bold hover:bg-brand-gold hover:text-brand-blue transition-colors flex items-center gap-2"
            >
                <Home size={20} /> Back to Home
            </Link>
        </div>
    );
}
