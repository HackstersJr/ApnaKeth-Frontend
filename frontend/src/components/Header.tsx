import { Sprout, User } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export function Header() {
  const navigate = useNavigate();

  return (
    <header className="glassmorphism shadow-lg sticky top-0 z-40">
      <div className="max-w-7xl mx-auto px-4 py-4 flex items-center justify-between">
        <div 
          className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-opacity"
          onClick={() => navigate('/')}
        >
          <Sprout className="w-8 h-8 text-green-600" />
          <h1 className="text-2xl font-bold text-green-800">ApnaKeth</h1>
        </div>
        
        <div className="flex items-center gap-4">
          <button className="p-2 rounded-full hover:bg-green-100 transition-colors">
            <User className="w-6 h-6 text-gray-700" />
          </button>
        </div>
      </div>
    </header>
  );
}
