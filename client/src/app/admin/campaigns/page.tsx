"use client";

import { Plus, Calendar, Megaphone, Trash2, Edit, Loader2, X } from "lucide-react";
import { useEffect, useState } from "react";
import { adminService, Campaign } from "@/services/adminService";

export default function AdminCampaignsPage() {
    const [campaigns, setCampaigns] = useState<Campaign[]>([]);
    const [loading, setLoading] = useState(true);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [formData, setFormData] = useState({
        title: "",
        description: "",
        start_time: "",
        end_time: "",
        discount_percentage: "",
        is_active: true
    });

    useEffect(() => {
        fetchCampaigns();
    }, []);

    const fetchCampaigns = async () => {
        try {
            const data = await adminService.getCampaigns();
            setCampaigns(data.results || data);
        } catch (error) {
            console.error("Failed to fetch campaigns", error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (confirm("Are you sure you want to delete this campaign?")) {
            try {
                await adminService.deleteCampaign(id);
                setCampaigns(campaigns.filter(c => c.id !== id));
            } catch (error) {
                console.error("Failed to delete campaign", error);
                alert("Failed to delete campaign");
            }
        }
    };

    const handleCreate = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            const newCampaign = await adminService.createCampaign({
                ...formData,
                discount_percentage: formData.discount_percentage ? parseFloat(formData.discount_percentage) : null
            });
            setCampaigns([newCampaign, ...campaigns]);
            setIsModalOpen(false);
            setFormData({ title: "", description: "", start_time: "", end_time: "", discount_percentage: "", is_active: true });
        } catch (error) {
            console.error("Failed to create campaign", error);
            alert("Failed to create campaign");
        }
    };

    if (loading) {
        return <div className="p-12 text-center"><Loader2 className="animate-spin mx-auto text-brand-blue" /></div>;
    }

    return (
        <div className="space-y-6">
            <div className="flex justify-between items-center">
                <h1 className="text-2xl font-bold text-gray-800">Campaigns & Flash Sales</h1>
                <button
                    onClick={() => setIsModalOpen(true)}
                    className="bg-brand-blue text-white px-6 py-3 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2"
                >
                    <Plus size={20} /> Create Campaign
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {campaigns.map((campaign) => (
                    <div key={campaign.id} className={`bg-white p-6 rounded-xl shadow-sm border ${campaign.is_active ? 'border-brand-blue' : 'border-gray-100'} relative overflow-hidden`}>
                        <div className={`absolute top-0 right-0 text-white text-xs font-bold px-3 py-1 rounded-bl-xl ${campaign.is_active ? 'bg-brand-blue' : 'bg-gray-400'}`}>
                            {campaign.is_active ? 'ACTIVE' : 'INACTIVE'}
                        </div>
                        <div className="flex items-center gap-3 mb-4">
                            <div className={`p-3 rounded-full ${campaign.is_active ? 'bg-red-100 text-red-600' : 'bg-gray-100 text-gray-500'}`}>
                                <Megaphone size={24} />
                            </div>
                            <div>
                                <h3 className="font-bold text-lg text-gray-900 line-clamp-1">{campaign.title}</h3>
                                <p className="text-sm text-gray-500 line-clamp-1">{campaign.description}</p>
                            </div>
                        </div>
                        <div className="space-y-2 mb-6">
                            <div className="flex items-center gap-2 text-sm text-gray-600">
                                <Calendar size={16} />
                                <span>{new Date(campaign.start_time).toLocaleDateString()} - {new Date(campaign.end_time).toLocaleDateString()}</span>
                            </div>
                            {campaign.discount_percentage && (
                                <p className="text-sm text-gray-600"><strong>{campaign.discount_percentage}% OFF</strong></p>
                            )}
                        </div>
                        <div className="flex gap-2">
                            <button className="flex-1 bg-gray-100 text-gray-700 py-2 rounded-lg font-bold hover:bg-gray-200 transition-colors flex items-center justify-center gap-2">
                                <Edit size={16} /> Edit
                            </button>
                            <button
                                onClick={() => handleDelete(campaign.id)}
                                className="flex-1 bg-red-50 text-red-600 py-2 rounded-lg font-bold hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
                            >
                                <Trash2 size={16} /> Delete
                            </button>
                        </div>
                    </div>
                ))}
            </div>

            {/* Create Modal */}
            {isModalOpen && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-xl shadow-xl max-w-md w-full p-6">
                        <div className="flex justify-between items-center mb-6">
                            <h2 className="text-xl font-bold text-gray-800">New Campaign</h2>
                            <button onClick={() => setIsModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>
                        <form onSubmit={handleCreate} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Title</label>
                                <input
                                    type="text"
                                    required
                                    value={formData.title}
                                    onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={formData.description}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Start Date</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.start_time}
                                        onChange={(e) => setFormData({ ...formData, start_time: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">End Date</label>
                                    <input
                                        type="datetime-local"
                                        required
                                        value={formData.end_time}
                                        onChange={(e) => setFormData({ ...formData, end_time: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                    />
                                </div>
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Discount % (Optional)</label>
                                <input
                                    type="number"
                                    value={formData.discount_percentage}
                                    onChange={(e) => setFormData({ ...formData, discount_percentage: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                />
                            </div>
                            <button type="submit" className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors">
                                Create Campaign
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
