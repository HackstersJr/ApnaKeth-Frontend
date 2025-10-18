import { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Header } from '../components/Header';
import { Sprout, Droplet, Cloud, AlertTriangle, ArrowLeft, ChevronDown, ChevronUp } from 'lucide-react';
import Button from '../components/Button';
import landsData from '../data/lands.json';
import soilData from '../data/soil.json';
import weatherData from '../data/weather.json';
import recommendationsData from '../data/recommendations.json';

type SectionType = 'crop' | 'soil' | 'weather' | null;

export function LandDetailsScreen() {
  const { landId } = useParams<{ landId: string }>();
  const navigate = useNavigate();
  const [expandedSection, setExpandedSection] = useState<SectionType>(null);

  const land = landsData.lands.find(l => l.id === landId);
  const soil = soilData[landId as keyof typeof soilData];
  const recommendations = recommendationsData[landId as keyof typeof recommendationsData];

  if (!land || !soil || !recommendations) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-xl text-gray-600">Land not found</p>
      </div>
    );
  }

  const toggleSection = (section: SectionType) => {
    setExpandedSection(expandedSection === section ? null : section);
  };

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-6xl mx-auto">
          {/* Back Button */}
          <Button
            onClick={() => navigate('/lands')}
            variant="ghost"
            className="mb-6 group"
          >
            <ArrowLeft className="w-5 h-5 mr-2 group-hover:-translate-x-1 transition-transform" />
            Back to My Lands
          </Button>

          {/* Land Summary Header */}
          <div className="glassmorphism rounded-2xl p-6 md:p-8 mb-6 shadow-xl">
            <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
              <div>
                <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">{land.name}</h1>
                <div className="flex flex-wrap items-center gap-4 text-gray-600">
                  <span>📏 {land.area}</span>
                  <span>•</span>
                  <span>🌾 {land.crop}</span>
                  <span>•</span>
                  <span>📅 Planted: {new Date(land.plantedDate).toLocaleDateString()}</span>
                </div>
              </div>
              <div className={`px-6 py-3 rounded-xl text-lg font-bold ${
                land.stressLevel === 'none' || land.stressLevel === 'low' 
                  ? 'bg-green-100 text-green-800' 
                  : land.stressLevel === 'moderate'
                  ? 'bg-yellow-100 text-yellow-800'
                  : 'bg-red-100 text-red-800'
              }`}>
                {land.stressLevel === 'none' ? '✅ Excellent' :
                 land.stressLevel === 'low' ? '💚 Healthy' :
                 land.stressLevel === 'moderate' ? '⚠️ Needs Attention' :
                 '🚨 Critical'}
              </div>
            </div>
          </div>

          {/* Three Main Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">
            {/* 1. Crop Details Card */}
            <div 
              className={`glassmorphism rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                expandedSection === 'crop' ? 'lg:col-span-3 shadow-2xl' : 'hover:shadow-xl'
              }`}
              onClick={() => toggleSection('crop')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Sprout className="w-6 h-6 text-green-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Crop Details</h2>
                </div>
                {expandedSection === 'crop' ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </div>

              {/* Preview (Always Visible) */}
              <div className="space-y-3">
                <div className="bg-white/70 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">NDVI Index</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-800">{land.ndvi.current.toFixed(2)}</p>
                    <span className={`text-sm font-semibold ${
                      land.ndvi.current > 0.7 ? 'text-green-600' :
                      land.ndvi.current > 0.5 ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {land.ndvi.status.replace('_', ' ').toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        land.ndvi.current > 0.7 ? 'bg-green-500' :
                        land.ndvi.current > 0.5 ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${land.ndvi.current * 100}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedSection === 'crop' && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/70 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Crop Type</p>
                      <p className="text-lg font-bold text-gray-800">{land.crop}</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Growth Trend</p>
                      <p className={`text-lg font-bold ${
                        land.ndvi.trend === 'improving' ? 'text-green-600' :
                        land.ndvi.trend === 'declining' ? 'text-red-600' :
                        'text-gray-600'
                      }`}>
                        {land.ndvi.trend.toUpperCase()}
                      </p>
                    </div>
                  </div>

                  {recommendations.interventions.length > 0 && (
                    <div className="bg-red-50 border-2 border-red-200 rounded-lg p-4">
                      <h3 className="font-bold text-red-800 mb-3 flex items-center gap-2">
                        <AlertTriangle className="w-5 h-5" />
                        Urgent Actions Required
                      </h3>
                      <div className="space-y-3">
                        {recommendations.interventions.slice(0, 3).map((intervention, idx) => (
                          <div key={idx} className="bg-white rounded-lg p-3">
                            <div className="flex items-start justify-between mb-2">
                              <p className="font-semibold text-gray-800">{intervention.action}</p>
                              <span className={`text-xs px-2 py-1 rounded-full ${
                                intervention.priority === 'critical' ? 'bg-red-200 text-red-800' :
                                intervention.priority === 'high' ? 'bg-orange-200 text-orange-800' :
                                'bg-yellow-200 text-yellow-800'
                              }`}>
                                {intervention.priority.toUpperCase()}
                              </span>
                            </div>
                            <p className="text-sm text-gray-600 mb-1">⏰ {intervention.schedule}</p>
                            <p className="text-sm text-gray-600 mb-1">💰 {intervention.cost}</p>
                            <p className="text-xs text-green-700">✅ {intervention.expectedImpact}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  )}

                  {recommendations.maintenance.length > 0 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <h3 className="font-bold text-blue-800 mb-3">Maintenance Tips</h3>
                      <ul className="space-y-2">
                        {recommendations.maintenance.map((tip, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-blue-600">•</span>
                            <span>{tip}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}

                  <div className="bg-gradient-to-r from-purple-50 to-pink-50 border-2 border-purple-200 rounded-lg p-4">
                    <h3 className="font-bold text-purple-800 mb-2">Yield Forecast</h3>
                    <p className="text-sm text-gray-700">{recommendations.forecast}</p>
                  </div>
                </div>
              )}
            </div>

            {/* 2. Land Features (Soil) Card */}
            <div 
              className={`glassmorphism rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                expandedSection === 'soil' ? 'lg:col-span-3 shadow-2xl' : 'hover:shadow-xl'
              }`}
              onClick={() => toggleSection('soil')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-amber-100 rounded-xl">
                    <Droplet className="w-6 h-6 text-amber-700" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Land Features</h2>
                </div>
                {expandedSection === 'soil' ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </div>

              {/* Preview */}
              <div className="space-y-3">
                <div className="bg-white/70 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Soil Moisture</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-800">{soil.moisture.level}%</p>
                    <span className={`text-sm font-semibold ${
                      soil.moisture.status === 'optimal' ? 'text-green-600' :
                      soil.moisture.status === 'low' ? 'text-yellow-600' :
                      'text-red-600'
                    }`}>
                      {soil.moisture.status.toUpperCase()}
                    </span>
                  </div>
                  <div className="mt-2 w-full bg-gray-200 rounded-full h-2">
                    <div 
                      className={`h-2 rounded-full ${
                        soil.moisture.status === 'optimal' ? 'bg-blue-500' :
                        soil.moisture.status === 'low' ? 'bg-yellow-500' :
                        'bg-red-500'
                      }`}
                      style={{ width: `${soil.moisture.level}%` }}
                    ></div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedSection === 'soil' && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">pH Level</p>
                      <p className="text-xl font-bold text-gray-800">{soil.ph.value}</p>
                      <p className="text-xs text-gray-500">{soil.ph.status}</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">Nitrogen</p>
                      <p className="text-xl font-bold text-gray-800">{soil.nutrients.nitrogen.value}%</p>
                      <p className="text-xs text-gray-500">{soil.nutrients.nitrogen.level}</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">Phosphorus</p>
                      <p className="text-xl font-bold text-gray-800">{soil.nutrients.phosphorus.value}%</p>
                      <p className="text-xs text-gray-500">{soil.nutrients.phosphorus.level}</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">Potassium</p>
                      <p className="text-xl font-bold text-gray-800">{soil.nutrients.potassium.value}%</p>
                      <p className="text-xs text-gray-500">{soil.nutrients.potassium.level}</p>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="bg-white/70 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Soil Texture</p>
                      <p className="text-lg font-bold text-gray-800">{soil.texture}</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-4">
                      <p className="text-sm text-gray-600 mb-2">Organic Matter</p>
                      <p className="text-lg font-bold text-gray-800">{soil.organicMatter.percentage}%</p>
                      <p className="text-xs text-gray-500">{soil.organicMatter.status}</p>
                    </div>
                  </div>

                  <div className="bg-green-50 border-2 border-green-200 rounded-lg p-4">
                    <h3 className="font-bold text-green-800 mb-3">Nutrient Recommendations</h3>
                    <div className="space-y-2">
                      <div className="bg-white rounded-lg p-3">
                        <p className="font-semibold text-gray-800 mb-1">Nitrogen</p>
                        <p className="text-sm text-gray-600">{soil.nutrients.nitrogen.recommendation}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="font-semibold text-gray-800 mb-1">Phosphorus</p>
                        <p className="text-sm text-gray-600">{soil.nutrients.phosphorus.recommendation}</p>
                      </div>
                      <div className="bg-white rounded-lg p-3">
                        <p className="font-semibold text-gray-800 mb-1">Potassium</p>
                        <p className="text-sm text-gray-600">{soil.nutrients.potassium.recommendation}</p>
                      </div>
                    </div>
                  </div>

                  {soil.recommendations.length > 0 && (
                    <div className="bg-blue-50 border-2 border-blue-200 rounded-lg p-4">
                      <h3 className="font-bold text-blue-800 mb-3">Soil Management Tips</h3>
                      <ul className="space-y-2">
                        {soil.recommendations.map((rec, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-sm text-gray-700">
                            <span className="text-blue-600">✓</span>
                            <span>{rec}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  )}
                </div>
              )}
            </div>

            {/* 3. Climate (Weather) Card */}
            <div 
              className={`glassmorphism rounded-2xl p-6 cursor-pointer transition-all duration-300 ${
                expandedSection === 'weather' ? 'lg:col-span-3 shadow-2xl' : 'hover:shadow-xl'
              }`}
              onClick={() => toggleSection('weather')}
            >
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <Cloud className="w-6 h-6 text-blue-600" />
                  </div>
                  <h2 className="text-xl font-bold text-gray-800">Climate</h2>
                </div>
                {expandedSection === 'weather' ? <ChevronUp className="w-6 h-6" /> : <ChevronDown className="w-6 h-6" />}
              </div>

              {/* Preview */}
              <div className="space-y-3">
                <div className="bg-white/70 rounded-lg p-3">
                  <p className="text-sm text-gray-600 mb-1">Current Temperature</p>
                  <div className="flex items-center justify-between">
                    <p className="text-2xl font-bold text-gray-800">{weatherData.current.temperature}°C</p>
                    <span className="text-sm text-gray-600">{weatherData.current.condition.replace('_', ' ')}</span>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2 text-xs">
                    <div>💧 Humidity: {weatherData.current.humidity}%</div>
                    <div>💨 Wind: {weatherData.current.windSpeed} km/h</div>
                  </div>
                </div>
              </div>

              {/* Expanded Content */}
              {expandedSection === 'weather' && (
                <div className="mt-6 space-y-4 animate-fade-in">
                  {weatherData.alerts.length > 0 && (
                    <div className="bg-orange-50 border-2 border-orange-300 rounded-lg p-4">
                      {weatherData.alerts.map((alert, idx) => (
                        <div key={idx} className="flex items-start gap-3">
                          <span className="text-2xl">{alert.icon}</span>
                          <div>
                            <p className="font-bold text-orange-800 mb-1">{alert.type.toUpperCase()} Alert</p>
                            <p className="text-sm text-gray-700">{alert.message}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}

                  <div className="bg-white/70 rounded-lg p-4">
                    <h3 className="font-bold text-gray-800 mb-4">7-Day Forecast</h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-7 gap-3">
                      {weatherData.forecast.map((day, idx) => (
                        <div key={idx} className="bg-gradient-to-br from-blue-50 to-cyan-50 rounded-lg p-3 text-center border border-blue-200">
                          <p className="text-xs font-semibold text-gray-600 mb-2">{day.day}</p>
                          <p className="text-3xl mb-2">{day.icon}</p>
                          <p className="text-sm font-bold text-gray-800">{day.temp.max}°</p>
                          <p className="text-xs text-gray-500">{day.temp.min}°</p>
                          {day.rainfall > 0 && (
                            <p className="text-xs text-blue-600 mt-1">🌧️ {day.rainfall}mm</p>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">Temperature</p>
                      <p className="text-xl font-bold text-gray-800">{weatherData.current.temperature}°C</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">Humidity</p>
                      <p className="text-xl font-bold text-gray-800">{weatherData.current.humidity}%</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">Wind Speed</p>
                      <p className="text-xl font-bold text-gray-800">{weatherData.current.windSpeed} km/h</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3 text-center">
                      <p className="text-sm text-gray-600 mb-1">UV Index</p>
                      <p className="text-xl font-bold text-gray-800">{weatherData.current.uv_index}</p>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
