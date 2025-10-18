import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { OnboardingFlow } from './pages/OnboardingFlow';
// import { AIChat } from './components/AIChat';
import ArivStyleChat from './components/ArivStyleChat';

function App() {
  // Using Ariv Style from SIH ERP
  // To use original ApnaKeth style with voice + orb, uncomment AIChat import and use <AIChat /> instead

  return (
    <Router>
      <div className="relative min-h-screen">
        <Routes>
          <Route path="/" element={<OnboardingFlow />} />
        </Routes>

        {/* AI Chat Component - Ariv Style (SIH ERP) */}
        <ArivStyleChat />
        
        {/* AI Chat Component - ApnaKeth Style (Voice + Orb) - Uncomment to use */}
        {/* <AIChat /> */}
      </div>
    </Router>
  );
}

export default App;
