import { useNavigate } from 'react-router-dom';
import { MapPin, Navigation } from 'lucide-react';
import { Header } from '../components/Header';
import Button from '../components/Button';
import { useAppStore } from '../store/useAppStore';

export function MapScreen() {
  const navigate = useNavigate();
  const setUserLocation = useAppStore((state) => state.setUserLocation);

  const handleLocationSelect = () => {
    // Mock location selection
    setUserLocation({ lat: 28.6139, lng: 77.2090 });
    navigate('/lands');
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Map Container */}
          <div className="glassmorphism rounded-2xl overflow-hidden shadow-xl mb-6">
            <div 
              className="w-full h-[50vh] md:h-[60vh] bg-gradient-to-br from-green-100 via-emerald-100 to-teal-100 relative flex items-center justify-center"
              style={{
                backgroundImage: 'url("data:image/svg+xml,%3Csvg width=\'60\' height=\'60\' viewBox=\'0 0 60 60\' xmlns=\'http://www.w3.org/2000/svg\'%3E%3Cg fill=\'none\' fill-rule=\'evenodd\'%3E%3Cg fill=\'%2322c55e\' fill-opacity=\'0.05\'%3E%3Cpath d=\'M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z\'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")'
              }}
            >
              {/* Mock Map with Land Markers */}
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="relative w-full h-full max-w-4xl max-h-96">
                  {/* Central marker */}
                  <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2">
                    <div className="relative">
                      <div className="absolute -inset-4 bg-green-500 rounded-full opacity-20 animate-ping"></div>
                      <MapPin className="w-12 h-12 text-green-600 drop-shadow-lg" fill="currentColor" />
                    </div>
                  </div>
                  
                  {/* Surrounding land markers */}
                  <div className="absolute top-1/4 left-1/3 transform -translate-x-1/2">
                    <div className="w-16 h-16 bg-green-400 rounded-lg opacity-60 shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">L1</span>
                    </div>
                  </div>
                  <div className="absolute top-1/3 right-1/4">
                    <div className="w-16 h-16 bg-yellow-400 rounded-lg opacity-60 shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">L2</span>
                    </div>
                  </div>
                  <div className="absolute bottom-1/3 left-1/4">
                    <div className="w-16 h-16 bg-emerald-500 rounded-lg opacity-60 shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">L3</span>
                    </div>
                  </div>
                  <div className="absolute bottom-1/4 right-1/3">
                    <div className="w-16 h-16 bg-red-400 rounded-lg opacity-60 shadow-lg flex items-center justify-center">
                      <span className="text-white font-bold text-sm">L4</span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Overlay text */}
              <div className="absolute top-8 left-1/2 transform -translate-x-1/2 bg-white/90 backdrop-blur px-6 py-3 rounded-full shadow-lg">
                <p className="text-gray-700 font-medium flex items-center gap-2">
                  <Navigation className="w-5 h-5 text-green-600" />
                  <span>Your Farm Location</span>
                </p>
              </div>
            </div>
          </div>

          {/* Location Selection Bar */}
          <div className="glassmorphism rounded-2xl p-6 shadow-lg">
            <div className="flex flex-col md:flex-row items-center justify-between gap-4">
              <div>
                <h2 className="text-xl font-bold text-gray-800 mb-2">Select Your Location</h2>
                <p className="text-gray-600">
                  📍 Current Location: <span className="font-semibold">Delhi NCR</span>
                </p>
                <p className="text-sm text-gray-500 mt-1">
                  4 land plots detected nearby
                </p>
              </div>
              
              <Button
                onClick={handleLocationSelect}
                variant="primary"
                className="px-8 py-3 text-lg shadow-lg hover:shadow-xl transition-shadow"
              >
                View My Lands →
              </Button>
            </div>
          </div>

          {/* Info Cards */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🛰️</div>
              <h3 className="font-bold text-gray-800 mb-2">Satellite Monitoring</h3>
              <p className="text-sm text-gray-600">Real-time NDVI analysis</p>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🌦️</div>
              <h3 className="font-bold text-gray-800 mb-2">Weather Forecast</h3>
              <p className="text-sm text-gray-600">7-day predictions</p>
            </div>
            <div className="glassmorphism rounded-xl p-6 text-center">
              <div className="text-3xl mb-2">🤖</div>
              <h3 className="font-bold text-gray-800 mb-2">AI Assistant</h3>
              <p className="text-sm text-gray-600">Farming advice 24/7</p>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
