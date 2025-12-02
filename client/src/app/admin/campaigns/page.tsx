"use client";

import { Plus, Calendar, Megaphone, Trash2, Edit } from "lucide-react";

export default function AdminCampaignsPage() {
    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Campaigns & Flash Sales</h1>
                <button className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2">
                    <Plus size={20} /> Create Campaign
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {/* Active Campaign Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-brand-blue relative overflow-hidden">
                    <div className="absolute top-0 right-0 bg-brand-blue text-white text-xs font-bold px-3 py-1 rounded-bl-xl">
                        ACTIVE
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-red-100 text-red-600 p-3 rounded-full">
                            <Megaphone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">Black Friday Sale</h3>
                            <p className="text-sm text-gray-500">Theme: Red Mode</p>
                        </div>
                    </div>
                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            <span>Nov 25 - Dec 01, 2025</span>
                        </div>
                        <p className="text-sm text-gray-600"><strong>50% OFF</strong> on Kitchenware</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            <Edit size={16} /> Edit
                        </button>
                        <button className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                            <Trash2 size={16} /> End
                        </button>
                    </div>
                </div>

                {/* Scheduled Campaign Card */}
                <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 relative overflow-hidden opacity-75">
                    <div className="absolute top-0 right-0 bg-yellow-100 text-yellow-700 text-xs font-bold px-3 py-1 rounded-bl-xl">
                        SCHEDULED
                    </div>
                    <div className="flex items-center gap-3 mb-4">
                        <div className="bg-blue-100 text-brand-blue p-3 rounded-full">
                            <Megaphone size={24} />
                        </div>
                        <div>
                            <h3 className="font-bold text-lg text-gray-900">Christmas Special</h3>
                            <p className="text-sm text-gray-500">Theme: Gold Mode</p>
                        </div>
                    </div>
                    <div className="space-y-2 mb-6">
                        <div className="flex items-center gap-2 text-sm text-gray-600">
                            <Calendar size={16} />
                            <span>Dec 15 - Dec 25, 2025</span>
                        </div>
                        <p className="text-sm text-gray-600"><strong>30% OFF</strong> Storewide</p>
                    </div>
                    <div className="flex gap-2">
                        <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                            <Edit size={16} /> Edit
                        </button>
                        <button className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2">
                            <Trash2 size={16} /> Delete
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
