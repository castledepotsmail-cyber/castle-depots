import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";
import ContactForm from "./ContactForm";

export default function ContactPage() {
    return (
        <div className="min-h-screen flex flex-col bg-gray-50">
            <Navbar />

            <main className="container mx-auto px-4 py-12 flex-grow">
                <div className="max-w-5xl mx-auto">
                    <div className="text-center mb-12">
                        <h1 className="font-display text-3xl font-bold text-gray-800 mb-2">Get in Touch</h1>
                        <p className="text-gray-500">We'd love to hear from you. Our team is always here to chat.</p>
                    </div>

                    <ContactForm />
                </div>
            </main>

            <Footer />
        </div>
    );
}
