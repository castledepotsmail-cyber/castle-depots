"use client";

import { User, MapPin, Save, Plus } from "lucide-react";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const [addresses, setAddresses] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: ''
    });

    useEffect(() => {
        if (user) {
            setFormData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone_number: user.phone_number || ''
            });
        }
    }, [user]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const addressData = await userService.getAddresses();
                setAddresses(addressData);
            } catch (error) {
                console.error("Failed to fetch address data", error);
            } finally {
                setLoading(false);
            }
        };
        fetchData();
    }, []);

    const handleSave = async () => {
        setSaving(true);
        try {
            const updatedUser = await userService.updateProfile(formData);
            setUser(updatedUser);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    return (
        <div className="space-y-8">
            <h1 className="font-display text-2xl font-bold text-gray-800">My Profile</h1>

            {/* Personal Information */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h2 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                    <User className="text-brand-blue" size={20} /> Personal Information
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">First Name</label>
                        <input 
                            type="text" 
                            value={formData.first_name} 
                            onChange={(e) => setFormData({...formData, first_name: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                        <input 
                            type="text" 
                            value={formData.last_name} 
                            onChange={(e) => setFormData({...formData, last_name: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Username</label>
                        <input type="text" defaultValue={user?.username} readOnly className="w-full px-4 py-2 bg-gray-100 border border-gray-200 rounded-lg focus:outline-none text-gray-500 cursor-not-allowed" />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Email Address</label>
                        <input 
                            type="email" 
                            value={formData.email} 
                            onChange={(e) => setFormData({...formData, email: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" 
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                        <input 
                            type="tel" 
                            value={formData.phone_number} 
                            onChange={(e) => setFormData({...formData, phone_number: e.target.value})}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue" 
                        />
                    </div>
                </div>
                <button 
                    onClick={handleSave}
                    disabled={saving}
                    className="mt-6 bg-brand-blue text-white px-6 py-2 rounded-lg font-bold hover:bg-blue-700 transition-colors flex items-center gap-2 disabled:opacity-50"
                >
                    <Save size={18} /> {saving ? 'Saving...' : 'Save Changes'}
                </button>
            </div>

            {/* Address Book */}
            <div className="bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <div className="flex justify-between items-center mb-4">
                    <h2 className="text-lg font-bold text-gray-800 flex items-center gap-2">
                        <MapPin className="text-brand-blue" size={20} /> Address Book
                    </h2>
                    <button className="text-sm text-brand-blue font-bold hover:underline flex items-center gap-1">
                        <Plus size={16} /> Add New Address
                    </button>
                </div>

                {addresses.length === 0 ? (
                    <p className="text-gray-500 italic">No addresses saved yet.</p>
                ) : (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((addr) => (
                            <div key={addr.id} className={`border p-4 rounded-xl relative ${addr.is_default ? 'border-brand-blue bg-blue-50' : 'border-gray-200 hover:border-gray-300'}`}>
                                {addr.is_default && (
                                    <span className="absolute top-4 right-4 bg-brand-blue text-white text-xs px-2 py-0.5 rounded font-bold">Default</span>
                                )}
                                <h3 className="font-bold text-gray-900 mb-1">{addr.title}</h3>
                                <p className="text-sm text-gray-600">
                                    {addr.full_name}<br />
                                    {addr.street_address}<br />
                                    {addr.city}, {addr.postal_code}<br />
                                    {addr.phone_number}
                                </p>
                                <div className="mt-4 flex gap-3 text-sm font-semibold">
                                    <button className="text-brand-blue hover:underline">Edit</button>
                                    <button className="text-red-500 hover:underline">Delete</button>
                                    {!addr.is_default && (
                                        <button className="text-gray-500 hover:underline">Set as Default</button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
