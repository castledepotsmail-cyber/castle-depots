"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect, useState } from "react";

// Fix for default marker icon
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
    iconRetinaUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png',
    iconUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png',
    shadowUrl: 'https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png',
});

function LocationMarker({ position, setPosition }: { position: [number, number] | null, setPosition?: (pos: [number, number]) => void }) {
    const map = useMapEvents({
        click(e) {
            if (setPosition) {
                setPosition([e.latlng.lat, e.latlng.lng]);
            }
        },
    });

    useEffect(() => {
        if (position) {
            map.flyTo(position, map.getZoom());
        }
    }, [position, map]);

    return position === null ? null : (
        <Marker position={position}></Marker>
    );
}

interface AddressMapProps {
    latitude?: number;
    longitude?: number;
    onLocationSelect?: (lat: number, lng: number) => void;
}

export default function AddressMap({ latitude, longitude, onLocationSelect }: AddressMapProps) {
    const defaultPosition: [number, number] = [-1.2921, 36.8219]; // Default to Nairobi
    const [position, setPosition] = useState<[number, number] | null>(latitude && longitude ? [latitude, longitude] : null);
    const [searchQuery, setSearchQuery] = useState("");
    const [searchResults, setSearchResults] = useState<any[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    // Update internal position when props change
    useEffect(() => {
        if (latitude && longitude) {
            setPosition([latitude, longitude]);
        }
    }, [latitude, longitude]);

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!searchQuery.trim()) return;

        setIsSearching(true);
        try {
            const response = await fetch(`https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(searchQuery)}`);
            const data = await response.json();
            setSearchResults(data);
        } catch (error) {
            console.error("Search failed", error);
        } finally {
            setIsSearching(false);
        }
    };

    const handleSelectLocation = (lat: number, lon: number) => {
        const newPos: [number, number] = [lat, lon];
        setPosition(newPos);
        setSearchResults([]);
        setSearchQuery("");
        if (onLocationSelect) {
            onLocationSelect(lat, lon);
        }
    };

    return (
        <div className="space-y-2">
            <div className="relative">
                <form onSubmit={handleSearch} className="flex gap-2">
                    <input
                        type="text"
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        placeholder="Search for a place (e.g. Westlands, Nairobi)"
                        className="flex-grow px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:border-brand-blue text-sm"
                    />
                    <button
                        type="submit"
                        disabled={isSearching}
                        className="px-4 py-2 bg-gray-100 text-gray-700 rounded-lg text-sm font-bold hover:bg-gray-200 disabled:opacity-50"
                    >
                        {isSearching ? '...' : 'Search'}
                    </button>
                </form>

                {searchResults.length > 0 && (
                    <div className="absolute top-full left-0 right-0 z-10 bg-white border border-gray-200 rounded-lg shadow-lg mt-1 max-h-48 overflow-y-auto">
                        {searchResults.map((result: any) => (
                            <button
                                key={result.place_id}
                                onClick={() => handleSelectLocation(parseFloat(result.lat), parseFloat(result.lon))}
                                className="w-full text-left px-3 py-2 text-sm hover:bg-gray-50 border-b border-gray-100 last:border-0"
                            >
                                {result.display_name}
                            </button>
                        ))}
                    </div>
                )}
            </div>

            <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 relative z-0">
                <MapContainer center={position || defaultPosition} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                    <TileLayer
                        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                    />
                    <LocationMarker
                        position={position}
                        setPosition={onLocationSelect ? (pos) => {
                            setPosition(pos);
                            onLocationSelect(pos[0], pos[1]);
                        } : undefined}
                    />
                </MapContainer>
            </div>
        </div>
    );
}
