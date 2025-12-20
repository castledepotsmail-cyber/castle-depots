"use client";

import Link from "next/link";
import { ArrowLeft, Upload, Save, Loader2, X, Plus } from "lucide-react";
import { useState, useEffect, useRef } from "react";
import { productService, Category } from "@/services/productService";
import { useRouter } from "next/navigation";
import { upload } from '@vercel/blob/client';
import Image from "next/image";

export default function AddProductPage() {
    const router = useRouter();
    const [categories, setCategories] = useState<Category[]>([]);
    const [loading, setLoading] = useState(false);
    const [uploading, setUploading] = useState(false);
    const fileInputRef = useRef<HTMLInputElement>(null);
    const multiFileInputRef = useRef<HTMLInputElement>(null);

    const [formData, setFormData] = useState({
        name: "",
        description: "",
        price: "",
        discount_price: "",
        stock_quantity: "",
        category: "",
        is_active: true,
        image_main: "",
        uploaded_images: [] as string[], // Additional images
        sku: ""
    });

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const data = await productService.getCategories();
                setCategories(data);
            } catch (error) {
                console.error("Failed to fetch categories", error);
            }
        };
        fetchCategories();
    }, []);

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) => {
        const { name, value, type } = e.target;
        setFormData(prev => ({
            ...prev,
            [name]: type === 'checkbox' ? (e.target as HTMLInputElement).checked : value
        }));
    };

    const handleMainImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        const file = e.target.files[0];
        setUploading(true);

        try {
            const newBlob = await upload(file.name, file, {
                access: 'public',
                handleUploadUrl: '/api/upload',
            });
            setFormData(prev => ({ ...prev, image_main: newBlob.url }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload image.");
        } finally {
            setUploading(false);
        }
    };

    const handleAdditionalImagesUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
        if (!e.target.files || e.target.files.length === 0) return;

        setUploading(true);
        const files = Array.from(e.target.files);
        const newUrls: string[] = [];

        try {
            // Upload sequentially or parallel
            for (const file of files) {
                const newBlob = await upload(file.name, file, {
                    access: 'public',
                    handleUploadUrl: '/api/upload',
                });
                newUrls.push(newBlob.url);
            }

            setFormData(prev => ({
                ...prev,
                uploaded_images: [...prev.uploaded_images, ...newUrls]
            }));
        } catch (error) {
            console.error("Upload failed", error);
            alert("Failed to upload some images.");
        } finally {
            setUploading(false);
        }
    };

    const removeAdditionalImage = (index: number) => {
        setFormData(prev => ({
            ...prev,
            uploaded_images: prev.uploaded_images.filter((_, i) => i !== index)
        }));
    };

    const handleSubmit = async () => {
        if (!formData.name || !formData.price || !formData.category) {
            alert("Please fill in all required fields (Name, Price, Category)");
            return;
        }

        if (!formData.image_main) {
            alert("Main image is required");
            return;
        }

        setLoading(true);
        try {
            // Auto-generate slug
            const slug = formData.name
                .toLowerCase()
                .replace(/ /g, '-')
                .replace(/[^\w-]+/g, '');

            const productData = {
                ...formData,
                slug, // Add generated slug
                price: parseFloat(formData.price),
                discount_price: formData.discount_price ? parseFloat(formData.discount_price) : null,
                stock_quantity: parseInt(formData.stock_quantity) || 0,
                category_id: formData.category,
                uploaded_images: formData.uploaded_images // Send list of URLs
            };

            // Assuming productService.createProduct exists or using api directly
            const { default: api } = await import('@/lib/api');
            await api.post('/products/', productData);

            alert("Product created successfully!");
            router.push('/admin/products');
        } catch (error: any) {
            console.error("Failed to create product", error);
            if (error.response && error.response.data) {
                // Handle DRF validation errors
                const errors = error.response.data;
                let errorMessage = "Failed to create product:\n";

                if (typeof errors === 'object') {
                    Object.entries(errors).forEach(([key, value]) => {
                        errorMessage += `${key}: ${Array.isArray(value) ? value.join(', ') : value}\n`;
                    });
                } else {
                    errorMessage += String(errors);
                }

                alert(errorMessage);
            } else {
                alert("Failed to create product. Please try again.");
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center gap-4 mb-6">
                <Link href="/admin/products" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                    <ArrowLeft size={24} />
                </Link>
                <h1 className="text-2xl font-bold text-gray-800">Add New Product</h1>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-lg text-gray-800">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Product Name *</label>
                            <input
                                name="name"
                                value={formData.name}
                                onChange={handleInputChange}
                                type="text"
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                placeholder="e.g. Gold Chafing Dish"
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <textarea
                                name="description"
                                value={formData.description}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue h-32"
                                placeholder="Product details..."
                            ></textarea>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-lg text-gray-800">Pricing & Inventory</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price (KES) *</label>
                                <input
                                    name="price"
                                    value={formData.price}
                                    onChange={handleInputChange}
                                    type="number"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                    placeholder="0.00"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Discount Price</label>
                                <input
                                    name="discount_price"
                                    value={formData.discount_price}
                                    onChange={handleInputChange}
                                    type="number"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                    placeholder="Optional"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity</label>
                                <input
                                    name="stock_quantity"
                                    value={formData.stock_quantity}
                                    onChange={handleInputChange}
                                    type="number"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                    placeholder="0"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">SKU</label>
                                <input
                                    name="sku"
                                    value={formData.sku}
                                    onChange={handleInputChange}
                                    type="text"
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                    placeholder="Auto-generated"
                                />
                            </div>
                        </div>
                    </div>

                    {/* Additional Images Section */}
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-lg text-gray-800">Gallery Images</h2>
                        <div className="grid grid-cols-3 sm:grid-cols-4 gap-4">
                            {formData.uploaded_images.map((img, idx) => (
                                <div key={idx} className="relative aspect-square rounded-lg overflow-hidden border border-gray-200 group">
                                    <Image src={img} alt={`Gallery ${idx}`} fill className="object-cover" />
                                    <button
                                        onClick={() => removeAdditionalImage(idx)}
                                        className="absolute top-1 right-1 bg-white p-1 rounded-full shadow-md text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                                    >
                                        <X size={14} />
                                    </button>
                                </div>
                            ))}

                            <button
                                onClick={() => multiFileInputRef.current?.click()}
                                className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex flex-col items-center justify-center text-gray-400 hover:bg-gray-50 hover:border-brand-blue hover:text-brand-blue transition-colors"
                                disabled={uploading}
                            >
                                {uploading ? <Loader2 className="animate-spin" /> : <Plus size={24} />}
                                <span className="text-xs font-semibold mt-1">Add Image</span>
                            </button>
                        </div>
                        <input
                            type="file"
                            ref={multiFileInputRef}
                            onChange={handleAdditionalImagesUpload}
                            className="hidden"
                            accept="image/*"
                            multiple
                        />
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-lg text-gray-800">Organization</h2>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category *</label>
                            <select
                                name="category"
                                value={formData.category}
                                onChange={handleInputChange}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                            >
                                <option value="">Select Category</option>
                                {categories.map(cat => (
                                    <option key={cat.id} value={cat.id}>{cat.name}</option>
                                ))}
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                            <select
                                name="is_active"
                                value={formData.is_active ? "true" : "false"}
                                onChange={(e) => setFormData(prev => ({ ...prev, is_active: e.target.value === 'true' }))}
                                className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                            >
                                <option value="true">Active</option>
                                <option value="false">Draft</option>
                            </select>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-lg text-gray-800">Main Image *</h2>

                        {formData.image_main ? (
                            <div className="relative w-full h-48 rounded-lg overflow-hidden border border-gray-200">
                                <Image src={formData.image_main} alt="Product" fill className="object-cover" />
                                <button
                                    onClick={() => setFormData(prev => ({ ...prev, image_main: "" }))}
                                    className="absolute top-2 right-2 bg-white p-1 rounded-full shadow-md hover:bg-red-50 text-red-500"
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        ) : (
                            <div
                                onClick={() => fileInputRef.current?.click()}
                                className="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:bg-gray-50 cursor-pointer transition-colors"
                            >
                                {uploading ? (
                                    <Loader2 className="mx-auto text-brand-blue animate-spin mb-2" size={32} />
                                ) : (
                                    <Upload className="mx-auto text-gray-400 mb-2" size={32} />
                                )}
                                <p className="text-sm text-gray-500 font-semibold">{uploading ? "Uploading..." : "Click to upload image"}</p>
                                <p className="text-xs text-gray-400">PNG, JPG up to 5MB</p>
                            </div>
                        )}
                        <input
                            type="file"
                            ref={fileInputRef}
                            onChange={handleMainImageUpload}
                            className="hidden"
                            accept="image/*"
                        />
                    </div>

                    <button
                        onClick={handleSubmit}
                        disabled={loading || uploading}
                        className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                        {loading ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Publish Product
                    </button>
                </div>
            </div>
        </div>
    );
}
