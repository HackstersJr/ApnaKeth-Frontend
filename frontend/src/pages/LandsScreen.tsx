import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import Button from '../components/Button';
import { useAppStore } from '../store/useAppStore';
import landsData from '../data/lands.json';
import { ArrowRight } from 'lucide-react';

export function LandsScreen() {
  const navigate = useNavigate();
  const { selectedLand, setSelectedLand } = useAppStore();
  const [hoveredLand, setHoveredLand] = useState<string | null>(null);

  const handleLandClick = (landId: string) => {
    setSelectedLand(landId);
  };

  const handleViewDetails = () => {
    if (selectedLand) {
      navigate(`/land-details/${selectedLand}`);
    }
  };

  const getStressColor = (stressLevel: string) => {
    switch (stressLevel) {
      case 'none': return 'border-green-500 bg-green-50';
      case 'low': return 'border-green-400 bg-green-50';
      case 'moderate': return 'border-yellow-500 bg-yellow-50';
      case 'high': return 'border-red-500 bg-red-50';
      default: return 'border-gray-300 bg-white';
    }
  };

  const getStressIcon = (stressLevel: string) => {
    switch (stressLevel) {
      case 'none': return '✅';
      case 'low': return '💚';
      case 'moderate': return '⚠️';
      case 'high': return '🚨';
      default: return '❓';
    }
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="mb-8">
            <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">My Lands</h1>
            <p className="text-gray-600">Select a land to view detailed analytics</p>
          </div>

          {/* Land Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
            {landsData.lands.map((land) => (
              <div
                key={land.id}
                onClick={() => handleLandClick(land.id)}
                onMouseEnter={() => setHoveredLand(land.id)}
                onMouseLeave={() => setHoveredLand(null)}
                className={`
                  relative p-6 rounded-2xl cursor-pointer transition-all duration-300
                  ${selectedLand === land.id 
                    ? `${getStressColor(land.stressLevel)} border-4 shadow-2xl scale-105` 
                    : `glassmorphism border-2 border-gray-200 hover:shadow-xl ${hoveredLand === land.id ? 'scale-102' : ''}`
                  }
                `}
              >
                {/* Selected Badge */}
                {selectedLand === land.id && (
                  <div className="absolute -top-3 -right-3 bg-green-600 text-white px-4 py-1 rounded-full text-sm font-bold shadow-lg">
                    Selected ✓
                  </div>
                )}

                {/* Land Name & Status */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <h3 className="text-2xl font-bold text-gray-800 mb-1">{land.name}</h3>
                    <p className="text-gray-600">{land.area}</p>
                  </div>
                  <div className="text-4xl">
                    {getStressIcon(land.stressLevel)}
                  </div>
                </div>

                {/* Crop Info */}
                <div className="bg-white/70 rounded-lg p-4 mb-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm text-gray-500 mb-1">Crop</p>
                      <p className="font-semibold text-gray-800">{land.crop}</p>
                    </div>
                    <div>
                      <p className="text-sm text-gray-500 mb-1">NDVI</p>
                      <p className="font-semibold text-gray-800">{land.ndvi.current.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Health Status */}
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-500 mb-1">Health Status</p>
                    <p className="font-bold capitalize">
                      {land.ndvi.status.replace('_', ' ')}
                    </p>
                  </div>
                  <div className={`px-3 py-1 rounded-full text-sm font-semibold ${
                    land.stressLevel === 'none' || land.stressLevel === 'low' 
                      ? 'bg-green-100 text-green-800' 
                      : land.stressLevel === 'moderate'
                      ? 'bg-yellow-100 text-yellow-800'
                      : 'bg-red-100 text-red-800'
                  }`}>
                    {land.stressLevel.toUpperCase()}
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-200">
                  <p className="text-sm text-gray-600">
                    Trend: <span className={`font-semibold ${
                      land.ndvi.trend === 'improving' ? 'text-green-600' :
                      land.ndvi.trend === 'declining' ? 'text-red-600' :
                      'text-gray-600'
                    }`}>
                      {land.ndvi.trend === 'improving' ? '📈 Improving' :
                       land.ndvi.trend === 'declining' ? '📉 Declining' :
                       '➡️ Stable'}
                    </span>
                  </p>
                </div>
              </div>
            ))}
          </div>

          {/* Selected Land Info & Action */}
          {selectedLand && (
            <div className="glassmorphism rounded-2xl p-6 shadow-xl border-2 border-green-500 animate-fade-in">
              <div className="flex flex-col md:flex-row items-center justify-between gap-4">
                <div>
                  <p className="text-sm text-gray-600 mb-1">Selected Land</p>
                  <h3 className="text-2xl font-bold text-gray-800">
                    {landsData.lands.find(l => l.id === selectedLand)?.name}
                  </h3>
                  <p className="text-gray-600 mt-1">
                    Click to view detailed crop health, soil data, and weather insights
                  </p>
                </div>
                
                <Button
                  onClick={handleViewDetails}
                  variant="primary"
                  className="px-8 py-4 text-lg shadow-lg hover:shadow-xl transition-all group"
                >
                  View Details
                  <ArrowRight className="inline-block ml-2 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {!selectedLand && (
            <div className="text-center glassmorphism rounded-2xl p-8">
              <p className="text-gray-500 text-lg">👆 Click on any land card to select it</p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
