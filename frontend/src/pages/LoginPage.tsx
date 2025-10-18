import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sprout, Mail, Lock, ArrowRight, Loader2 } from 'lucide-react';
import Button from '../components/Button';

export function LoginPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    rememberMe: false,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate API call - Replace with actual backend call
    setTimeout(() => {
      console.log('Login attempt:', formData);
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/login', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({ email: formData.email, password: formData.password })
      // });
      
      setIsLoading(false);
      // Navigate to onboarding after successful login
      navigate('/onboarding');
    }, 1500);
  };

  const handleDemoLogin = () => {
    setFormData({
      email: 'demo@farmer.in',
      password: 'demo123',
      rememberMe: false,
    });
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 bg-gradient-to-br from-green-50 via-emerald-50 to-brand-earth-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-earth-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Login Container */}
      <div className="relative w-full max-w-md animate-scale-in">
        {/* Logo & Title */}
        <div className="text-center mb-6 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl sm:rounded-3xl shadow-glow-green">
              <Sprout className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent mb-1 sm:mb-2">
            Welcome Back
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Sign in to manage your farmland</p>
        </div>

        {/* Login Card */}
        <div className="glassmorphism rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-strong border-2 border-white/40">
          <form onSubmit={handleLogin} className="space-y-4 sm:space-y-5">
            {/* Email Input */}
            <div>
              <label htmlFor="email" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Email Address
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Mail className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  required
                  placeholder="farmer@example.com"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>
            </div>

            {/* Password Input */}
            <div>
              <label htmlFor="password" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  type={showPassword ? 'text' : 'password'}
                  id="password"
                  name="password"
                  value={formData.password}
                  onChange={handleInputChange}
                  required
                  placeholder="Enter your password"
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors min-w-[44px] min-h-[44px]"
                >
                  {showPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <label className="flex items-center gap-2 cursor-pointer group">
                <input
                  type="checkbox"
                  name="rememberMe"
                  checked={formData.rememberMe}
                  onChange={handleInputChange}
                  className="w-4 h-4 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer"
                />
                <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                  Remember me
                </span>
              </label>
              <button
                type="button"
                className="text-xs sm:text-sm font-semibold text-green-600 hover:text-green-700 transition-colors min-h-[44px] flex items-center"
                onClick={() => {
                  // TODO: Implement forgot password
                  console.log('Forgot password clicked');
                }}
              >
                Forgot Password?
              </button>
            </div>

            {/* Login Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 text-base sm:text-lg font-bold shadow-medium hover:shadow-strong group min-h-[48px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  Sign In
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            {/* Demo Login Button */}
            <Button
              type="button"
              variant="outline"
              onClick={handleDemoLogin}
              className="w-full py-2.5 sm:py-3 border-2 text-sm sm:text-base min-h-[48px]"
            >
              🎭 Use Demo Credentials
            </Button>

            {/* Divider */}
            <div className="relative my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-4 bg-white/70 text-gray-500 rounded-full">
                  Don't have an account?
                </span>
              </div>
            </div>

            {/* Sign Up Link */}
            <button
              type="button"
              onClick={() => navigate('/register')}
              className="w-full py-3 text-center font-semibold text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors min-h-[44px]"
            >
              Create New Account →
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6 text-xs sm:text-sm text-gray-500">
          <p>By signing in, you agree to our</p>
          <div className="flex items-center justify-center gap-2 mt-1">
            <button className="text-green-600 hover:text-green-700 font-medium">
              Terms of Service
            </button>
            <span>•</span>
            <button className="text-green-600 hover:text-green-700 font-medium">
              Privacy Policy
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
