"use client";

import { User, MapPin, Save, Plus, X, Trash2, Edit2, Check } from "lucide-react";
import { useEffect, useState } from "react";
import { userService } from "@/services/userService";
import { addressService, Address } from "@/services/addressService";
import { useAuthStore } from "@/store/authStore";

export default function ProfilePage() {
    const { user, setUser } = useAuthStore();
    const [addresses, setAddresses] = useState<Address[]>([]);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    // Profile Form State
    const [profileForm, setProfileForm] = useState({
        first_name: '',
        last_name: '',
        email: '',
        phone_number: ''
    });

    // Address Modal State
    const [showAddressModal, setShowAddressModal] = useState(false);
    const [editingAddress, setEditingAddress] = useState<Address | null>(null);
    const [addressForm, setAddressForm] = useState({
        title: '',
        full_name: '',
        phone_number: '',
        street_address: '',
        city: '',
        postal_code: '',
        is_default: false
    });

    useEffect(() => {
        if (user) {
            setProfileForm({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone_number: user.phone_number || ''
            });
        }
    }, [user]);

    const fetchAddresses = async () => {
        try {
            const data = await addressService.getAddresses();
            setAddresses(data);
        } catch (error) {
            console.error("Failed to fetch addresses", error);
        }
    };

    useEffect(() => {
        const init = async () => {
            await fetchAddresses();
            setLoading(false);
        };
        init();
    }, []);

    const handleSaveProfile = async () => {
        setSaving(true);
        try {
            const updatedUser = await userService.updateProfile(profileForm);
            setUser(updatedUser);
            alert('Profile updated successfully!');
        } catch (error) {
            console.error('Failed to update profile', error);
            alert('Failed to update profile. Please try again.');
        } finally {
            setSaving(false);
        }
    };

    // Address Handlers
    const openAddressModal = (address?: Address) => {
        if (address) {
            setEditingAddress(address);
            setAddressForm({
                title: address.title,
                full_name: address.full_name,
                phone_number: address.phone_number,
                street_address: address.street_address,
                city: address.city,
                postal_code: address.postal_code || '',
                is_default: address.is_default
            });
        } else {
            setEditingAddress(null);
            setAddressForm({
                title: '',
                full_name: '',
                phone_number: '',
                street_address: '',
                city: '',
                postal_code: '',
                is_default: false
            });
        }
        setShowAddressModal(true);
    };

    const handleSaveAddress = async (e: React.FormEvent) => {
        e.preventDefault();
        try {
            if (editingAddress) {
                await addressService.updateAddress(editingAddress.id, addressForm);
            } else {
                await addressService.createAddress(addressForm);
            }
            await fetchAddresses();
            setShowAddressModal(false);
        } catch (error) {
            console.error("Failed to save address", error);
            alert("Failed to save address.");
        }
    };

    const handleDeleteAddress = async (id: string) => {
        if (confirm("Are you sure you want to delete this address?")) {
            try {
                await addressService.deleteAddress(id);
                await fetchAddresses();
            } catch (error) {
                console.error("Failed to delete address", error);
            }
        }
    };

    const handleSetDefault = async (address: Address) => {
        try {
            await addressService.updateAddress(address.id, { is_default: true });
            await fetchAddresses();
        } catch (error) {
            console.error("Failed to set default address", error);
        }
    };

    if (loading) {
        return <div className="p-8 text-center">Loading profile...</div>;
    }

    return (
        <div className="space-y-8 relative">
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
                            value={profileForm.first_name}
                            onChange={(e) => setProfileForm({ ...profileForm, first_name: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Last Name</label>
                        <input
                            type="text"
                            value={profileForm.last_name}
                            onChange={(e) => setProfileForm({ ...profileForm, last_name: e.target.value })}
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
                            value={profileForm.email}
                            onChange={(e) => setProfileForm({ ...profileForm, email: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                        />
                    </div>
                    <div>
                        <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                        <input
                            type="tel"
                            value={profileForm.phone_number}
                            onChange={(e) => setProfileForm({ ...profileForm, phone_number: e.target.value })}
                            className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                        />
                    </div>
                </div>
                <button
                    onClick={handleSaveProfile}
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
                    <button
                        onClick={() => openAddressModal()}
                        className="text-sm text-brand-blue font-bold hover:underline flex items-center gap-1"
                    >
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
                                <p className="text-sm text-gray-600 mb-3">
                                    {addr.full_name}<br />
                                    {addr.street_address}<br />
                                    {addr.city}, {addr.postal_code}<br />
                                    {addr.phone_number}
                                </p>
                                <div className="flex gap-3 text-sm font-semibold">
                                    <button onClick={() => openAddressModal(addr)} className="text-brand-blue hover:underline flex items-center gap-1">
                                        <Edit2 size={14} /> Edit
                                    </button>
                                    <button onClick={() => handleDeleteAddress(addr.id)} className="text-red-500 hover:underline flex items-center gap-1">
                                        <Trash2 size={14} /> Delete
                                    </button>
                                    {!addr.is_default && (
                                        <button onClick={() => handleSetDefault(addr)} className="text-gray-500 hover:underline flex items-center gap-1">
                                            <Check size={14} /> Set Default
                                        </button>
                                    )}
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>

            {/* Address Modal */}
            {showAddressModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
                    <div className="bg-white rounded-2xl w-full max-w-md p-6 shadow-xl">
                        <div className="flex justify-between items-center mb-6">
                            <h3 className="text-xl font-bold text-gray-900">
                                {editingAddress ? 'Edit Address' : 'Add New Address'}
                            </h3>
                            <button onClick={() => setShowAddressModal(false)} className="text-gray-400 hover:text-gray-600">
                                <X size={24} />
                            </button>
                        </div>

                        <form onSubmit={handleSaveAddress} className="space-y-4">
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Address Title (e.g. Home, Office)</label>
                                <input
                                    required
                                    type="text"
                                    value={addressForm.title}
                                    onChange={(e) => setAddressForm({ ...addressForm, title: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                    placeholder="Home"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Full Name</label>
                                <input
                                    required
                                    type="text"
                                    value={addressForm.full_name}
                                    onChange={(e) => setAddressForm({ ...addressForm, full_name: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Phone Number</label>
                                <input
                                    required
                                    type="tel"
                                    value={addressForm.phone_number}
                                    onChange={(e) => setAddressForm({ ...addressForm, phone_number: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-bold text-gray-700 mb-1">Street Address / Location</label>
                                <textarea
                                    required
                                    value={addressForm.street_address}
                                    onChange={(e) => setAddressForm({ ...addressForm, street_address: e.target.value })}
                                    className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue h-24 resize-none"
                                />
                            </div>
                            <div className="grid grid-cols-2 gap-4">
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">City / Town</label>
                                    <input
                                        required
                                        type="text"
                                        value={addressForm.city}
                                        onChange={(e) => setAddressForm({ ...addressForm, city: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                    />
                                </div>
                                <div>
                                    <label className="block text-sm font-bold text-gray-700 mb-1">Postal Code</label>
                                    <input
                                        type="text"
                                        value={addressForm.postal_code}
                                        onChange={(e) => setAddressForm({ ...addressForm, postal_code: e.target.value })}
                                        className="w-full px-4 py-2 bg-gray-50 border border-gray-200 rounded-lg focus:outline-none focus:border-brand-blue"
                                    />
                                </div>
                            </div>

                            <label className="flex items-center gap-2 cursor-pointer">
                                <input
                                    type="checkbox"
                                    checked={addressForm.is_default}
                                    onChange={(e) => setAddressForm({ ...addressForm, is_default: e.target.checked })}
                                    className="rounded text-brand-blue focus:ring-brand-blue"
                                />
                                <span className="text-sm text-gray-700">Set as default address</span>
                            </label>

                            <button
                                type="submit"
                                className="w-full bg-brand-blue text-white py-3 rounded-xl font-bold hover:bg-blue-700 transition-colors mt-4"
                            >
                                {editingAddress ? 'Update Address' : 'Save Address'}
                            </button>
                        </form>
                    </div>
                </div>
            )}
        </div>
    );
}
