"use client";

import Link from "next/link";
import { ArrowLeft, Upload, Save, Trash2 } from "lucide-react";
import { useParams } from "next/navigation";

export default function EditProductPage() {
    const params = useParams();
    const productId = params.id;

    return (
        <div className="space-y-6 max-w-4xl mx-auto">
            <div className="flex items-center justify-between mb-6">
                <div className="flex items-center gap-4">
                    <Link href="/admin/products" className="p-2 hover:bg-gray-200 rounded-full transition-colors">
                        <ArrowLeft size={24} />
                    </Link>
                    <h1 className="text-2xl font-bold text-gray-800">Edit Product</h1>
                </div>
                <button className="text-red-500 hover:bg-red-50 px-4 py-2 rounded-lg font-bold transition-colors flex items-center gap-2">
                    <Trash2 size={20} /> Delete Product
                </button>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Main Info */}
                <div className="lg:col-span-2 space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-lg text-gray-800">Basic Information</h2>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Product Name</label>
                            <input type="text" defaultValue="Premium Gold Chafing Dish 8L" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                            <textarea defaultValue="High quality stainless steel chafing dish..." className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue h-32"></textarea>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-lg text-gray-800">Pricing & Inventory</h2>

                        <div className="grid grid-cols-2 gap-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Price (KES)</label>
                                <input type="number" defaultValue={4500} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Discount Price</label>
                                <input type="number" defaultValue={3800} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Stock Quantity</label>
                                <input type="number" defaultValue={15} className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">SKU</label>
                                <input type="text" defaultValue="CD-KIT-001" className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" />
                            </div>
                        </div>
                    </div>
                </div>

                {/* Sidebar */}
                <div className="space-y-6">
                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-lg text-gray-800">Organization</h2>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Category</label>
                            <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue">
                                <option>Kitchenware</option>
                                <option>Fashion</option>
                            </select>
                        </div>

                        <div>
                            <label className="block text-sm font-bold text-gray-700 mb-1">Status</label>
                            <select className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue">
                                <option>Active</option>
                                <option>Draft</option>
                            </select>
                        </div>

                        <div className="flex items-center gap-2 pt-2">
                            <input type="checkbox" id="pod" className="rounded text-brand-blue focus:ring-brand-blue" defaultChecked />
                            <label htmlFor="pod" className="text-sm text-gray-700">Allow Pay on Delivery</label>
                        </div>
                    </div>

                    <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 space-y-4">
                        <h2 className="font-bold text-lg text-gray-800">Images</h2>
                        <div className="grid grid-cols-2 gap-2">
                            <div className="aspect-square bg-gray-100 rounded-lg flex items-center justify-center relative group">
                                <span className="text-xs text-gray-400">Img 1</span>
                                <button className="absolute top-1 right-1 bg-red-500 text-white p-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                                    <X size={12} />
                                </button>
                            </div>
                            <div className="aspect-square border-2 border-dashed border-gray-300 rounded-lg flex items-center justify-center hover:bg-gray-50 cursor-pointer">
                                <Upload size={20} className="text-gray-400" />
                            </div>
                        </div>
                    </div>

                    <button className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 shadow-lg">
                        <Save size={20} /> Save Changes
                    </button>
                </div>
            </div>
        </div>
    );
}

import { X } from "lucide-react";
