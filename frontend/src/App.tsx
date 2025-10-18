import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import { OnboardingFlow } from './pages/OnboardingFlow';
import { LoginPage } from './pages/LoginPage';
import { RegisterPage } from './pages/RegisterPage';
// import { AIChat } from './components/AIChat';
import ArivStyleChat from './components/ArivStyleChat';

function AppContent() {
  const location = useLocation();
  const showChat = location.pathname !== '/login' && location.pathname !== '/' && location.pathname !== '/register';
  
  return (
    <>
      <Routes>
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/onboarding" element={<OnboardingFlow />} />
        <Route path="/" element={<LoginPage />} />
      </Routes>

      {/* AI Chat Component - Only show after login */}
      {showChat && <ArivStyleChat />}
    </>
  );
}

function App() {
  // Using Ariv Style from SIH ERP
  // To use original ApnaKeth style with voice + orb, uncomment AIChat import and use <AIChat /> instead

  return (
    <Router>
      <div className="relative min-h-screen">
        <AppContent />
      </div>
    </Router>
  );
}

export default App;
