import { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup, useMapEvents } from 'react-leaflet';
import { Icon } from 'leaflet';
import 'leaflet/dist/leaflet.css';

// Fix for default markers in react-leaflet
import markerIcon2x from 'leaflet/dist/images/marker-icon-2x.png';
import markerIcon from 'leaflet/dist/images/marker-icon.png';
import markerShadow from 'leaflet/dist/images/marker-shadow.png';

// Set up default icon
const DefaultIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIcon2x,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

// Custom icons for different purposes
const LocationIcon = new Icon({
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
  iconRetinaUrl: markerIcon2x,
  iconSize: [30, 49],
  iconAnchor: [15, 49],
  popupAnchor: [1, -34],
  shadowSize: [41, 41]
});

interface LatLng {
  lat: number;
  lng: number;
}

interface MapComponentProps {
  onLocationSelect: (location: LatLng, address?: string) => void;
  selectedLocation?: LatLng;
  className?: string;
}

// Component to handle map clicks
function MapClickHandler({ onLocationSelect }: { onLocationSelect: (location: LatLng, address?: string) => void }) {
  useMapEvents({
    click(e) {
      const { lat, lng } = e.latlng;
      // Reverse geocoding to get address (simplified)
      reverseGeocode(lat, lng).then((address) => {
        onLocationSelect({ lat, lng }, address);
      });
    },
  });
  return null;
}

// Simple reverse geocoding function
async function reverseGeocode(lat: number, lng: number): Promise<string> {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/reverse?format=json&lat=${lat}&lon=${lng}&zoom=18&addressdetails=1`
    );
    const data = await response.json();
    return data.display_name || `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  } catch (error) {
    return `${lat.toFixed(4)}, ${lng.toFixed(4)}`;
  }
}

export function MapComponent({ onLocationSelect, selectedLocation, className = '' }: MapComponentProps) {
  const [userLocation, setUserLocation] = useState<LatLng | null>(null);
  const [mapCenter, setMapCenter] = useState<LatLng>({ lat: 28.6139, lng: 77.2090 }); // Default: Delhi
  const [isLocating, setIsLocating] = useState(false);

  // Get user's current location
  const getCurrentLocation = () => {
    if (!navigator.geolocation) {
      alert('Geolocation is not supported by this browser.');
      return;
    }

    setIsLocating(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        const location = {
          lat: position.coords.latitude,
          lng: position.coords.longitude
        };
        setUserLocation(location);
        setMapCenter(location);
        onLocationSelect(location);
        setIsLocating(false);
      },
      (error) => {
        console.error('Error getting location:', error);
        alert('Unable to retrieve your location. Please click on the map to select a location.');
        setIsLocating(false);
      },
      {
        enableHighAccuracy: true,
        timeout: 10000,
        maximumAge: 60000
      }
    );
  };

  useEffect(() => {
    if (selectedLocation) {
      setMapCenter(selectedLocation);
    }
  }, [selectedLocation]);

  return (
    <div className={`relative ${className}`}>
      {/* Location Controls */}
      <div className="absolute top-4 left-4 z-[1000] space-y-2">
        <button
          onClick={getCurrentLocation}
          disabled={isLocating}
          className="bg-white hover:bg-gray-50 text-gray-800 font-semibold py-2 px-4 rounded-lg shadow-lg border border-gray-200 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {isLocating ? (
            <span className="flex items-center gap-2">
              <div className="w-4 h-4 border-2 border-green-600 border-t-transparent rounded-full animate-spin"></div>
              Finding...
            </span>
          ) : (
            <span className="flex items-center gap-2">
              🎯 Use Current Location
            </span>
          )}
        </button>
        
        <div className="bg-white/95 backdrop-blur rounded-lg p-3 shadow-lg border border-gray-200 text-sm">
          <p className="font-semibold text-gray-800 mb-1">📍 Location Selection</p>
          <p className="text-gray-600">
            Click anywhere on the map to select your farm location
          </p>
        </div>
      </div>

      {/* Map Container */}
      <MapContainer
        center={mapCenter}
        zoom={13}
        style={{ height: '100%', width: '100%', borderRadius: '12px' }}
        zoomControl={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        
        {/* Map click handler */}
        <MapClickHandler onLocationSelect={onLocationSelect} />
        
        {/* User's current location marker */}
        {userLocation && (
          <Marker position={[userLocation.lat, userLocation.lng]} icon={DefaultIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">📱 Your Current Location</p>
                <p className="text-sm text-gray-600">
                  {userLocation.lat.toFixed(4)}, {userLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
        
        {/* Selected location marker */}
        {selectedLocation && selectedLocation !== userLocation && (
          <Marker position={[selectedLocation.lat, selectedLocation.lng]} icon={LocationIcon}>
            <Popup>
              <div className="text-center">
                <p className="font-semibold">🌾 Selected Farm Location</p>
                <p className="text-sm text-gray-600">
                  {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                </p>
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
      
      {/* Location Info Panel */}
      {selectedLocation && (
        <div className="absolute bottom-4 left-4 right-4 z-[1000] bg-white/95 backdrop-blur rounded-lg p-4 shadow-lg border border-gray-200">
          <div className="flex items-start justify-between">
            <div>
              <p className="font-semibold text-gray-800 mb-1">Selected Location</p>
              <p className="text-sm text-gray-600">
                📍 Lat: {selectedLocation.lat.toFixed(6)}, Lng: {selectedLocation.lng.toFixed(6)}
              </p>
            </div>
            <div className="text-right">
              <p className="text-xs text-gray-500">Click elsewhere to change</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}