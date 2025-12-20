import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ProductDetailsClient from "./ProductDetailsClient";
import { fetchServerData } from "@/lib/fetchData";
import { Suspense } from "react";
import { Loader2 } from "lucide-react";

// Helper to map backend product to frontend interface
const mapProduct = (p: any) => ({
    ...p,
    image: p.image_main,
    discountPrice: p.discount_price ? parseFloat(p.discount_price) : undefined,
    price: p.price
});

export default async function ProductDetailsPage({
    params,
}: {
    params: Promise<{ id: string }>
}) {
    const { id } = await params;

    // Parallel Data Fetching
    // We need product details first to get category slug for related products
    // But we can try to fetch them in parallel if we had category slug. We don't.
    // So we fetch product first.

    const productData = await fetchServerData(`/products/${id}/`, { next: { revalidate: 0 } });

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

    // Fetch related products
    let relatedProducts = [];
    if (product.category?.slug) {
        const relatedData = await fetchServerData(`/products/?category__slug=${product.category.slug}&page_size=4`, { next: { revalidate: 60 } });
        const rawRelated = relatedData?.results || (Array.isArray(relatedData) ? relatedData : []);
        relatedProducts = rawRelated
            .filter((p: any) => p.id !== id) // Exclude current product
            .slice(0, 4)
            .map(mapProduct);
    }

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <Suspense fallback={
                <div className="flex-grow flex justify-center items-center">
                    <Loader2 className="animate-spin text-brand-blue" size={48} />
                </div>
            }>
                <ProductDetailsClient product={product} relatedProducts={relatedProducts} />
            </Suspense>
            <Footer />
        </div>
    );
}
