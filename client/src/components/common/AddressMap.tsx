"use client";

import { MapContainer, TileLayer, Marker, useMapEvents } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { useEffect } from "react";

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
    const position: [number, number] | null = latitude && longitude ? [latitude, longitude] : null;

    return (
        <div className="h-64 w-full rounded-lg overflow-hidden border border-gray-300 relative z-0">
            <MapContainer center={position || defaultPosition} zoom={13} scrollWheelZoom={false} style={{ height: "100%", width: "100%" }}>
                <TileLayer
                    attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                    url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
                />
                <LocationMarker
                    position={position}
                    setPosition={onLocationSelect ? (pos) => onLocationSelect(pos[0], pos[1]) : undefined}
                />
            </MapContainer>
        </div>
    );
}
