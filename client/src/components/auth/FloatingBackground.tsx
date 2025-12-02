"use client";

import { motion } from "framer-motion";
import { ShoppingBag, ShoppingCart, Gift, Tag, CreditCard, Package, Star, Heart } from "lucide-react";
import { useEffect, useState } from "react";

const icons = [ShoppingBag, ShoppingCart, Gift, Tag, CreditCard, Package, Star, Heart];

export default function FloatingBackground({ children }: { children: React.ReactNode }) {
    const [mounted, setMounted] = useState(false);

    useEffect(() => {
        setMounted(true);
    }, []);

    return (
        <div className="min-h-screen w-full relative overflow-hidden bg-gradient-to-br from-blue-100 via-blue-50 to-white">
            {/* Animated Gradient Mesh (CSS based for performance) */}
            <div className="absolute inset-0 opacity-80">
                <div className="absolute top-[-10%] left-[-10%] w-[40%] h-[40%] bg-blue-300/40 rounded-full blur-3xl animate-blob" />
                <div className="absolute top-[20%] right-[-10%] w-[30%] h-[30%] bg-brand-gold/20 rounded-full blur-3xl animate-blob animation-delay-2000" />
                <div className="absolute bottom-[-10%] left-[20%] w-[35%] h-[35%] bg-brand-blue/20 rounded-full blur-3xl animate-blob animation-delay-4000" />
            </div>

            {/* Floating Icons */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
                {mounted && [...Array(15)].map((_, i) => {
                    const Icon = icons[i % icons.length];
                    const size = Math.random() * 30 + 20; // 20px to 50px
                    const initialX = Math.random() * 100;
                    const initialY = Math.random() * 100;
                    const duration = Math.random() * 20 + 10; // 10s to 30s
                    const delay = Math.random() * 5;

                    return (
                        <motion.div
                            key={i}
                            className="absolute text-brand-blue/20"
                            initial={{ x: `${initialX}vw`, y: `${initialY}vh`, opacity: 0, rotate: 0 }}
                            animate={{
                                y: [`${initialY}vh`, `${initialY - 20}vh`, `${initialY}vh`],
                                x: [`${initialX}vw`, `${initialX + 10}vw`, `${initialX}vw`],
                                rotate: [0, 180, 360],
                                opacity: [0, 0.4, 0]
                            }}
                            transition={{
                                duration: duration,
                                repeat: Infinity,
                                ease: "linear",
                                delay: delay
                            }}
                        >
                            <Icon size={size} />
                        </motion.div>
                    );
                })}
            </div>

            {/* Content */}
            <div className="relative z-10 w-full min-h-screen flex flex-col">
                {children}
            </div>
        </div>
    );
}
