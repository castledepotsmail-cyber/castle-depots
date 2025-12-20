import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CampaignClient from "./CampaignClient";
import { fetchServerData } from "@/lib/fetchData";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";
import Link from "next/link";

// Helper to map backend product to frontend interface
const mapProduct = (p: any) => ({
    ...p,
    image: p.image_main,
    discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
    price: p.price
});

export default async function CampaignPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    // Fetch active campaigns to find the matching one
    // Note: Ideally we should have an endpoint to fetch a single campaign by slug
    // But based on existing code, we fetch all active and filter.
    // Optimization: If backend supports filtering by slug, use that.
    // Assuming backend endpoint `/campaigns/active/` returns a list.

    const campaignsData = await fetchServerData('/campaigns/active/', { next: { revalidate: 30 } });
    const campaigns = campaignsData?.results || (Array.isArray(campaignsData) ? campaignsData : []);
    const campaign = campaigns.find((c: any) => c.slug === slug);

    if (!campaign) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex flex-col items-center justify-center p-4 text-center">
                    <h1 className="text-2xl font-bold text-gray-800 mb-4">Campaign Not Found</h1>
                    <p className="text-gray-600 mb-8">The campaign you are looking for does not exist or has expired.</p>
                    <Link href="/shop" className="bg-brand-blue text-white px-6 py-3 rounded-full font-bold hover:bg-blue-700 transition-colors">
                        Continue Shopping
                    </Link>
                </div>
                <Footer />
            </div>
        );
    }

    // Fetch products based on campaign type
    let productsData: any[] = [];
    if (campaign.product_selection_type === 'manual') {
        if (campaign.products && campaign.products.length > 0) {
            productsData = campaign.products;
        }
    } else if (campaign.product_selection_type === 'category' && campaign.target_category) {
        const res = await fetchServerData(`/products/?category=${campaign.target_category}`, { next: { revalidate: 60 } });
        productsData = res?.results || (Array.isArray(res) ? res : []);
    } else if (campaign.product_selection_type === 'all') {
        const res = await fetchServerData('/products/', { next: { revalidate: 60 } });
        productsData = res?.results || (Array.isArray(res) ? res : []);
    }

    const products = productsData.map(mapProduct);

    return (
        <div className="min-h-screen flex flex-col">
            <Navbar />
            <Suspense fallback={
                <div className="flex-grow flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-brand-blue" size={48} />
                </div>
            }>
                <CampaignClient
                    campaign={campaign}
                    products={products}
                />
            </Suspense>
            <Footer />
        </div>
    );
}
