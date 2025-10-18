import { useState } from 'react';
import { Header } from '../components/Header';
import { MapComponent } from '../components/MapComponent';
import { MapPin, Sprout, Cloud, Droplet, Navigation, CheckCircle } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/Button';
import weatherData from '../data/weather.json';

interface LatLng {
  lat: number;
  lng: number;
}

export function MapScreen() {
  const { userLocation, setUserLocation } = useAppStore();
  const [selectedLocation, setSelectedLocation] = useState<LatLng | null>(userLocation);
  const [locationAddress, setLocationAddress] = useState<string>('');
  const [isLocationConfirmed, setIsLocationConfirmed] = useState(false);

  const handleLocationSelect = (location: LatLng, address?: string) => {
    setSelectedLocation(location);
    setUserLocation(location);
    if (address) {
      setLocationAddress(address);
    }
    setIsLocationConfirmed(false);
  };

  const handleConfirmLocation = () => {
    if (selectedLocation) {
      setIsLocationConfirmed(true);
      // Here we can add navigation to dashboard or show farm plots
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Location Selection Header */}
          <div className="mb-8 text-center">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
              🌾 Welcome to ApnaKeth
            </h1>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              Select your farm location to start monitoring crop health with AI-powered insights
            </p>
          </div>

          {/* Interactive Map Section */}
          <div className="glassmorphism rounded-2xl overflow-hidden shadow-xl mb-8">
            <div className="p-6 md:p-8 border-b border-white/30">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    � Select Your Farm Location
                  </h2>
                  <p className="text-gray-600">
                    Click on the map or use your current location to get started
                  </p>
                </div>
                {selectedLocation && (
                  <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
                    <div className="bg-white/70 rounded-lg px-4 py-2">
                      <p className="text-sm text-gray-600">Selected Location:</p>
                      <p className="font-semibold text-green-600">
                        {selectedLocation.lat.toFixed(4)}, {selectedLocation.lng.toFixed(4)}
                      </p>
                    </div>
                    {!isLocationConfirmed && (
                      <Button
                        onClick={handleConfirmLocation}
                        variant="primary"
                        className="whitespace-nowrap"
                      >
                        Confirm Location
                      </Button>
                    )}
                    {isLocationConfirmed && (
                      <div className="flex items-center gap-2 bg-green-100 text-green-800 px-4 py-2 rounded-lg">
                        <MapPin className="w-4 h-4" />
                        <span className="font-semibold">Location Confirmed!</span>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
            
            {/* OpenStreetMap Component */}
            <div className="h-[60vh] md:h-[70vh]">
              <MapComponent
                onLocationSelect={handleLocationSelect}
                selectedLocation={selectedLocation || undefined}
                className="w-full h-full"
              />
            </div>
          </div>

          {/* Current Weather Info */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Cloud className="w-8 h-8 text-blue-600" />
                <h3 className="font-bold text-gray-800 text-lg">Current Weather</h3>
              </div>
              <p className="text-3xl font-bold text-gray-800 mb-1">
                {weatherData.current.temperature}°C
              </p>
              <p className="text-sm text-gray-600 capitalize">
                {weatherData.current.condition.replace('_', ' ')}
              </p>
              <div className="mt-3 grid grid-cols-2 gap-2 text-xs text-gray-600">
                <div className="flex items-center justify-center gap-1">
                  <Droplet className="w-3 h-3" />
                  {weatherData.current.humidity}%
                </div>
                <div>🌬️ {weatherData.current.windSpeed} km/h</div>
              </div>
            </div>

            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <Sprout className="w-8 h-8 text-green-600" />
                <h3 className="font-bold text-gray-800 text-lg">Smart Monitoring</h3>
              </div>
              <p className="text-sm text-gray-600 mb-2">Real-time satellite analysis</p>
              <p className="text-xs text-gray-500">
                NDVI • Soil Health • Weather Alerts
              </p>
            </div>

            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="flex items-center justify-center gap-3 mb-3">
                <MapPin className="w-8 h-8 text-purple-600" />
                <h3 className="font-bold text-gray-800 text-lg">Location Status</h3>
              </div>
              {selectedLocation ? (
                <div>
                  <p className="text-sm text-green-600 font-semibold mb-1">✅ Location Selected</p>
                  <p className="text-xs text-gray-500">
                    Ready to analyze your farmland
                  </p>
                </div>
              ) : (
                <div>
                  <p className="text-sm text-gray-500 mb-1">📍 No location selected</p>
                  <p className="text-xs text-gray-400">
                    Click on the map to select
                  </p>
                </div>
              )}
            </div>
          </div>

          {/* Next Steps */}
          {isLocationConfirmed && (
            <div className="glassmorphism rounded-2xl p-6 md:p-8 shadow-xl">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 text-center">
                🎉 Location Confirmed! What's Next?
              </h3>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                <div className="bg-white/70 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🛰️</div>
                  <h4 className="font-bold text-gray-800 mb-2">Satellite Analysis</h4>
                  <p className="text-sm text-gray-600">
                    We'll analyze your land using satellite imagery for NDVI and crop health
                  </p>
                </div>
                <div className="bg-white/70 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🌱</div>
                  <h4 className="font-bold text-gray-800 mb-2">Crop Detection</h4>
                  <p className="text-sm text-gray-600">
                    Identify crop types and growth stages automatically
                  </p>
                </div>
                <div className="bg-white/70 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">📊</div>
                  <h4 className="font-bold text-gray-800 mb-2">Health Dashboard</h4>
                  <p className="text-sm text-gray-600">
                    View detailed analytics and recommendations for your farm
                  </p>
                </div>
                <div className="bg-white/70 rounded-xl p-4 text-center">
                  <div className="text-3xl mb-2">🤖</div>
                  <h4 className="font-bold text-gray-800 mb-2">AI Assistant</h4>
                  <p className="text-sm text-gray-600">
                    Get personalized farming advice and alerts
                  </p>
                </div>
              </div>
              <div className="text-center mt-6">
                <Button variant="primary" size="lg" className="px-8">
                  Continue to Dashboard
                </Button>
              </div>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
