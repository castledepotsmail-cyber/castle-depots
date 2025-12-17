"use client";

import { useEffect, useRef } from "react";

interface Particle {
    x: number;
    y: number;
    size: number;
    speedX: number;
    speedY: number;
    opacity: number;
    color: string;
}

export default function HeroBackground() {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        const canvas = canvasRef.current;
        const container = containerRef.current;
        if (!canvas || !container) return;

        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        let animationFrameId: number;
        let particles: Particle[] = [];
        let mouse = { x: -1000, y: -1000 }; // Start off-screen

        // Configuration
        const particleCount = 60; // Not too many to keep it fast
        const colors = ["#FFD700", "#FFFFFF", "#DAA520"]; // Gold, White, Goldenrod
        const connectionDistance = 150;
        const mouseDistance = 200;

        // Resize handler
        const resize = () => {
            canvas.width = container.clientWidth;
            canvas.height = container.clientHeight;
            initParticles();
        };

        // Initialize particles
        const initParticles = () => {
            particles = [];
            for (let i = 0; i < particleCount; i++) {
                particles.push({
                    x: Math.random() * canvas.width,
                    y: Math.random() * canvas.height,
                    size: Math.random() * 2 + 0.5, // Small elegant dots
                    speedX: (Math.random() - 0.5) * 0.5, // Slow movement
                    speedY: (Math.random() - 0.5) * 0.5,
                    opacity: Math.random() * 0.5 + 0.2,
                    color: colors[Math.floor(Math.random() * colors.length)]
                });
            }
        };

        // Animation Loop
        const animate = () => {
            ctx.clearRect(0, 0, canvas.width, canvas.height);

            // Update and Draw Particles
            particles.forEach((p, index) => {
                // Movement
                p.x += p.speedX;
                p.y += p.speedY;

                // Mouse Interaction (Gentle repulsion/attraction)
                const dx = mouse.x - p.x;
                const dy = mouse.y - p.y;
                const distance = Math.sqrt(dx * dx + dy * dy);

                if (distance < mouseDistance) {
                    const forceDirectionX = dx / distance;
                    const forceDirectionY = dy / distance;
                    const force = (mouseDistance - distance) / mouseDistance;

                    // Gentle push away
                    const directionX = forceDirectionX * force * 0.6;
                    const directionY = forceDirectionY * force * 0.6;

                    p.x -= directionX;
                    p.y -= directionY;
                }

                // Wrap around screen
                if (p.x < 0) p.x = canvas.width;
                if (p.x > canvas.width) p.x = 0;
                if (p.y < 0) p.y = canvas.height;
                if (p.y > canvas.height) p.y = 0;

                // Draw Particle
                ctx.beginPath();
                ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
                ctx.fillStyle = p.color;
                ctx.globalAlpha = p.opacity;
                ctx.fill();

                // Draw Connections (Constellation effect)
                for (let j = index + 1; j < particles.length; j++) {
                    const p2 = particles[j];
                    const dx2 = p.x - p2.x;
                    const dy2 = p.y - p2.y;
                    const dist2 = Math.sqrt(dx2 * dx2 + dy2 * dy2);

                    if (dist2 < connectionDistance) {
                        ctx.beginPath();
                        ctx.strokeStyle = `rgba(255, 215, 0, ${0.15 - dist2 / connectionDistance * 0.15})`; // Faint gold lines
                        ctx.lineWidth = 0.5;
                        ctx.moveTo(p.x, p.y);
                        ctx.lineTo(p2.x, p2.y);
                        ctx.stroke();
                    }
                }
            });

            // Draw Mouse Glow
            if (mouse.x > 0 && mouse.y > 0) {
                const gradient = ctx.createRadialGradient(mouse.x, mouse.y, 0, mouse.x, mouse.y, 300);
                gradient.addColorStop(0, 'rgba(255, 215, 0, 0.05)'); // Very faint gold glow center
                gradient.addColorStop(1, 'rgba(0, 0, 0, 0)');
                ctx.fillStyle = gradient;
                ctx.fillRect(0, 0, canvas.width, canvas.height);
            }

            animationFrameId = requestAnimationFrame(animate);
        };

        // Event Listeners
        const handleMouseMove = (e: MouseEvent) => {
            const rect = canvas.getBoundingClientRect();
            mouse.x = e.clientX - rect.left;
            mouse.y = e.clientY - rect.top;
        };

        const handleMouseLeave = () => {
            mouse.x = -1000;
            mouse.y = -1000;
        };

        window.addEventListener("resize", resize);
        container.addEventListener("mousemove", handleMouseMove);
        container.addEventListener("mouseleave", handleMouseLeave);

        resize();
        animate();

        return () => {
            window.removeEventListener("resize", resize);
            if (container) {
                container.removeEventListener("mousemove", handleMouseMove);
                container.removeEventListener("mouseleave", handleMouseLeave);
            }
            cancelAnimationFrame(animationFrameId);
        };
    }, []);

    return (
        <div ref={containerRef} className="fixed inset-0 z-0 overflow-hidden bg-brand-blue">
            {/* Subtle Gradient Background Base */}
            <div className="absolute inset-0 bg-gradient-to-br from-brand-blue via-[#002a5c] to-brand-blue opacity-90"></div>

            {/* The Canvas Animation */}
            <canvas ref={canvasRef} className="absolute inset-0 w-full h-full opacity-60" />

            {/* Overlay to ensure text readability */}
            <div className="absolute inset-0 bg-gradient-to-r from-brand-blue/80 via-transparent to-transparent pointer-events-none"></div>
        </div>
    );
}
