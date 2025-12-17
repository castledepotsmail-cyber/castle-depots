"use client";

import { useState, useEffect } from "react";
import { useRouter, useParams } from "next/navigation";
import { campaignService, Campaign, CampaignBanner } from "@/services/campaignService";
import { productService } from "@/services/productService";
import { ArrowLeft, Save, Plus, Trash2, Check, X, Layout, Image as ImageIcon, Type, Link as LinkIcon, Edit } from "lucide-react";

export default function CampaignEditorPage() {
    const router = useRouter();
    const params = useParams();
    const isNew = params.id === 'create';

    const [campaign, setCampaign] = useState<Partial<Campaign>>({
        title: '',
        slug: '',
        description: '',
        start_time: new Date().toISOString().slice(0, 16),
        end_time: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().slice(0, 16),
        is_active: true,
        theme_mode: 'default',
        product_selection_type: 'manual',
        banners: []
    });

    const [categories, setCategories] = useState<any[]>([]);
    const [loading, setLoading] = useState(!isNew);
    const [saving, setSaving] = useState(false);
    const [activeTab, setActiveTab] = useState<'general' | 'banners' | 'products'>('general');

    // Banner Modal State
    const [isBannerModalOpen, setIsBannerModalOpen] = useState(false);
    const [editingBanner, setEditingBanner] = useState<Partial<CampaignBanner> | null>(null);

    useEffect(() => {
        const loadData = async () => {
            try {
                const cats = await productService.getCategories();
                setCategories(cats);

                if (!isNew && params.id) {
                    const data = await campaignService.getCampaign(params.id as string);
                    // Format dates for input type="datetime-local"
                    data.start_time = data.start_time.slice(0, 16);
                    data.end_time = data.end_time.slice(0, 16);
                    setCampaign(data);
                }
            } catch (error) {
                console.error("Failed to load data", error);
            } finally {
                setLoading(false);
            }
        };
        loadData();
    }, [isNew, params.id]);

    const handleSave = async () => {
        setSaving(true);
        try {
            if (isNew) {
                await campaignService.createCampaign(campaign);
            } else {
                await campaignService.updateCampaign(params.id as string, campaign);
            }
            router.push('/admin/campaigns');
        } catch (error) {
            console.error("Failed to save campaign", error);
            alert("Failed to save campaign. Please check your inputs.");
        } finally {
            setSaving(false);
        }
    };

    const handleBannerSave = async (banner: Partial<CampaignBanner>) => {
        // If campaign is new, we can't save banners yet properly without ID. 
        // For simplicity, we'll just update local state and save later? 
        // No, backend expects banners separately usually or nested.
        // My serializer supports nested read-only. 
        // So I should probably save the campaign first if it's new.

        if (isNew) {
            alert("Please save the campaign first before adding banners.");
            return;
        }

        try {
            if (banner.id) {
                await campaignService.updateBanner(banner.id, banner);
            } else {
                await campaignService.createBanner({ ...banner, campaign: params.id });
            }
            // Reload campaign to get fresh banners
            const data = await campaignService.getCampaign(params.id as string);
            data.start_time = data.start_time.slice(0, 16);
            data.end_time = data.end_time.slice(0, 16);
            setCampaign(data);
            setIsBannerModalOpen(false);
        } catch (error) {
            console.error("Failed to save banner", error);
            alert("Failed to save banner.");
        }
    };

    const handleBannerDelete = async (id: string) => {
        if (confirm("Delete this banner?")) {
            try {
                await campaignService.deleteBanner(id);
                const data = await campaignService.getCampaign(params.id as string);
                data.start_time = data.start_time.slice(0, 16);
                data.end_time = data.end_time.slice(0, 16);
                setCampaign(data);
            } catch (error) {
                console.error("Failed to delete banner", error);
            }
        }
    };

    if (loading) return <div className="p-8 text-center">Loading...</div>;

    return (
        <div className="p-6 max-w-5xl mx-auto">
            {/* Header */}
            <div className="flex justify-between items-center mb-6">
                <div className="flex items-center gap-4">
                    <button onClick={() => router.back()} className="p-2 hover:bg-gray-100 rounded-full">
                        <ArrowLeft size={24} />
                    </button>
                    <h1 className="text-2xl font-bold text-gray-800">{isNew ? 'Create Campaign' : 'Edit Campaign'}</h1>
                </div>
                <button
                    onClick={handleSave}
                    disabled={saving}
                    className="bg-brand-blue text-white px-6 py-2 rounded-lg flex items-center gap-2 hover:bg-blue-700 transition-colors disabled:opacity-50"
                >
                    <Save size={20} /> {saving ? 'Saving...' : 'Save Campaign'}
                </button>
            </div>

            {/* Tabs */}
            <div className="flex border-b border-gray-200 mb-6">
                <button
                    onClick={() => setActiveTab('general')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'general' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    General Info
                </button>
                <button
                    onClick={() => setActiveTab('banners')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'banners' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Banners & UI
                </button>
                <button
                    onClick={() => setActiveTab('products')}
                    className={`px-6 py-3 font-medium text-sm border-b-2 transition-colors ${activeTab === 'products' ? 'border-brand-blue text-brand-blue' : 'border-transparent text-gray-500 hover:text-gray-700'}`}
                >
                    Products
                </button>
            </div>

            {/* Content */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 p-6">
                {activeTab === 'general' && (
                    <div className="space-y-6 max-w-2xl">
                        <div className="grid grid-cols-2 gap-6">
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Campaign Title</label>
                                <input
                                    type="text"
                                    value={campaign.title}
                                    onChange={e => setCampaign({ ...campaign, title: e.target.value, slug: e.target.value.toLowerCase().replace(/\s+/g, '-') })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                    placeholder="e.g. Summer Sale 2025"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Slug (URL)</label>
                                <input
                                    type="text"
                                    value={campaign.slug}
                                    onChange={e => setCampaign({ ...campaign, slug: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none bg-gray-50"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Start Time</label>
                                <input
                                    type="datetime-local"
                                    value={campaign.start_time}
                                    onChange={e => setCampaign({ ...campaign, start_time: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">End Time</label>
                                <input
                                    type="datetime-local"
                                    value={campaign.end_time}
                                    onChange={e => setCampaign({ ...campaign, end_time: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                />
                            </div>
                            <div className="col-span-2">
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description</label>
                                <textarea
                                    value={campaign.description}
                                    onChange={e => setCampaign({ ...campaign, description: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none h-32"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Theme Mode</label>
                                <select
                                    value={campaign.theme_mode}
                                    onChange={e => setCampaign({ ...campaign, theme_mode: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                >
                                    <option value="default">Default Blue/Gold</option>
                                    <option value="dark">Dark Mode</option>
                                    <option value="red">Red Mode (Flash Sale)</option>
                                    <option value="green">Green Mode (Holiday)</option>
                                    <option value="custom">Custom Colors</option>
                                </select>
                            </div>
                            <div className="flex items-center pt-6">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={campaign.is_active}
                                        onChange={e => setCampaign({ ...campaign, is_active: e.target.checked })}
                                        className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue"
                                    />
                                    <span className="font-medium text-gray-700">Campaign Active</span>
                                </label>
                            </div>
                        </div>
                    </div>
                )}

                {activeTab === 'banners' && (
                    <div>
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-lg font-bold text-gray-800">Active Banners</h3>
                            <button
                                onClick={() => {
                                    if (isNew) {
                                        alert("Please save the campaign first.");
                                        return;
                                    }
                                    setEditingBanner({ is_active: true, type: 'top_bar' });
                                    setIsBannerModalOpen(true);
                                }}
                                className="text-brand-blue hover:bg-blue-50 px-3 py-1.5 rounded-lg font-medium flex items-center gap-2 transition-colors"
                            >
                                <Plus size={18} /> Add Banner
                            </button>
                        </div>

                        <div className="space-y-4">
                            {campaign.banners?.map((banner) => (
                                <div key={banner.id} className="border border-gray-200 rounded-xl p-4 flex items-center justify-between hover:border-brand-blue/30 transition-colors">
                                    <div className="flex items-center gap-4">
                                        <div className={`w-10 h-10 rounded-lg flex items-center justify-center ${banner.is_active ? 'bg-green-100 text-green-600' : 'bg-gray-100 text-gray-400'}`}>
                                            <Layout size={20} />
                                        </div>
                                        <div>
                                            <h4 className="font-bold text-gray-800">{banner.heading || 'Untitled Banner'}</h4>
                                            <div className="flex items-center gap-2 text-sm text-gray-500">
                                                <span className="capitalize bg-gray-100 px-2 py-0.5 rounded text-xs">{banner.type.replace('_', ' ')}</span>
                                                {banner.link && <span className="flex items-center gap-1"><LinkIcon size={12} /> {banner.link}</span>}
                                            </div>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2">
                                        <button
                                            onClick={() => {
                                                setEditingBanner(banner);
                                                setIsBannerModalOpen(true);
                                            }}
                                            className="p-2 text-gray-400 hover:text-brand-blue hover:bg-blue-50 rounded-lg transition-colors"
                                        >
                                            <Edit size={18} />
                                        </button>
                                        <button
                                            onClick={() => handleBannerDelete(banner.id)}
                                            className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <Trash2 size={18} />
                                        </button>
                                    </div>
                                </div>
                            ))}
                            {(!campaign.banners || campaign.banners.length === 0) && (
                                <div className="text-center py-12 text-gray-500 bg-gray-50 rounded-xl border border-dashed border-gray-200">
                                    No banners configured yet.
                                </div>
                            )}
                        </div>
                    </div>
                )}

                {activeTab === 'products' && (
                    <div className="space-y-6 max-w-2xl">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">Product Selection Method</label>
                            <div className="grid grid-cols-3 gap-4">
                                {['manual', 'category', 'all'].map((type) => (
                                    <button
                                        key={type}
                                        onClick={() => setCampaign({ ...campaign, product_selection_type: type as any })}
                                        className={`p-4 rounded-xl border-2 text-center transition-all ${campaign.product_selection_type === type ? 'border-brand-blue bg-blue-50 text-brand-blue' : 'border-gray-200 hover:border-gray-300'}`}
                                    >
                                        <span className="capitalize font-bold block mb-1">{type}</span>
                                        <span className="text-xs text-gray-500">
                                            {type === 'manual' ? 'Select specific products' : type === 'category' ? 'All products in a category' : 'Everything in store'}
                                        </span>
                                    </button>
                                ))}
                            </div>
                        </div>

                        {campaign.product_selection_type === 'category' && (
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Target Category</label>
                                <select
                                    value={campaign.target_category || ''}
                                    onChange={e => setCampaign({ ...campaign, target_category: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-brand-blue/20 outline-none"
                                >
                                    <option value="">Select a category...</option>
                                    {categories.map(cat => (
                                        <option key={cat.id} value={cat.id}>{cat.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}

                        {campaign.product_selection_type === 'manual' && (
                            <div className="bg-yellow-50 p-4 rounded-lg text-yellow-800 text-sm">
                                Manual product selection is managed via the Products list page (bulk actions) or by editing individual products.
                            </div>
                        )}
                    </div>
                )}
            </div>

            {/* Banner Modal */}
            {isBannerModalOpen && editingBanner && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm p-4">
                    <div className="bg-white rounded-2xl shadow-xl w-full max-w-lg overflow-hidden">
                        <div className="p-4 border-b border-gray-100 flex justify-between items-center bg-gray-50">
                            <h3 className="font-bold text-gray-800">{editingBanner.id ? 'Edit Banner' : 'New Banner'}</h3>
                            <button onClick={() => setIsBannerModalOpen(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={20} />
                            </button>
                        </div>
                        <div className="p-6 space-y-4 max-h-[70vh] overflow-y-auto">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Banner Type</label>
                                <select
                                    value={editingBanner.type}
                                    onChange={e => setEditingBanner({ ...editingBanner, type: e.target.value as any })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                >
                                    <option value="top_bar">Top Notification Bar</option>
                                    <option value="hero_slide">Hero Carousel Slide</option>
                                    <option value="flash_sale">Flash Sale Section</option>
                                    <option value="popup">Popup Modal</option>
                                </select>
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Heading</label>
                                <input
                                    type="text"
                                    value={editingBanner.heading || ''}
                                    onChange={e => setEditingBanner({ ...editingBanner, heading: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                    placeholder="e.g. Flash Sale!"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Subheading / Text</label>
                                <textarea
                                    value={editingBanner.subheading || ''}
                                    onChange={e => setEditingBanner({ ...editingBanner, subheading: e.target.value })}
                                    className="w-full px-3 py-2 border border-gray-200 rounded-lg h-20"
                                    placeholder="e.g. 50% Off everything..."
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Button Text</label>
                                    <input
                                        type="text"
                                        value={editingBanner.button_text || ''}
                                        onChange={e => setEditingBanner({ ...editingBanner, button_text: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        placeholder="Shop Now"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-medium text-gray-700 mb-1">Link URL</label>
                                    <input
                                        type="text"
                                        value={editingBanner.link || ''}
                                        onChange={e => setEditingBanner({ ...editingBanner, link: e.target.value })}
                                        className="w-full px-3 py-2 border border-gray-200 rounded-lg"
                                        placeholder="/shop"
                                    />
                                </div>
                            </div>
                            <div className="flex items-center pt-2">
                                <label className="flex items-center gap-2 cursor-pointer">
                                    <input
                                        type="checkbox"
                                        checked={editingBanner.is_active}
                                        onChange={e => setEditingBanner({ ...editingBanner, is_active: e.target.checked })}
                                        className="w-5 h-5 text-brand-blue rounded focus:ring-brand-blue"
                                    />
                                    <span className="font-medium text-gray-700">Banner Active</span>
                                </label>
                            </div>
                        </div>
                        <div className="p-4 border-t border-gray-100 flex justify-end gap-3 bg-gray-50">
                            <button onClick={() => setIsBannerModalOpen(false)} className="px-4 py-2 text-gray-600 hover:bg-gray-200 rounded-lg font-medium">Cancel</button>
                            <button onClick={() => handleBannerSave(editingBanner)} className="px-4 py-2 bg-brand-blue text-white rounded-lg font-medium hover:bg-blue-700">Save Banner</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
