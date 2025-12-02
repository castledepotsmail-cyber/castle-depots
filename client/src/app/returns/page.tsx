"use client";

import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

export default function ReturnsPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-12 flex-grow">
                <div className="bg-white p-8 md:p-12 rounded-2xl shadow-sm border border-gray-100 max-w-4xl mx-auto">
                    <h1 className="font-display text-3xl font-bold text-gray-800 mb-8">Returns & Refunds Policy</h1>

                    <div className="prose prose-blue max-w-none text-gray-600">
                        <p className="mb-4">Last updated: November 29, 2025</p>

                        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">1. Return Eligibility</h2>
                        <p>
                            We want you to be completely satisfied with your purchase. If you are not satisfied, you may return the item within 7 days of delivery for a full refund or exchange, provided that:
                        </p>
                        <ul className="list-disc pl-6 space-y-2 mb-4">
                            <li>The item is unused and in the same condition that you received it.</li>
                            <li>The item is in the original packaging.</li>
                            <li>You have the receipt or proof of purchase.</li>
                        </ul>

                        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">2. Non-Returnable Items</h2>
                        <p>
                            Certain types of items cannot be returned, like perishable goods (such as food, flowers, or plants), custom products (such as special orders or personalized items), and personal care goods (such as beauty products).
                        </p>

                        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">3. Refund Process</h2>
                        <p>
                            Once your return is received and inspected, we will send you an email to notify you that we have received your returned item. We will also notify you of the approval or rejection of your refund.
                            If you are approved, then your refund will be processed, and a credit will automatically be applied to your credit card or original method of payment, within a certain amount of days.
                        </p>

                        <h2 className="text-xl font-bold text-gray-800 mt-8 mb-4">4. Shipping Returns</h2>
                        <p>
                            To return your product, you should mail your product to: Castle Depots HQ, Mombasa Road, Nairobi.
                            You will be responsible for paying for your own shipping costs for returning your item. Shipping costs are non-refundable.
                        </p>
                    </div>
                </div>
            </main>

            <Footer />
        </div>
    );
}
