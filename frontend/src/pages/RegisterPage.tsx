import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Sprout, Mail, Lock, Phone, User, ArrowRight, Loader2, ArrowLeft } from 'lucide-react';
import Button from '../components/Button';

export function RegisterPage() {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    agreeToTerms: false,
  });
  const [errors, setErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error for this field when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = () => {
    const newErrors: Record<string, string> = {};

    if (!formData.name.trim()) {
      newErrors.name = 'Name is required';
    }
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email)) {
      newErrors.email = 'Invalid email format';
    }
    if (!formData.phone.trim()) {
      newErrors.phone = 'Phone number is required';
    } else if (!/^\d{10}$/.test(formData.phone.replace(/\D/g, ''))) {
      newErrors.phone = 'Phone must be 10 digits';
    }
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }
    if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'Passwords do not match';
    }
    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    return newErrors;
  };

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    
    const newErrors = validateForm();
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setIsLoading(true);

    // Simulate API call - Replace with actual backend call
    setTimeout(() => {
      console.log('Registration attempt:', {
        name: formData.name,
        email: formData.email,
        phone: formData.phone,
        password: formData.password,
      });
      
      // TODO: Replace with actual API call
      // const response = await fetch('/api/auth/register', {
      //   method: 'POST',
      //   headers: { 'Content-Type': 'application/json' },
      //   body: JSON.stringify({
      //     name: formData.name,
      //     email: formData.email,
      //     phone: formData.phone,
      //     password: formData.password
      //   })
      // });
      
      setIsLoading(false);
      // Navigate to login after successful registration
      navigate('/login');
    }, 1500);
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-3 sm:p-4 py-6 sm:py-4 bg-gradient-to-br from-green-50 via-emerald-50 to-brand-earth-50 relative overflow-hidden">
      {/* Decorative Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-green-200/30 rounded-full blur-3xl animate-pulse-slow"></div>
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-emerald-200/30 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '1s' }}></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-80 h-80 bg-brand-earth-200/20 rounded-full blur-3xl animate-pulse-slow" style={{ animationDelay: '2s' }}></div>
      </div>

      {/* Registration Container */}
      <div className="relative w-full max-w-md animate-scale-in">
        {/* Logo & Title */}
        <div className="text-center mb-4 sm:mb-8">
          <div className="inline-flex items-center justify-center mb-3 sm:mb-4">
            <div className="p-3 sm:p-4 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl sm:rounded-3xl shadow-glow-green">
              <Sprout className="w-10 h-10 sm:w-12 sm:h-12 text-white" />
            </div>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold bg-gradient-to-r from-green-700 to-green-900 bg-clip-text text-transparent mb-1 sm:mb-2">
            Join ApnaKeth
          </h1>
          <p className="text-sm sm:text-base text-gray-600">Create your farmer account today</p>
        </div>

        {/* Registration Card */}
        <div className="glassmorphism rounded-2xl sm:rounded-3xl p-5 sm:p-8 shadow-strong border-2 border-white/40">
          <form onSubmit={handleRegister} className="space-y-3 sm:space-y-4">
            {/* Full Name Input */}
            <div>
              <label htmlFor="name" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Full Name
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <User className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={formData.name}
                  onChange={handleInputChange}
                  placeholder="Enter your full name"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.name && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.name}</p>}
            </div>

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
                  placeholder="farmer@example.com"
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.email && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.email}</p>}
            </div>

            {/* Phone Number Input */}
            <div>
              <label htmlFor="phone" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Phone Number
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Phone className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  type="tel"
                  id="phone"
                  name="phone"
                  value={formData.phone}
                  onChange={handleInputChange}
                  placeholder="10-digit phone number"
                  maxLength={10}
                  className="w-full pl-10 sm:pl-12 pr-3 sm:pr-4 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
              </div>
              {errors.phone && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.phone}</p>}
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
                  placeholder="Create a password"
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
              {errors.password && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.password}</p>}
            </div>

            {/* Confirm Password Input */}
            <div>
              <label htmlFor="confirmPassword" className="block text-xs sm:text-sm font-semibold text-gray-700 mb-1.5 sm:mb-2">
                Confirm Password
              </label>
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 sm:pl-4 flex items-center pointer-events-none">
                  <Lock className="w-4 h-4 sm:w-5 sm:h-5 text-gray-400" />
                </div>
                <input
                  type={showConfirmPassword ? 'text' : 'password'}
                  id="confirmPassword"
                  name="confirmPassword"
                  value={formData.confirmPassword}
                  onChange={handleInputChange}
                  placeholder="Confirm your password"
                  className="w-full pl-10 sm:pl-12 pr-10 sm:pr-12 py-2.5 sm:py-3 text-sm sm:text-base bg-white/70 border-2 border-gray-200 rounded-lg sm:rounded-xl focus:border-green-500 focus:ring-2 focus:ring-green-200 outline-none transition-all duration-200 text-gray-800 placeholder-gray-400"
                />
                <button
                  type="button"
                  onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                  className="absolute inset-y-0 right-0 pr-3 sm:pr-4 flex items-center text-gray-400 hover:text-gray-600 transition-colors min-w-[44px] min-h-[44px]"
                >
                  {showConfirmPassword ? (
                    <EyeOff className="w-4 h-4 sm:w-5 sm:h-5" />
                  ) : (
                    <Eye className="w-4 h-4 sm:w-5 sm:h-5" />
                  )}
                </button>
              </div>
              {errors.confirmPassword && <p className="text-red-500 text-xs sm:text-sm mt-1">{errors.confirmPassword}</p>}
            </div>

            {/* Agree to Terms */}
            <label className="flex items-start gap-2 sm:gap-3 cursor-pointer group mt-4 sm:mt-6">
              <input
                type="checkbox"
                name="agreeToTerms"
                checked={formData.agreeToTerms}
                onChange={handleInputChange}
                className="w-4 h-4 sm:w-5 sm:h-5 mt-0.5 rounded border-gray-300 text-green-600 focus:ring-green-500 cursor-pointer flex-shrink-0"
              />
              <span className="text-xs sm:text-sm text-gray-600 group-hover:text-gray-800 transition-colors">
                I agree to the{' '}
                <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                  Terms of Service
                </button>
                {' '}and{' '}
                <button type="button" className="text-green-600 hover:text-green-700 font-medium">
                  Privacy Policy
                </button>
              </span>
            </label>
            {errors.agreeToTerms && <p className="text-red-500 text-xs sm:text-sm">{errors.agreeToTerms}</p>}

            {/* Register Button */}
            <Button
              type="submit"
              variant="primary"
              disabled={isLoading}
              className="w-full py-3 sm:py-3.5 text-base sm:text-lg font-bold shadow-medium hover:shadow-strong group mt-4 sm:mt-6 min-h-[48px]"
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 sm:w-5 sm:h-5 mr-2 animate-spin" />
                  Creating Account...
                </>
              ) : (
                <>
                  Create Account
                  <ArrowRight className="w-4 h-4 sm:w-5 sm:h-5 ml-2 group-hover:translate-x-1 transition-transform" />
                </>
              )}
            </Button>

            {/* Divider */}
            <div className="relative my-4 sm:my-6">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-gray-300"></div>
              </div>
              <div className="relative flex justify-center text-xs sm:text-sm">
                <span className="px-3 sm:px-4 bg-white/70 text-gray-500 rounded-full">
                  Already have an account?
                </span>
              </div>
            </div>

            {/* Sign In Link */}
            <button
              type="button"
              onClick={() => navigate('/login')}
              className="w-full py-3 text-center font-semibold text-sm sm:text-base text-gray-700 hover:text-green-600 transition-colors flex items-center justify-center gap-2 min-h-[44px]"
            >
              <ArrowLeft className="w-4 h-4" />
              Back to Sign In
            </button>
          </form>
        </div>

        {/* Footer */}
        <div className="text-center mt-4 sm:mt-6 text-xs text-gray-500">
          <p>ApnaKeth - Smart Agriculture at Your Fingertips 🌾</p>
        </div>
      </div>
    </div>
  );
}
