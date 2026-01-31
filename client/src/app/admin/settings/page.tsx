"use client";

import { useState, useEffect } from "react";
import { adminService } from "@/services/adminService";
import { toast } from "react-hot-toast";
import dynamic from "next/dynamic";
import { Loader2, Save } from "lucide-react";
import { Skeleton } from "@/components/ui/Skeleton";

// Dynamic import for Map to avoid SSR issues
const AddressMap = dynamic(() => import("@/components/common/AddressMap"), {
    ssr: false,
    loading: () => <div className="h-64 bg-gray-100 rounded-lg animate-pulse flex items-center justify-center text-gray-400">Loading Map...</div>
});

export default function StoreSettingsPage() {
    const [settings, setSettings] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        const fetchSettings = async () => {
            try {
                const data = await adminService.getStoreSettings();
                setSettings(data);
            } catch (error) {
                console.error("Failed to load settings", error);
                toast.error("Failed to load store settings");
            } finally {
                setLoading(false);
            }
        };
        fetchSettings();
    }, []);

    const handleSave = async (e: React.FormEvent) => {
        e.preventDefault();
        setSaving(true);
        try {
            const updated = await adminService.updateStoreSettings(settings);
            setSettings(updated);
            toast.success("Settings saved successfully");
        } catch (error) {
            console.error("Failed to save settings", error);
            toast.error("Failed to save settings");
        } finally {
            setSaving(false);
        }
    };

    return (
        <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800 mb-6">Store Configuration</h1>

            <form onSubmit={handleSave} className="max-w-4xl bg-white rounded-xl shadow-sm border border-gray-100 p-6 space-y-8">

                {/* General Info */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">General Information</h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Name</label>
                            {loading ? <Skeleton className="h-10 w-full" /> : (
                                <input
                                    type="text"
                                    value={settings?.store_name || ''}
                                    onChange={(e) => setSettings({ ...settings, store_name: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                                />
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Store Address (Text)</label>
                            {loading ? <Skeleton className="h-24 w-full" /> : (
                                <textarea
                                    value={settings?.store_address || ''}
                                    onChange={(e) => setSettings({ ...settings, store_address: e.target.value })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                                    rows={3}
                                />
                            )}
                        </div>
                    </div>
                </div>

                {/* Location */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Store Location</h2>
                    <p className="text-sm text-gray-500 mb-4">Pin the exact location of your store/warehouse for delivery calculations.</p>
                    {loading ? <Skeleton className="h-64 w-full rounded-lg" /> : (
                        <AddressMap
                            latitude={settings?.latitude || 0}
                            longitude={settings?.longitude || 0}
                            onLocationSelect={(lat, lng) => setSettings({ ...settings, latitude: lat, longitude: lng })}
                        />
                    )}
                    <div className="grid grid-cols-2 gap-4 mt-4">
                        <div>
                            <label className="block text-xs text-gray-500">Latitude</label>
                            {loading ? <Skeleton className="h-8 w-full" /> : (
                                <input type="text" value={settings?.latitude || ''} readOnly className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm" />
                            )}
                        </div>
                        <div>
                            <label className="block text-xs text-gray-500">Longitude</label>
                            {loading ? <Skeleton className="h-8 w-full" /> : (
                                <input type="text" value={settings?.longitude || ''} readOnly className="w-full bg-gray-50 border border-gray-200 rounded px-2 py-1 text-sm" />
                            )}
                        </div>
                    </div>
                </div>

                {/* Shipping Config */}
                <div>
                    <h2 className="text-lg font-semibold text-gray-800 mb-4 border-b pb-2">Shipping Configuration</h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Cost per KM (KES)</label>
                            {loading ? <Skeleton className="h-10 w-full" /> : (
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">KES</span>
                                    <input
                                        type="number"
                                        value={settings?.cost_per_km || ''}
                                        onChange={(e) => setSettings({ ...settings, cost_per_km: parseFloat(e.target.value) })}
                                        className="w-full pl-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                                        step="0.01"
                                    />
                                </div>
                            )}
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Base Shipping Cost (KES)</label>
                            {loading ? <Skeleton className="h-10 w-full" /> : (
                                <div className="relative">
                                    <span className="absolute left-3 top-2 text-gray-500">KES</span>
                                    <input
                                        type="number"
                                        value={settings?.base_shipping_cost || ''}
                                        onChange={(e) => setSettings({ ...settings, base_shipping_cost: parseFloat(e.target.value) })}
                                        className="w-full pl-12 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                                        step="0.01"
                                    />
                                </div>
                            )}
                            <p className="text-xs text-gray-500 mt-1">Minimum cost applied to all deliveries.</p>
                        </div>
                        <div>
                            <label className="block text-sm font-medium text-gray-700 mb-1">Max Delivery Distance (KM)</label>
                            {loading ? <Skeleton className="h-10 w-full" /> : (
                                <input
                                    type="number"
                                    value={settings?.max_delivery_distance || ''}
                                    onChange={(e) => setSettings({ ...settings, max_delivery_distance: parseFloat(e.target.value) })}
                                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-brand-blue/20 focus:border-brand-blue"
                                    step="0.1"
                                />
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex justify-end pt-4">
                    <button
                        type="submit"
                        disabled={saving}
                        className="bg-brand-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-brand-gold hover:text-brand-blue transition-colors flex items-center gap-2 disabled:opacity-50"
                    >
                        {saving ? <Loader2 className="animate-spin" size={20} /> : <Save size={20} />}
                        Save Configuration
                    </button>
                </div>
            </form>
        </div>
    );
}
