"use client";

import { motion } from "framer-motion";

interface CastleLoaderProps {
    size?: "sm" | "md" | "lg" | "xl";
    className?: string;
    fullScreen?: boolean;
    text?: string;
}

export default function CastleLoader({
    size = "md",
    className = "",
    fullScreen = false,
    text
}: CastleLoaderProps) {

    const sizeMap = {
        sm: "w-5 h-5",
        md: "w-10 h-10",
        lg: "w-16 h-16",
        xl: "w-24 h-24"
    };

    const containerSize = sizeMap[size];

    const loaderContent = (
        <div className={`flex flex-col items-center justify-center gap-4 ${className}`}>
            <div className={`relative ${containerSize}`}>
                {/* Outer Ring - Gold */}
                <motion.span
                    className="absolute inset-0 border-4 border-brand-gold/30 border-t-brand-gold rounded-full"
                    animate={{ rotate: 360 }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
                />

                {/* Inner Ring - Blue */}
                <motion.span
                    className="absolute inset-2 border-4 border-brand-blue/30 border-b-brand-blue rounded-full"
                    animate={{ rotate: -360 }}
                    transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />

                {/* Center Dot - Pulse */}
                <motion.div
                    className="absolute inset-[42%] bg-brand-blue rounded-full"
                    animate={{ scale: [0.8, 1.2, 0.8], opacity: [0.5, 1, 0.5] }}
                    transition={{ duration: 1.5, repeat: Infinity, ease: "easeInOut" }}
                />
            </div>
            {text && (
                <motion.p
                    initial={{ opacity: 0 }}
                    animate={{ opacity: 1 }}
                    className="text-brand-blue font-bold text-sm tracking-wider animate-pulse"
                >
                    {text}
                </motion.p>
            )}
        </div>
    );

    if (fullScreen) {
        return (
            <div className="fixed inset-0 bg-white/5 backdrop-blur-[1px] z-50 flex items-center justify-center">
                {loaderContent}
            </div>
        );
    }

    return loaderContent;
}
