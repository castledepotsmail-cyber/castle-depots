"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { X, Timer } from "lucide-react";
import { campaignService } from "@/services/campaignService";

export default function CampaignBanner() {
    const [isVisible, setIsVisible] = useState(true);
    const [activeBanner, setActiveBanner] = useState<any>(null);

    useEffect(() => {
        const fetchActiveCampaigns = async () => {
            try {
                const campaigns = await campaignService.getActiveCampaigns();
                // Find the first campaign with an active 'top_bar' banner
                for (const campaign of campaigns) {
                    const topBar = campaign.banners?.find((b: any) => b.type === 'top_bar' && b.is_active);
                    if (topBar) {
                        setActiveBanner({ ...topBar, campaign });
                        break;
                    }
                }
            } catch (error) {
                console.error("Failed to fetch active campaigns", error);
            }
        };
        fetchActiveCampaigns();
    }, []);

    if (!isVisible || !activeBanner) return null;

    // Determine colors based on campaign theme
    const theme = (activeBanner.theme_mode && activeBanner.theme_mode !== 'inherit') ? activeBanner.theme_mode : activeBanner.campaign.theme_mode;
    let bgClass = "bg-brand-blue";
    let textClass = "text-white";
    let btnClass = "bg-white text-brand-blue";

    if (theme === 'red') {
        bgClass = "bg-red-600";
        btnClass = "bg-white text-red-600";
    } else if (theme === 'green') {
        bgClass = "bg-green-600";
        btnClass = "bg-white text-green-600";
    } else if (theme === 'dark') {
        bgClass = "bg-gray-900";
        btnClass = "bg-white text-gray-900";
    }

    return (
        <div className={`${bgClass} ${textClass} py-3 px-4 flex flex-col md:flex-row justify-between items-center gap-2 relative z-50 transition-colors duration-300`}>
            <div className="flex items-center gap-2 justify-center w-full md:w-auto">
                <span className={`${btnClass} px-2 py-0.5 rounded text-xs font-bold uppercase tracking-wider animate-pulse`}>
                    {activeBanner.heading || "Special Offer"}
                </span>
                <p className="font-bold text-sm md:text-base text-center md:text-left">
                    {activeBanner.subheading}
                </p>
            </div>

            <div className="flex items-center gap-4">
                {/* Optional Timer if we want to keep it, but for now generic */}
                {/* <div className="flex items-center gap-1 font-mono font-bold text-lg">
                    <Timer size={20} className="mr-1" />
                    <span>12:00:00</span>
                </div> */}

                {activeBanner.link && (
                    <Link
                        href={activeBanner.link}
                        className={`${btnClass} px-4 py-1 rounded-full text-sm font-bold hover:opacity-90 transition-opacity whitespace-nowrap`}
                    >
                        {activeBanner.button_text || "Shop Now"}
                    </Link>
                )}

                <button
                    onClick={() => setIsVisible(false)}
                    className="p-1 hover:bg-black/10 rounded-full transition-colors"
                >
                    <X size={16} />
                </button>
            </div>
        </div>
    );
}
