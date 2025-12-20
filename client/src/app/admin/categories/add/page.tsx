"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";
import { upload } from '@vercel/blob/client';
import CastleLoader from "@/components/ui/CastleLoader";

export default function AddCategoryPage() {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    const [formData, setFormData] = useState({
        name: "",
        slug: "",
    });
    const [imageFile, setImageFile] = useState<File | null>(null);
    const [previewUrl, setPreviewUrl] = useState<string | null>(null);

    const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        if (e.target.files && e.target.files[0]) {
            const file = e.target.files[0];
            setImageFile(file);
            setPreviewUrl(URL.createObjectURL(file));
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            let imageUrl = "";

            if (imageFile) {
                const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${imageFile.name}`;
                const newBlob = await upload(uniqueFilename, imageFile, {
                    access: 'public',
                    handleUploadUrl: '/blob-upload',
                });
                imageUrl = newBlob.url;
            }

            await api.post("/products/categories/", {
                name: formData.name,
                slug: formData.slug,
                image: imageUrl
            });

            router.push("/admin/categories");
        } catch (error: any) {
            console.error("Failed to create category", error);
            if (error.response && error.response.data) {
                const errors = error.response.data;
                let errorMessage = "Failed to create category:\n";
                if (typeof errors === 'object') {
                    Object.entries(errors).forEach(([key, value]) => {
                        errorMessage += `${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
                    });
                } else {
                    errorMessage += String(errors);
                }
                alert(errorMessage);
            } else {
                alert(`Failed to create category: ${error.message || "Unknown error"}`);
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="max-w-2xl mx-auto">
            <div className="mb-8">
                <Link href="/admin/categories" className="text-gray-500 hover:text-gray-800 flex items-center gap-2 mb-4">
                    <ArrowLeft size={16} /> Back to Categories
                </Link>
                <h1 className="font-display text-2xl font-bold text-gray-800">Add New Category</h1>
            </div>

            <form onSubmit={handleSubmit} className="bg-white rounded-xl shadow-sm border border-gray-200 p-6 space-y-6">
                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Category Name</label>
                    <input
                        type="text"
                        required
                        value={formData.name}
                        onChange={(e) => setFormData({ ...formData, name: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Slug</label>
                    <input
                        type="text"
                        required
                        value={formData.slug}
                        onChange={(e) => setFormData({ ...formData, slug: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue bg-gray-50"
                    />
                </div>

                <div>
                    <label className="block text-sm font-bold text-gray-700 mb-2">Cover Image</label>
                    <div className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 transition-colors relative">
                        <input
                            type="file"
                            accept="image/*"
                            onChange={handleImageChange}
                            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                        />
                        {previewUrl ? (
                            <div className="relative h-48 w-full">
                                <img src={previewUrl} alt="Preview" className="w-full h-full object-contain" />
                            </div>
                        ) : (
                            <div className="flex flex-col items-center gap-2 text-gray-500">
                                <Upload size={32} />
                                <p>Click or drag to upload image</p>
                            </div>
                        )}
                    </div>
                </div>

                <div className="pt-4 flex justify-end">
                    <button
                        type="submit"
                        disabled={loading}
                        className="bg-brand-blue text-white px-8 py-3 rounded-lg font-bold hover:bg-brand-gold hover:text-brand-blue transition-colors disabled:opacity-50 flex items-center gap-2"
                    >
                        {loading && <CastleLoader size="sm" />}
                        Create Category
                    </button>
                </div>
            </form>
        </div>
    );
}
