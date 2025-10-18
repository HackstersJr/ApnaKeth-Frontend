import { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { MapScreen } from './pages/MapScreen';
import { LandsScreen } from './pages/LandsScreen';
import { LandDetailsScreen } from './pages/LandDetailsScreen';
import { AIChat } from './components/AIChat';
import { MessageSquare } from 'lucide-react';

function App() {
  const [showAIChat, setShowAIChat] = useState(false);

  return (
    <Router>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<MapScreen />} />
          <Route path="/lands" element={<LandsScreen />} />
          <Route path="/land-details/:landId" element={<LandDetailsScreen />} />
        </Routes>

        {/* Floating AI Chat Button */}
        <button
          onClick={() => setShowAIChat(!showAIChat)}
          className="fixed bottom-6 right-6 z-50 p-4 bg-gradient-to-r from-green-500 to-emerald-600 text-white rounded-full shadow-2xl hover:scale-110 transition-transform duration-300 hover:shadow-green-500/50"
          aria-label="Toggle AI Assistant"
        >
          <MessageSquare className="w-6 h-6" />
        </button>

        {/* AI Chat Panel */}
        {showAIChat && (
          <div className="fixed bottom-24 right-6 z-50 w-96 max-w-[calc(100vw-3rem)] animate-slide-up">
            <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl border border-gray-200 overflow-hidden">
              <div className="bg-gradient-to-r from-green-500 to-emerald-600 p-4 flex items-center justify-between">
                <h3 className="text-white font-bold text-lg">🌾 ApnaKeth AI</h3>
                <button
                  onClick={() => setShowAIChat(false)}
                  className="text-white hover:bg-white/20 rounded-lg p-1 transition-colors"
                  aria-label="Close AI Chat"
                >
                  ✕
                </button>
              </div>
              <div className="h-[500px]">
                <AIChat />
              </div>
            </div>
          </div>
        )}
      </div>
    </Router>
  );
}

export default App;
