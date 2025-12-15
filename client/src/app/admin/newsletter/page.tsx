"use client";

import { useState } from "react";
import { toast } from "react-hot-toast";
import api from "@/lib/api";
import { Send, Loader2 } from "lucide-react";

export default function NewsletterPage() {
    const [subject, setSubject] = useState("");
    const [message, setMessage] = useState("");
    const [loading, setLoading] = useState(false);
    const [testEmail, setTestEmail] = useState("");

    const handleSend = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!confirm("Are you sure you want to send this newsletter?")) return;

        setLoading(true);
        try {
            await api.post('/communication/newsletter/send_blast/', {
                subject,
                message,
                test_email: testEmail || undefined
            });
            toast.success(testEmail ? "Test newsletter sent!" : "Newsletter blast sent successfully!");
            if (!testEmail) {
                setSubject("");
                setMessage("");
            }
        } catch (error) {
            toast.error("Failed to send newsletter.");
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold mb-6">Send Newsletter</h1>

            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 max-w-4xl">
                <form onSubmit={handleSend} className="space-y-6">
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Subject Line</label>
                        <input
                            type="text"
                            value={subject}
                            onChange={(e) => setSubject(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                            placeholder="e.g., Big Summer Sale Starts Now!"
                            required
                        />
                    </div>

                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">Message Content (HTML)</label>
                        <p className="text-xs text-gray-500 mb-2">Basic HTML tags supported: &lt;p&gt;, &lt;b&gt;, &lt;br&gt;, etc.</p>
                        <textarea
                            value={message}
                            onChange={(e) => setMessage(e.target.value)}
                            className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none h-64 font-mono text-sm"
                            placeholder="<p>Hello valued customer,</p>..."
                            required
                        />
                    </div>

                    <div className="pt-4 border-t border-gray-100">
                        <label className="block text-sm font-medium text-gray-700 mb-1">Test Email (Optional)</label>
                        <div className="flex gap-4">
                            <input
                                type="email"
                                value={testEmail}
                                onChange={(e) => setTestEmail(e.target.value)}
                                className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue outline-none"
                                placeholder="Enter email to send test only"
                            />
                        </div>
                        <p className="text-xs text-gray-500 mt-1">If provided, the newsletter will ONLY be sent to this email.</p>
                    </div>

                    <div className="flex justify-end pt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="flex items-center gap-2 bg-brand-blue text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50 font-medium"
                        >
                            {loading ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
                            {testEmail ? 'Send Test' : 'Send to All Subscribers'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
}
