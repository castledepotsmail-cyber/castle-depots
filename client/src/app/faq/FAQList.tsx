"use client";

import { useState } from "react";
import { ChevronDown, ChevronUp } from "lucide-react";

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

export default function FAQList() {
    const [openIndex, setOpenIndex] = useState<number | null>(0);

    return (
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
    );
}
