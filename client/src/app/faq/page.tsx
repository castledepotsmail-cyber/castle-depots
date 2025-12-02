"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import { useState } from "react";
import { ChevronDown, ChevronUp, HelpCircle } from "lucide-react";

const FAQS = [
    {
        question: "How long does delivery take?",
        answer: "Delivery typically takes 2-3 business days within Nairobi and 3-5 business days for other regions in Kenya."
    },
    {
        question: "Do you offer Pay on Delivery?",
        answer: "Yes, we offer Pay on Delivery for orders within Nairobi. For other regions, we require a partial deposit or full payment via M-Pesa."
    },
    {
        question: "What is your return policy?",
        answer: "We accept returns within 7 days of delivery if the item is unused and in its original packaging. Please visit our Returns Policy page for more details."
    },
    {
        question: "How can I track my order?",
        answer: "You can track your order by visiting the 'Track Order' page and entering your Order ID. You will also receive SMS updates."
    },
    {
        question: "Do you sell in wholesale?",
        answer: "Yes, we offer wholesale pricing for bulk orders, especially for catering equipment. Please contact our sales team for a quote."
    }
];

export default function FAQPage() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

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

                    <div className="space-y-4">
                        {FAQS.map((faq, index) => (
                            <div key={index} className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                                <button
                                    className="w-full px-6 py-4 text-left flex justify-between items-center hover:bg-gray-50 transition-colors"
                                    onClick={() => setOpenIndex(openIndex === index ? null : index)}
                                >
                                    <span className="font-bold text-gray-800">{faq.question}</span>
                                    {openIndex === index ? <ChevronUp className="text-brand-blue" /> : <ChevronDown className="text-gray-400" />}
                                </button>
                                {openIndex === index && (
                                    <div className="px-6 pb-4 text-gray-600 border-t border-gray-50 pt-4">
                                        {faq.answer}
                                    </div>
                                )}
                            </div>
                        ))}
                    </div>

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
