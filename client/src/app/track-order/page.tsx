import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import TrackOrderForm from "./TrackOrderForm";

export default function TrackOrderPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />
            <main className="flex-grow flex items-center justify-center p-4">
                <TrackOrderForm />
            </main>
            <Footer />
        </div>
    );
}
