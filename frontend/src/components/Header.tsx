import { Sprout, User, Menu, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useState } from 'react';
import { ProfileModal } from './ProfileModal';

export function Header() {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isProfileOpen, setIsProfileOpen] = useState(false);

  return (
    <header className="glassmorphism shadow-soft sticky top-0 z-40 border-b border-white/30">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3 sm:py-4">
        <div className="flex items-center justify-between">
          {/* Logo */}
          <div 
            className="flex items-center gap-2 sm:gap-3 cursor-pointer group touch-target"
            onClick={() => navigate('/')}
          >
            <div className="p-2 sm:p-2.5 bg-gradient-to-br from-green-400 to-green-600 rounded-xl sm:rounded-2xl shadow-md group-hover:shadow-glow-green transition-all duration-300 group-hover:scale-110">
              <Sprout className="w-5 h-5 sm:w-7 sm:h-7 text-white" />
            </div>
            <div>
              <h1 className="text-xl sm:text-2xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent">
                ApnaKeth
              </h1>
              <p className="text-2xs sm:text-xs text-brand-earth-600 font-medium hidden sm:block">
                Smart Agriculture Platform
              </p>
            </div>
          </div>
          
          {/* Desktop Actions */}
          <div className="hidden sm:flex items-center gap-3 sm:gap-4">
            <button 
              className="touch-target p-2.5 rounded-xl bg-gradient-to-br from-brand-earth-100 to-brand-earth-200 hover:from-brand-earth-200 hover:to-brand-earth-300 transition-all duration-200 hover:shadow-medium group border border-brand-earth-300/50"
              onClick={() => setIsProfileOpen(true)}
            >
              <User className="w-5 h-5 sm:w-6 sm:h-6 text-brand-earth-700 group-hover:scale-110 transition-transform" />
            </button>
          </div>

          {/* Mobile Menu Button */}
          <button 
            className="sm:hidden touch-target p-2 rounded-xl bg-white/50 hover:bg-white/70 transition-colors"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="w-6 h-6 text-gray-700" />
            ) : (
              <Menu className="w-6 h-6 text-gray-700" />
            )}
          </button>
        </div>

        {/* Mobile Menu */}
        {isMobileMenuOpen && (
          <div className="sm:hidden mt-4 pt-4 border-t border-white/30 animate-slide-up">
            <div className="flex flex-col gap-3">
              <button 
                className="w-full touch-target px-4 py-3 rounded-xl bg-gradient-to-br from-brand-earth-100 to-brand-earth-200 text-brand-earth-800 font-medium transition-all duration-200 text-left flex items-center gap-2"
                onClick={() => {
                  setIsProfileOpen(true);
                  setIsMobileMenuOpen(false);
                }}
              >
                <User className="w-5 h-5" />
                View Profile
              </button>
            </div>
          </div>
        )}
      </div>
      
      {/* Profile Modal */}
      <ProfileModal isOpen={isProfileOpen} onClose={() => setIsProfileOpen(false)} />
    </header>
  );
}
