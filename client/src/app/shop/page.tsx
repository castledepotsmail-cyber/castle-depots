import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ShopClient from "./ShopClient";
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

export default async function ShopPage({
    searchParams,
}: {
    searchParams: Promise<{ [key: string]: string | string[] | undefined }>
}) {
    const params = await searchParams;
    const search = typeof params.search === 'string' ? params.search : '';
    const category = typeof params.category === 'string' ? params.category : ''; // Note: ShopClient uses 'category' radio but API uses 'category__slug'
    // Actually ShopClient uses `selectedCategory` state which maps to `category__slug` in API.
    // But the URL param might be just `?category=slug` or `?category__slug=slug`.
    // Let's assume standard usage `?category=slug`.

    // Construct API query string
    const queryParams = new URLSearchParams();
    queryParams.append('ordering', '-created_at'); // Default sort

    if (search) queryParams.append('search', search);
    // If we support deep linking to filters:
    // if (params.category) queryParams.append('category__slug', params.category as string);
    // if (params.min) queryParams.append('price__gte', params.min as string);
    // if (params.max) queryParams.append('price__lte', params.max as string);

    // Fetch Data
    const [productsData, categoriesData] = await Promise.all([
        fetchServerData(`/products/?${queryParams.toString()}`, { next: { revalidate: 0 } }), // Dynamic data
        fetchServerData('/products/categories/', { next: { revalidate: 3600 } })
    ]);

    const rawProducts = productsData?.results || (Array.isArray(productsData) ? productsData : []);
    const products = rawProducts.map(mapProduct);

    const categories = categoriesData?.results || (Array.isArray(categoriesData) ? categoriesData : []);

    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="container mx-auto px-4 py-8 flex-grow">
                <Suspense fallback={
                    <div className="flex justify-center items-center h-64">
                        <Loader2 className="animate-spin text-brand-blue" size={48} />
                    </div>
                }>
                    <ShopClient
                        initialProducts={products}
                        initialCategories={categories}
                    />
                </Suspense>
            </main>
            <Footer />
        </div>
    );
}
