import { useState, useEffect } from 'react';
import { X, Droplet, Calendar, Sprout, FileText, Leaf } from 'lucide-react';
import Button from './Button';

interface LandDetails {
  name: string;
  crop?: string;
  cropVariety?: string;
  plantedDate?: string;
  expectedHarvestDate?: string;
  irrigationType?: 'drip' | 'sprinkler' | 'flood' | 'rainfed' | 'other';
  fertilizers?: string;
  pesticides?: string;
  notes?: string;
}

interface LandDetailsModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSave: (details: LandDetails) => void;
  initialData?: LandDetails;
  landArea?: number;
  title?: string;
}

export function LandDetailsModal({
  isOpen,
  onClose,
  onSave,
  initialData,
  landArea,
  title = 'Land Details'
}: LandDetailsModalProps) {
  const [formData, setFormData] = useState<LandDetails>({
    name: '',
    crop: '',
    cropVariety: '',
    plantedDate: '',
    expectedHarvestDate: '',
    irrigationType: undefined,
    fertilizers: '',
    pesticides: '',
    notes: ''
  });

  useEffect(() => {
    if (initialData) {
      setFormData(initialData);
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(formData);
    onClose();
  };

  const handleChange = (field: keyof LandDetails, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
      <div className="bg-white rounded-2xl shadow-2xl max-w-3xl w-full max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-green-500 to-emerald-600 text-white p-6 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-white/20 rounded-lg">
              <Sprout className="w-6 h-6" />
            </div>
            <div>
              <h2 className="text-2xl font-bold">{title}</h2>
              {landArea && (
                <p className="text-green-100 text-sm">Area: {landArea.toFixed(2)} acres</p>
              )}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 hover:bg-white/20 rounded-lg transition-colors"
          >
            <X className="w-6 h-6" />
          </button>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="p-6 overflow-y-auto max-h-[calc(90vh-180px)]">
          {/* Satellite Info Banner */}
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Sprout className="w-5 h-5 text-blue-600" />
            </div>
            <div className="flex-1">
              <p className="text-sm font-semibold text-blue-900 mb-1">🛰️ Smart Detection Enabled</p>
              <p className="text-xs text-blue-700">
                Soil type, moisture levels, NDVI, and land features will be automatically detected through satellite imagery when you connect to the backend.
              </p>
            </div>
          </div>

          <div className="space-y-6">
            {/* Basic Information */}
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-green-600" />
                Basic Information
              </h3>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Land Name *
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => handleChange('name', e.target.value)}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  placeholder="e.g., North Field, Back Acre, River Plot"
                />
                <p className="text-xs text-gray-500 mt-1">
                  💡 Soil type and land features will be detected automatically via satellite
                </p>
              </div>
            </div>

            {/* Crop Information */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Leaf className="w-5 h-5 text-green-600" />
                Crop Information
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Type
                  </label>
                  <input
                    type="text"
                    value={formData.crop || ''}
                    onChange={(e) => handleChange('crop', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Wheat, Rice, Cotton"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Crop Variety
                  </label>
                  <input
                    type="text"
                    value={formData.cropVariety || ''}
                    onChange={(e) => handleChange('cropVariety', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Basmati, Hybrid"
                  />
                </div>
              </div>
            </div>

            {/* Dates */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Calendar className="w-5 h-5 text-green-600" />
                Timeline
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Planting Date
                  </label>
                  <input
                    type="date"
                    value={formData.plantedDate || ''}
                    onChange={(e) => handleChange('plantedDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Expected Harvest Date
                  </label>
                  <input
                    type="date"
                    value={formData.expectedHarvestDate || ''}
                    onChange={(e) => handleChange('expectedHarvestDate', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  />
                </div>
              </div>
            </div>

            {/* Irrigation */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <Droplet className="w-5 h-5 text-blue-600" />
                Irrigation & Care
              </h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Irrigation Type
                  </label>
                  <select
                    value={formData.irrigationType || ''}
                    onChange={(e) => handleChange('irrigationType', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                  >
                    <option value="">Select irrigation type</option>
                    <option value="drip">Drip Irrigation</option>
                    <option value="sprinkler">Sprinkler</option>
                    <option value="flood">Flood Irrigation</option>
                    <option value="rainfed">Rainfed</option>
                    <option value="other">Other</option>
                  </select>
                </div>

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Fertilizers Used
                  </label>
                  <input
                    type="text"
                    value={formData.fertilizers || ''}
                    onChange={(e) => handleChange('fertilizers', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., NPK, Urea, Organic"
                  />
                </div>

                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Pesticides/Herbicides Used
                  </label>
                  <input
                    type="text"
                    value={formData.pesticides || ''}
                    onChange={(e) => handleChange('pesticides', e.target.value)}
                    className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                    placeholder="e.g., Organic spray, Chemical names"
                  />
                </div>
              </div>
            </div>

            {/* Notes */}
            <div className="space-y-4 pt-4 border-t border-gray-200">
              <h3 className="text-lg font-semibold text-gray-800 flex items-center gap-2">
                <FileText className="w-5 h-5 text-gray-600" />
                Additional Notes
              </h3>
              
              <div>
                <textarea
                  value={formData.notes || ''}
                  onChange={(e) => handleChange('notes', e.target.value)}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent resize-none"
                  placeholder="Any additional information about this land..."
                />
              </div>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3 mt-8 pt-6 border-t border-gray-200">
            <Button
              type="button"
              onClick={onClose}
              variant="secondary"
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="primary"
              className="flex-1"
            >
              Save Details
            </Button>
          </div>
        </form>
      </div>
    </div>
  );
}
