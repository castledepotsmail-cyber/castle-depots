import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import CategoryClient from "./CategoryClient";
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

export default async function CategoryPage({
    params,
}: {
    params: Promise<{ slug: string }>
}) {
    const { slug } = await params;

    // Parallel Data Fetching
    const [categoryData, productsData] = await Promise.all([
        fetchServerData(`/products/categories/${slug}/`, { next: { revalidate: 3600 } }).catch(() => null),
        fetchServerData(`/products/?category__slug=${slug}`, { next: { revalidate: 60 } })
    ]);

    const rawProducts = productsData?.results || (Array.isArray(productsData) ? productsData : []);
    const products = rawProducts.map(mapProduct);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <Suspense fallback={
                <div className="flex-grow flex justify-center items-center h-64">
                    <Loader2 className="animate-spin text-brand-blue" size={48} />
                </div>
            }>
                <CategoryClient
                    initialProducts={products}
                    category={categoryData}
                    slug={slug}
                />
            </Suspense>
            <Footer />
        </div>
    );
}
