"use client";

import Link from "next/link";
import { ArrowLeft, Upload, Save, X, Plus, Trash2 } from "lucide-react";
import CastleLoader from "@/components/ui/CastleLoader";
import { useState, useEffect, useRef } from "react";
import { productService, Category } from "@/services/productService";
import { useRouter } from "next/navigation";
import { upload } from '@vercel/blob/client';
import Image from "next/image";
import { Editor } from '@tinymce/tinymce-react';

interface ProductOption {
    name: string;
    values: string[];
}

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
        sku: "",
        options: [] as ProductOption[]
    });

    // Option Management State
    const [newOptionName, setNewOptionName] = useState("");
    const [newOptionValue, setNewOptionValue] = useState("");
    const [currentOptionValues, setCurrentOptionValues] = useState<string[]>([]);

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
            const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
            const newBlob = await upload(uniqueFilename, file, {
                access: 'public',
                handleUploadUrl: '/blob-upload',
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
            // Upload sequentially
            for (const file of files) {
                const uniqueFilename = `${Date.now()}-${Math.random().toString(36).substring(7)}-${file.name}`;
                const newBlob = await upload(uniqueFilename, file, {
                    access: 'public',
                    handleUploadUrl: '/blob-upload',
                });
                newUrls.push(newBlob.url);
            }

            setFormData(prev => ({
                ...prev,
                uploaded_images: [...prev.uploaded_images, ...newUrls]
            }));
        } catch (error: any) {
            console.error("Upload failed", error);
            alert(`Failed to upload some images: ${error.message || "Unknown error"}`);
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

    // Option Management Functions
    const addOptionValue = () => {
        if (newOptionValue.trim()) {
            setCurrentOptionValues([...currentOptionValues, newOptionValue.trim()]);
            setNewOptionValue("");
        }
    };

    const removeOptionValue = (index: number) => {
        setCurrentOptionValues(currentOptionValues.filter((_, i) => i !== index));
    };

    const addOption = () => {
        if (newOptionName.trim() && currentOptionValues.length > 0) {
            setFormData(prev => ({
                ...prev,
                options: [...prev.options, { name: newOptionName.trim(), values: currentOptionValues }]
            }));
            setNewOptionName("");
            setCurrentOptionValues([]);
        } else {
            alert("Please provide an option name and at least one value.");
        }
    };

    const removeOption = (index: number) => {
        setFormData(prev => ({
            ...prev,
            options: prev.options.filter((_, i) => i !== index)
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
                uploaded_images: formData.uploaded_images, // Send list of URLs
                options: formData.options
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
        <div className="space-y-6 max-w-5xl mx-auto pb-20">
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
                            <div className="border border-gray-200 rounded-lg overflow-hidden">
                                <Editor
                                    apiKey={process.env.NEXT_PUBLIC_TINYMCE_API_KEY}
                                    value={formData.description}
                                    onEditorChange={(content) => setFormData(prev => ({ ...prev, description: content }))}
                                    init={{
                                        height: 400,
                                        menubar: true,
                                        plugins: [
                                            'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
                                            'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
                                            'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
                                        ],
                                        toolbar: 'undo redo | blocks | ' +
                                            'bold italic forecolor | alignleft aligncenter ' +
                                            'alignright alignjustify | bullist numlist outdent indent | ' +
                                            'removeformat | help',
                                        content_style: 'body { font-family:Inter,Helvetica,Arial,sans-serif; font-size:14px }'
                                    }}
                                />
                            </div>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-lg text-gray-800">Product Options (Variants)</h2>
                        <p className="text-sm text-gray-500">Add options like Size, Color, or Material. These will be required for the customer to select.</p>

                        {/* Existing Options List */}
                        {formData.options.length > 0 && (
                            <div className="space-y-3 mb-4">
                                {formData.options.map((opt, idx) => (
                                    <div key={idx} className="flex items-center justify-between bg-gray-50 p-3 rounded-lg border border-gray-200">
                                        <div>
                                            <span className="font-bold text-gray-800">{opt.name}:</span>
                                            <span className="text-gray-600 ml-2">{opt.values.join(', ')}</span>
                                        </div>
                                        <button onClick={() => removeOption(idx)} className="text-red-500 hover:text-red-700">
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {/* Add New Option Form */}
                        <div className="bg-gray-50 p-4 rounded-lg border border-gray-200 space-y-3">
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Option Name (e.g. Size)</label>
                                <input
                                    type="text"
                                    value={newOptionName}
                                    onChange={(e) => setNewOptionName(e.target.value)}
                                    className="w-full px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-brand-blue"
                                    placeholder="Size"
                                />
                            </div>
                            <div>
                                <label className="block text-xs font-bold text-gray-700 mb-1">Option Values (e.g. S, M, L)</label>
                                <div className="flex gap-2">
                                    <input
                                        type="text"
                                        value={newOptionValue}
                                        onChange={(e) => setNewOptionValue(e.target.value)}
                                        onKeyDown={(e) => {
                                            if (e.key === 'Enter') {
                                                e.preventDefault();
                                                addOptionValue();
                                            }
                                        }}
                                        className="flex-1 px-3 py-2 bg-white border border-gray-300 rounded focus:outline-none focus:border-brand-blue"
                                        placeholder="Type value and press Enter"
                                    />
                                    <button
                                        onClick={addOptionValue}
                                        type="button"
                                        className="bg-gray-200 text-gray-700 px-4 py-2 rounded hover:bg-gray-300 font-bold"
                                    >
                                        Add
                                    </button>
                                </div>
                                {/* Values Preview */}
                                {currentOptionValues.length > 0 && (
                                    <div className="flex flex-wrap gap-2 mt-2">
                                        {currentOptionValues.map((val, idx) => (
                                            <span key={idx} className="bg-white border border-gray-300 px-2 py-1 rounded text-sm flex items-center gap-1">
                                                {val}
                                                <button onClick={() => removeOptionValue(idx)} className="text-red-500 hover:text-red-700"><X size={12} /></button>
                                            </span>
                                        ))}
                                    </div>
                                )}
                            </div>
                            <button
                                onClick={addOption}
                                type="button"
                                disabled={!newOptionName || currentOptionValues.length === 0}
                                className="w-full bg-brand-blue text-white py-2 rounded font-bold hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Add Option Type
                            </button>
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
                                {uploading ? <CastleLoader size="sm" /> : <Plus size={24} />}
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
                                    <CastleLoader size="md" />
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
                        {loading ? <CastleLoader size="sm" /> : <Save size={20} />}
                        {loading ? "Publishing..." : "Publish Product"}
                    </button>
                </div>
            </div>
        </div>
    );
}
