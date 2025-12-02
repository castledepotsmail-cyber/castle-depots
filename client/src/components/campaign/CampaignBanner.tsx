"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { Timer } from "lucide-react";

export default function CampaignBanner() {
    const [timeLeft, setTimeLeft] = useState({
        hours: 12,
        minutes: 45,
        seconds: 30,
    });

    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev.seconds > 0) {
                    return { ...prev, seconds: prev.seconds - 1 };
                } else if (prev.minutes > 0) {
                    return { ...prev, minutes: prev.minutes - 1, seconds: 59 };
                } else if (prev.hours > 0) {
                    return { ...prev, hours: prev.hours - 1, minutes: 59, seconds: 59 };
                } else {
                    return prev;
                }
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    return (
        <div className="bg-red-600 text-white py-3 px-4 flex flex-col md:flex-row justify-between items-center gap-2">
            <div className="flex items-center gap-2">
                <span className="bg-white text-red-600 px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider animate-pulse">
                    Flash Sale
                </span>
                <p className="font-bold text-sm md:text-base">
                    Get 50% OFF on all Kitchenware! Limited time only.
                </p>
            </div>

            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 font-mono font-bold text-lg">
                    <Timer size={20} className="mr-1" />
                    <span>{String(timeLeft.hours).padStart(2, '0')}</span>:
                    <span>{String(timeLeft.minutes).padStart(2, '0')}</span>:
                    <span>{String(timeLeft.seconds).padStart(2, '0')}</span>
                </div>
                <Link
                    href="/shop"
                    className="bg-white text-red-600 px-4 py-1 rounded-full text-sm font-bold hover:bg-gray-100 transition-colors"
                >
                    Shop Now
                </Link>
            </div>
        </div>
    );
}
