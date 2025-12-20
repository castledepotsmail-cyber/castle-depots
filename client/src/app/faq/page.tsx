import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import FAQList from "./FAQList";
import { HelpCircle } from "lucide-react";

export default function FAQPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-12 flex-grow">
                <div className="max-w-3xl mx-auto">
                    <div className="text-center mb-12">
                        <div className="w-16 h-16 bg-blue-100 text-brand-blue rounded-full flex items-center justify-center mx-auto mb-4">
                            <HelpCircle size={32} />
                        </div>
                        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">Frequently Asked Questions</h1>
                        <p className="text-gray-500">Find answers to common questions about our services.</p>
                    </div>

                    <FAQList />

                    <div className="mt-12 text-center bg-blue-50 p-8 rounded-2xl">
                        <h3 className="font-bold text-lg text-gray-800 mb-2">Still have questions?</h3>
                        <p className="text-gray-600 mb-6">Can't find the answer you're looking for? Please chat to our friendly team.</p>
                        <a href="/contact" className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors">
                            Contact Us
                        </a>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
