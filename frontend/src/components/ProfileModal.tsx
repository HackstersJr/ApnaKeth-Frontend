import { X, User, Phone, Mail, MapPin, Calendar, Sprout, TrendingUp, Award } from 'lucide-react';
import Button from './Button';

interface ProfileModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function ProfileModal({ isOpen, onClose }: ProfileModalProps) {
  if (!isOpen) return null;

  // Placeholder farmer data
  const farmerData = {
    name: 'Rajesh Kumar',
    phone: '+91 98765 43210',
    email: 'rajesh.kumar@farmer.in',
    location: 'Village Rampur, District Meerut, UP',
    memberSince: 'January 2024',
    farmingExperience: '15 years',
    totalLand: '12.5 acres',
    primaryCrop: 'Wheat & Rice',
    awards: ['Best Organic Farmer 2023', 'Krishi Ratna Award'],
    educationLevel: 'Graduate in Agriculture',
    farmerID: 'APK-2024-001234',
  };

  return (
    <>
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-black/40 z-50 animate-fade-in"
        onClick={onClose}
        style={{ cursor: 'pointer' }}
      />
      
      {/* Modal */}
      <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div 
          className="bg-white rounded-3xl w-full max-w-2xl max-h-[85vh] overflow-hidden shadow-strong border-2 border-gray-200 animate-scale-in"
          onClick={(e) => e.stopPropagation()}
        >
          {/* Header */}
          <div className="sticky top-0 bg-white border-b border-gray-200 p-6 z-10">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="relative">
                  <div className="w-20 h-20 bg-gradient-to-br from-green-400 to-green-600 rounded-2xl flex items-center justify-center shadow-glow-green">
                    <User className="w-10 h-10 text-white" />
                  </div>
                  <div className="absolute -bottom-1 -right-1 w-6 h-6 bg-green-500 rounded-full border-2 border-white flex items-center justify-center">
                    <span className="text-xs">✓</span>
                  </div>
                </div>
                <div>
                  <h2 className="text-2xl sm:text-3xl font-bold bg-gradient-to-r from-green-800 to-green-600 bg-clip-text text-transparent">
                    Farmer Profile
                  </h2>
                  <p className="text-sm text-gray-600 mt-1">Complete account information</p>
                </div>
              </div>
              <button
                onClick={onClose}
                className="touch-target p-2.5 rounded-xl bg-white/60 hover:bg-red-50 hover:border-red-300 transition-all duration-200 group border border-white/80 shadow-soft"
              >
                <X className="w-6 h-6 text-gray-700 group-hover:text-red-600 group-hover:rotate-90 transition-all duration-300" />
              </button>
            </div>
          </div>

          {/* Scrollable Content */}
          <div className="overflow-y-auto max-h-[calc(85vh-120px)] p-6 space-y-5 bg-white">
            {/* Basic Information */}
            <div className="bg-white rounded-2xl p-6 shadow-medium border border-green-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <User className="w-5 h-5 text-green-600" />
                </div>
                Personal Information
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="bg-white rounded-xl p-4 shadow-soft">
                  <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Full Name</p>
                  <p className="font-bold text-gray-800 text-lg">{farmerData.name}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-soft">
                  <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Farmer ID</p>
                  <p className="font-bold text-green-700 font-mono text-sm tracking-wider">{farmerData.farmerID}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-soft">
                  <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Education</p>
                  <p className="font-semibold text-gray-800">{farmerData.educationLevel}</p>
                </div>
                <div className="bg-white rounded-xl p-4 shadow-soft">
                  <p className="text-xs font-medium text-gray-500 mb-1.5 uppercase tracking-wide">Experience</p>
                  <p className="font-semibold text-gray-800">{farmerData.farmingExperience}</p>
                </div>
              </div>
            </div>

            {/* Contact Information */}
            <div className="bg-white rounded-2xl p-6 shadow-medium border border-blue-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-2 bg-blue-100 rounded-lg">
                  <Phone className="w-5 h-5 text-blue-600" />
                </div>
                Contact Details
              </h3>
              <div className="space-y-3">
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-xl border border-blue-200/50 shadow-soft hover:shadow-medium transition-shadow">
                  <div className="p-2.5 bg-blue-500 rounded-xl shadow-md">
                    <Phone className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Phone Number</p>
                    <p className="font-bold text-gray-800 text-lg">{farmerData.phone}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-purple-50 to-pink-50 rounded-xl border border-purple-200/50 shadow-soft hover:shadow-medium transition-shadow">
                  <div className="p-2.5 bg-purple-500 rounded-xl shadow-md">
                    <Mail className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Email Address</p>
                    <p className="font-semibold text-gray-800">{farmerData.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-4 p-4 bg-gradient-to-r from-green-50 to-emerald-50 rounded-xl border border-green-200/50 shadow-soft hover:shadow-medium transition-shadow">
                  <div className="p-2.5 bg-green-500 rounded-xl shadow-md">
                    <MapPin className="w-5 h-5 text-white" />
                  </div>
                  <div className="flex-1">
                    <p className="text-xs font-medium text-gray-500 uppercase tracking-wide">Location</p>
                    <p className="font-semibold text-gray-800">{farmerData.location}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Farming Information */}
            <div className="bg-white rounded-2xl p-6 shadow-medium border border-amber-200">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-2 bg-green-100 rounded-lg">
                  <Sprout className="w-5 h-5 text-green-600" />
                </div>
                Farming Details
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-green-100 to-emerald-100 rounded-xl border-2 border-green-300 shadow-soft">
                  <div className="p-2.5 bg-green-500 rounded-xl shadow-md">
                    <TrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-green-700 uppercase tracking-wide">Total Land</p>
                    <p className="font-bold text-2xl text-green-800">{farmerData.totalLand}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-amber-100 to-yellow-100 rounded-xl border-2 border-amber-300 shadow-soft">
                  <div className="p-2.5 bg-amber-500 rounded-xl shadow-md">
                    <Sprout className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-amber-700 uppercase tracking-wide">Primary Crops</p>
                    <p className="font-bold text-lg text-amber-800">{farmerData.primaryCrop}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-4 bg-gradient-to-br from-blue-100 to-cyan-100 rounded-xl border-2 border-blue-300 shadow-soft sm:col-span-2">
                  <div className="p-2.5 bg-blue-500 rounded-xl shadow-md">
                    <Calendar className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-xs font-medium text-blue-700 uppercase tracking-wide">Member Since</p>
                    <p className="font-bold text-xl text-blue-800">{farmerData.memberSince}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Achievements */}
            <div className="bg-white rounded-2xl p-6 shadow-medium border-2 border-amber-300">
              <h3 className="text-lg font-bold text-gray-800 mb-4 flex items-center gap-2">
                <div className="p-2 bg-amber-100 rounded-lg">
                  <Award className="w-5 h-5 text-amber-600" />
                </div>
                Achievements & Awards
              </h3>
              <div className="space-y-3">
                {farmerData.awards.map((award, index) => (
                  <div 
                    key={index}
                    className="flex items-center gap-4 p-4 bg-white rounded-xl shadow-medium border border-amber-200 hover:scale-[1.02] transition-transform"
                  >
                    <div className="w-12 h-12 bg-gradient-to-br from-amber-400 to-orange-500 rounded-xl flex items-center justify-center shadow-glow-earth">
                      <Award className="w-6 h-6 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="font-bold text-gray-800">{award}</p>
                      <p className="text-xs text-amber-700 font-medium">🏆 Excellence in Agriculture</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Statistics */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
              <div className="text-center p-4 bg-gradient-to-br from-green-100 to-green-200 rounded-xl shadow-soft border-2 border-green-300">
                <p className="text-3xl font-bold text-green-800 mb-1">4</p>
                <p className="text-xs text-green-700 font-semibold uppercase tracking-wide">Land Plots</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-blue-100 to-blue-200 rounded-xl shadow-soft border-2 border-blue-300">
                <p className="text-3xl font-bold text-blue-800 mb-1">12</p>
                <p className="text-xs text-blue-700 font-semibold uppercase tracking-wide">Partitions</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-purple-100 to-purple-200 rounded-xl shadow-soft border-2 border-purple-300">
                <p className="text-3xl font-bold text-purple-800 mb-1">95%</p>
                <p className="text-xs text-purple-700 font-semibold uppercase tracking-wide">Health Score</p>
              </div>
              <div className="text-center p-4 bg-gradient-to-br from-amber-100 to-amber-200 rounded-xl shadow-soft border-2 border-amber-300">
                <p className="text-3xl font-bold text-amber-800 mb-1">3</p>
                <p className="text-xs text-amber-700 font-semibold uppercase tracking-wide">Crop Types</p>
              </div>
            </div>

            {/* Action Buttons */}
            <div className="flex flex-col sm:flex-row gap-3 pt-2">
              <Button 
                variant="outline"
                className="flex-1 border-2"
                onClick={onClose}
              >
                Edit Profile
              </Button>
              <Button 
                variant="primary"
                className="flex-1 shadow-medium hover:shadow-strong"
                onClick={onClose}
              >
                Close
              </Button>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
