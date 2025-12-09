"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { ArrowLeft, Upload, Loader2 } from "lucide-react";
import Link from "next/link";
import api from "@/lib/api";

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
            const data = new FormData();
            data.append("name", formData.name);
            data.append("slug", formData.slug);
            if (imageFile) {
                data.append("image", imageFile);
            }

            await api.post("/products/categories/", data, {
                headers: {
                    "Content-Type": "multipart/form-data",
                },
            });

            router.push("/admin/categories");
        } catch (error) {
            console.error("Failed to create category", error);
            alert("Failed to create category");
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
                        {loading && <Loader2 className="animate-spin" size={20} />}
                        Create Category
                    </button>
                </div>
            </form>
        </div>
    );
}
