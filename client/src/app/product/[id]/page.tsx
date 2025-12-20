import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailsClient from "./ProductDetailsClient";
import { fetchServerData } from "@/lib/fetchData";
import { Suspense } from "react";
import CastleLoader from "@/components/ui/CastleLoader";
import ProductCard from "@/components/product/ProductCard";

// Helper to map backend product to frontend interface
const mapProduct = (p: any) => ({
    ...p,
    image: p.image_main,
    discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
    price: p.price
});

async function RelatedProducts({ categorySlug, currentProductId }: { categorySlug: string, currentProductId: string }) {
    if (!categorySlug) return null;

    // Artificial delay to demonstrate streaming if needed, but better to just fetch
    const relatedData = await fetchServerData(`/products/?category__slug=${categorySlug}&page_size=4`, { next: { revalidate: 60 } });
    const rawRelated = relatedData?.results || (Array.isArray(relatedData) ? relatedData : []);
    const relatedProducts = rawRelated
        .filter((p: any) => p.id !== currentProductId) // Exclude current product
        .slice(0, 4)
        .map(mapProduct);

    if (relatedProducts.length === 0) return null;

    return (
        <div className="container mx-auto px-4 pb-20">
            <h2 className="font-display text-2xl font-bold text-gray-800 mb-8">Related Products</h2>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
                {relatedProducts.map((p: any) => (
                    <ProductCard key={p.id} product={p} />
                ))}
            </div>
        </div>
    );
}

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    const productData = await fetchServerData(`/products/${id}/`, { next: { revalidate: 60 } });

    if (!productData) {
        return (
            <div className="min-h-screen flex flex-col bg-gray-50">
                <Navbar />
                <div className="flex-grow flex justify-center items-center">
                    <p className="text-gray-500">Product not found.</p>
                </div>
                <Footer />
            </div>
        );
    }

    const product = mapProduct(productData);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <ProductDetailsClient product={product} />

            <Suspense fallback={
                <div className="container mx-auto px-4 pb-20">
                    <h2 className="font-display text-2xl font-bold text-gray-800 mb-8">Related Products</h2>
                    <div className="h-64 flex items-center justify-center">
                        <CastleLoader size="md" text="Loading related products..." />
                    </div>
                </div>
            }>
                <RelatedProducts categorySlug={product.category?.slug} currentProductId={id} />
            </Suspense>

            <Footer />
        </div>
    );
}
