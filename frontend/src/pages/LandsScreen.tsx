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
    <div className="min-h-screen flex flex-col bg-gradient-to-br from-green-50 via-emerald-50 to-brand-earth-50">
      <Header />
      
      <main className="flex-1 p-4 sm:p-6 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Page Header */}
          <div className="mb-6 sm:mb-8 animate-fade-in">
            <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent mb-2">
              🌾 My Farmlands
            </h1>
            <p className="text-sm sm:text-base text-gray-600">
              Select a land to view detailed analytics and insights
            </p>
          </div>

          {/* Land Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6 mb-6 sm:mb-8">
            {landsData.lands.map((land, index) => (
              <div
                key={land.id}
                onClick={() => handleLandClick(land.id)}
                onMouseEnter={() => setHoveredLand(land.id)}
                onMouseLeave={() => setHoveredLand(null)}
                style={{ animationDelay: `${index * 100}ms` }}
                className={`
                  relative p-5 sm:p-6 rounded-2xl cursor-pointer transition-all duration-300 animate-scale-in
                  touch-target
                  ${selectedLand === land.id 
                    ? `${getStressColor(land.stressLevel)} border-4 shadow-strong scale-[1.02] ring-2 ring-green-400` 
                    : `glassmorphism border-2 border-gray-200/50 hover:shadow-medium active:scale-[0.98] ${hoveredLand === land.id ? 'scale-[1.01]' : ''}`
                  }
                `}
              >
                {/* Selected Badge */}
                {selectedLand === land.id && (
                  <div className="absolute -top-3 -right-3 bg-gradient-to-r from-green-500 to-green-600 text-white px-3 sm:px-4 py-1 rounded-full text-xs sm:text-sm font-bold shadow-lg animate-bounce-subtle">
                    ✓ Selected
                  </div>
                )}

                {/* Land Name & Status */}
                <div className="flex items-start justify-between mb-4 gap-3">
                  <div className="flex-1 min-w-0">
                    <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-1 truncate">{land.name}</h3>
                    <p className="text-sm sm:text-base text-gray-600">📏 {land.area}</p>
                  </div>
                  <div className="text-3xl sm:text-4xl flex-shrink-0">
                    {getStressIcon(land.stressLevel)}
                  </div>
                </div>

                {/* Crop Info */}
                <div className="bg-white/70 rounded-xl p-3 sm:p-4 mb-4 shadow-soft">
                  <div className="grid grid-cols-2 gap-3 sm:gap-4">
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">Crop Type</p>
                      <p className="font-semibold text-sm sm:text-base text-gray-800 flex items-center gap-1">
                        🌱 {land.crop}
                      </p>
                    </div>
                    <div>
                      <p className="text-xs sm:text-sm text-gray-500 mb-1">NDVI Index</p>
                      <p className="font-bold text-base sm:text-lg text-gray-800">{land.ndvi.current.toFixed(2)}</p>
                    </div>
                  </div>
                </div>

                {/* Health Status */}
                <div className="flex items-center justify-between gap-3 flex-wrap">
                  <div className="flex-1 min-w-0">
                    <p className="text-xs sm:text-sm text-gray-500 mb-1">Health Status</p>
                    <p className="font-bold text-sm sm:text-base capitalize text-gray-800">
                      {land.ndvi.status.replace('_', ' ')}
                    </p>
                  </div>
                  <div className={`px-3 py-1.5 sm:px-4 sm:py-2 rounded-full text-xs sm:text-sm font-bold flex-shrink-0 ${
                    land.stressLevel === 'none' || land.stressLevel === 'low' 
                      ? 'bg-gradient-to-r from-green-100 to-green-200 text-green-800 border border-green-300' 
                      : land.stressLevel === 'moderate'
                      ? 'bg-gradient-to-r from-yellow-100 to-yellow-200 text-yellow-800 border border-yellow-300'
                      : 'bg-gradient-to-r from-red-100 to-red-200 text-red-800 border border-red-300'
                  }`}>
                    {land.stressLevel.toUpperCase()}
                  </div>
                </div>

                {/* Trend Indicator */}
                <div className="mt-4 pt-4 border-t border-gray-200/50">
                  <p className="text-xs sm:text-sm text-gray-600">
                    Trend: <span className={`font-bold ${
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
            <div className="glassmorphism-green rounded-2xl p-5 sm:p-6 shadow-strong border-2 border-green-400 animate-fade-in">
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="flex-1">
                  <p className="text-xs sm:text-sm text-green-700 font-medium mb-1 uppercase tracking-wide">Selected Land</p>
                  <h3 className="text-xl sm:text-2xl font-bold text-gray-800 mb-2">
                    {landsData.lands.find(l => l.id === selectedLand)?.name}
                  </h3>
                  <p className="text-sm sm:text-base text-gray-600">
                    View detailed crop health, soil data, weather insights, and AI recommendations
                  </p>
                </div>
                
                <Button
                  onClick={handleViewDetails}
                  variant="primary"
                  className="w-full sm:w-auto px-6 sm:px-8 py-3 sm:py-4 text-base sm:text-lg shadow-medium hover:shadow-strong group whitespace-nowrap"
                >
                  View Details
                  <ArrowRight className="inline-block ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              </div>
            </div>
          )}

          {!selectedLand && (
            <div className="text-center glassmorphism rounded-2xl p-6 sm:p-8 animate-fade-in">
              <div className="text-4xl sm:text-5xl mb-3">👆</div>
              <p className="text-base sm:text-lg text-gray-600 font-medium">
                Tap any land card to select it
              </p>
              <p className="text-xs sm:text-sm text-gray-500 mt-2">
                Get instant access to health analytics and recommendations
              </p>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
