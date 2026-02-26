import React, { useEffect, useState } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMap } from 'react-leaflet';
import L from 'leaflet';
import { MapPlace } from '../services/gemini';

// Fix for default marker icons in Leaflet with React
import icon from 'leaflet/dist/images/marker-icon.png';
import iconShadow from 'leaflet/dist/images/marker-shadow.png';

let DefaultIcon = L.icon({
    iconUrl: icon,
    shadowUrl: iconShadow,
    iconSize: [25, 41],
    iconAnchor: [12, 41]
});

L.Marker.prototype.options.icon = DefaultIcon;

interface MapViewProps {
  center: [number, number];
  places: MapPlace[];
}

function ChangeView({ center }: { center: [number, number] }) {
  const map = useMap();
  useEffect(() => {
    map.setView(center, 13);
  }, [center, map]);
  return null;
}

export const MapView: React.FC<MapViewProps> = ({ center, places }) => {
  return (
    <div className="w-full h-full relative">
      <MapContainer 
        center={center} 
        zoom={13} 
        scrollWheelZoom={true}
        className="h-full w-full"
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <ChangeView center={center} />
        
        {/* We don't have lat/lng for places from Gemini Maps tool directly in the chunk usually, 
            but we can show the user's current location */}
        <Marker position={center}>
          <Popup>
            You are here
          </Popup>
        </Marker>

        {/* If we had place coordinates, we'd map them here. 
            Since the tool provides URIs, we'll focus on the list in the chat. */}
      </MapContainer>
      
      <div className="absolute bottom-4 left-4 z-10 bg-white/90 backdrop-blur p-3 rounded-xl shadow-lg border border-black/5 max-w-xs">
        <h3 className="text-sm font-semibold mb-1">Interactive Map</h3>
        <p className="text-xs text-gray-600">
          Ask the chatbot about nearby places, restaurants, or landmarks.
        </p>
      </div>
    </div>
  );
};
