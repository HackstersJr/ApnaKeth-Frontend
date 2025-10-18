import { useState } from 'react';
import { Header } from '../components/Header';
import { OnboardingMapComponent } from '../components/OnboardingMapComponent';
import { LandDetailsModal } from '../components/LandDetailsModal';
import { MapPin, Sprout, CheckCircle, Edit3, Grid3X3, Edit2 } from 'lucide-react';
import { useAppStore } from '../store/useAppStore';
import Button from '../components/Button';
import weatherData from '../data/weather.json';

interface LatLng {
  lat: number;
  lng: number;
}

export function OnboardingFlow() {
  const {
    currentStep,
    setCurrentStep,
    userLocation,
    setUserLocation,
    ownedLands,
    addLand,
    updateLand,
    partitions,
    addPartition,
    updatePartition,
    selectedLandId,
    selectedPartitionId,
    setSelectedLand,
    setSelectedPartition,
    isDrawingLand,
    setIsDrawingLand,
    isDrawingPartition,
    setIsDrawingPartition
  } = useAppStore();

  const [tempLandName, setTempLandName] = useState('');
  const [tempPartitionName, setTempPartitionName] = useState('');
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [editingLandId, setEditingLandId] = useState<string | null>(null);
  const [editingPartitionId, setEditingPartitionId] = useState<string | null>(null);
  const [pendingLandId, setPendingLandId] = useState<string | null>(null);

  // Calculate area from coordinates (simplified)
  const calculateArea = (coordinates: LatLng[]): number => {
    if (coordinates.length < 3) return 0;
    // Simplified area calculation - in real app you'd use proper geospatial calculation
    return Math.random() * 5 + 1; // Mock area between 1-6 acres
  };

  const handleLocationSelect = (location: LatLng) => {
    setUserLocation(location);
  };

  const handleConfirmLocation = () => {
    setCurrentStep('land-selection');
  };

  const handleStartDrawingLand = () => {
    setIsDrawingLand(true);
  };

  const handleLandDraw = (coordinates: LatLng[]) => {
    const area = calculateArea(coordinates);
    const landId = `land-${Date.now()}`;
    const landName = tempLandName || `Land ${ownedLands.length + 1}`;
    
    addLand({
      id: landId,
      name: landName,
      coordinates,
      area,
      crop: '' // Will be set in details modal
    });
    
    setIsDrawingLand(false);
    setTempLandName('');
    
    // Automatically open details modal for the new land
    setPendingLandId(landId);
    setEditingLandId(landId);
    setIsDetailsModalOpen(true);
  };

  const handleProceedToPartitioning = () => {
    setCurrentStep('partitioning');
  };

  const handleSkipPartitioning = () => {
    setCurrentStep('dashboard');
  };

  const handleStartDrawingPartition = () => {
    if (ownedLands.length === 0) {
      alert('Please draw your land first!');
      return;
    }
    setIsDrawingPartition(true);
  };

  const handlePartitionDraw = (coordinates: LatLng[]) => {
    if (ownedLands.length === 0) return;
    
    // Use selected land or first land as parent
    const parentLand = selectedLandId 
      ? ownedLands.find(land => land.id === selectedLandId)
      : ownedLands[0];
      
    if (!parentLand) return;
    
    const partitionId = `partition-${Date.now()}`;
    const partitionName = tempPartitionName || `Partition ${partitions.filter(p => p.parentLandId === parentLand.id).length + 1}`;
    
    addPartition({
      id: partitionId,
      name: partitionName,
      coordinates,
      parentLandId: parentLand.id,
      crop: '' // Will be set in details modal
    });
    
    setIsDrawingPartition(false);
    setTempPartitionName('');
    
    // Automatically open details modal for the new partition
    setEditingPartitionId(partitionId);
    setIsDetailsModalOpen(true);
  };

  const handleSaveLandDetails = (details: any) => {
    if (editingLandId) {
      updateLand(editingLandId, details);
      setEditingLandId(null);
      setPendingLandId(null);
    } else if (editingPartitionId) {
      updatePartition(editingPartitionId, details);
      setEditingPartitionId(null);
    }
  };

  const handleEditLandDetails = (landId: string) => {
    setEditingLandId(landId);
    setEditingPartitionId(null);
    setIsDetailsModalOpen(true);
  };

  const handleEditPartitionDetails = (partitionId: string) => {
    setEditingPartitionId(partitionId);
    setEditingLandId(null);
    setIsDetailsModalOpen(true);
  };

  const handleCloseDetailsModal = () => {
    setIsDetailsModalOpen(false);
    setEditingLandId(null);
    setEditingPartitionId(null);
    setPendingLandId(null);
  };

  const handleProceedToDashboard = () => {
    setCurrentStep('dashboard');
  };

  const handleLandSelect = (landId: string) => {
    setSelectedLand(landId);
  };

  const handlePartitionSelect = (partitionId: string) => {
    setSelectedPartition(partitionId);
  };

  const getSelectedData = () => {
    if (selectedPartitionId) {
      const partition = partitions.find(p => p.id === selectedPartitionId);
      return partition ? { type: 'partition', data: partition } : null;
    }
    if (selectedLandId) {
      const land = ownedLands.find(l => l.id === selectedLandId);
      return land ? { type: 'land', data: land } : null;
    }
    return null;
  };

  const selectedData = getSelectedData();

  return (
    <div className="min-h-screen flex flex-col">
      <Header />
      
      <main className="flex-1 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          {/* Progress Indicator */}
          <div className="mb-8">
            <div className="flex items-center justify-center space-x-4 mb-6">
              {[
                { step: 'location', icon: MapPin, label: 'Location' },
                { step: 'land-selection', icon: Sprout, label: 'Select Land' },
                { step: 'partitioning', icon: Grid3X3, label: 'Partitions' },
                { step: 'dashboard', icon: CheckCircle, label: 'Dashboard' }
              ].map((item, index) => (
                <div key={item.step} className="flex items-center">
                  <div className={`flex items-center justify-center w-10 h-10 rounded-full ${
                    currentStep === item.step 
                      ? 'bg-green-500 text-white' 
                      : index < ['location', 'land-selection', 'partitioning', 'dashboard'].indexOf(currentStep)
                      ? 'bg-green-200 text-green-800'
                      : 'bg-gray-200 text-gray-500'
                  }`}>
                    <item.icon className="w-5 h-5" />
                  </div>
                  <span className={`ml-2 text-sm font-medium ${
                    currentStep === item.step ? 'text-green-600' : 'text-gray-500'
                  }`}>
                    {item.label}
                  </span>
                  {index < 3 && (
                    <div className={`w-8 h-1 mx-4 rounded-full ${
                      index < ['location', 'land-selection', 'partitioning', 'dashboard'].indexOf(currentStep)
                        ? 'bg-green-200'
                        : 'bg-gray-200'
                    }`} />
                  )}
                </div>
              ))}
            </div>
            
            <div className="text-center">
              <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
                🌾 ApnaKeth Setup
              </h1>
              <p className="text-lg text-gray-600">
                {currentStep === 'location' && 'Let\'s start by finding your location'}
                {currentStep === 'land-selection' && 'Now select the land you own'}
                {currentStep === 'partitioning' && 'Divide your land into crop sections (optional)'}
                {currentStep === 'dashboard' && 'Your farm dashboard is ready!'}
              </p>
            </div>
          </div>

          {/* Map Section */}
          <div className="glassmorphism rounded-2xl overflow-hidden shadow-xl mb-8">
            <div className="p-6 md:p-8 border-b border-white/30">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold text-gray-800 mb-2">
                    {currentStep === 'location' && '📍 Select Your Location'}
                    {currentStep === 'land-selection' && '🌾 Draw Your Land Boundary'}
                    {currentStep === 'partitioning' && '✂️ Add Partitions (Optional)'}
                    {currentStep === 'dashboard' && '📊 Your Farm Overview'}
                  </h2>
                  <p className="text-gray-600">
                    {currentStep === 'location' && 'Click on the map or use GPS to set your location'}
                    {currentStep === 'land-selection' && 'Click to draw the boundary of your farmland'}
                    {currentStep === 'partitioning' && 'Create sections within your land for different crops'}
                    {currentStep === 'dashboard' && 'Click on any land or partition to view details'}
                  </p>
                </div>
                
                {/* Step-specific controls */}
                <div className="mt-4 md:mt-0 flex flex-col md:flex-row gap-3">
                  {currentStep === 'location' && userLocation && (
                    <Button onClick={handleConfirmLocation} variant="primary">
                      Confirm Location
                    </Button>
                  )}
                  
                  {currentStep === 'land-selection' && (
                    <div className="flex flex-col gap-2">
                      {!isDrawingLand ? (
                        <>
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder="Land name (optional)"
                              value={tempLandName}
                              onChange={(e) => setTempLandName(e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm"
                            />
                            <Button onClick={handleStartDrawingLand} variant="primary">
                              <Edit3 className="w-4 h-4 mr-2" />
                              Draw Land
                            </Button>
                          </div>
                          {ownedLands.length > 0 && (
                            <div className="bg-green-50 border border-green-200 rounded-lg p-3 space-y-2">
                              <p className="text-xs font-semibold text-green-800">Lands Created ({ownedLands.length}):</p>
                              {ownedLands.map((land: any) => (
                                <div key={land.id} className="flex items-center justify-between bg-white p-2 rounded-lg">
                                  <div className="flex-1">
                                    <p className="text-sm font-medium text-gray-800">{land.name}</p>
                                    <p className="text-xs text-gray-500">{land.area.toFixed(2)} acres {land.crop ? `• ${land.crop}` : ''}</p>
                                  </div>
                                  <Button 
                                    onClick={() => handleEditLandDetails(land.id)}
                                    variant="secondary"
                                    className="!py-1 !px-2 !text-xs"
                                  >
                                    <Edit2 className="w-3 h-3 mr-1" />
                                    Edit
                                  </Button>
                                </div>
                              ))}
                            </div>
                          )}
                        </>
                      ) : (
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm">
                          Drawing mode active - Double-click to finish
                        </div>
                      )}
                      {ownedLands.length > 0 && (
                        <Button onClick={handleProceedToPartitioning} variant="secondary">
                          Continue to Partitioning
                        </Button>
                      )}
                    </div>
                  )}
                  
                  {currentStep === 'partitioning' && (
                    <div className="flex flex-col gap-2">
                      {/* Current partition count */}
                      <div className="bg-green-50 border border-green-200 rounded-lg p-3">
                        <p className="text-sm text-green-800 font-medium">
                          🌾 {ownedLands.length > 0 ? ownedLands[0].name : 'Your Land'}
                        </p>
                        <p className="text-xs text-green-600">
                          {partitions.length} partition(s) created
                        </p>
                      </div>
                      
                      {!isDrawingPartition ? (
                        <div className="space-y-2">
                          <div className="flex gap-2">
                            <input
                              type="text"
                              placeholder={`Partition ${partitions.length + 1} (optional)`}
                              value={tempPartitionName}
                              onChange={(e) => setTempPartitionName(e.target.value)}
                              className="px-3 py-2 border border-gray-300 rounded-lg text-sm flex-1"
                            />
                            <Button onClick={handleStartDrawingPartition} variant="primary">
                              <Grid3X3 className="w-4 h-4 mr-2" />
                              Add Partition
                            </Button>
                          </div>
                          <p className="text-xs text-gray-500">
                            💡 Draw partitions inside your land area
                          </p>
                        </div>
                      ) : (
                        <div className="bg-blue-100 text-blue-800 px-4 py-2 rounded-lg text-sm">
                          🎯 Drawing partition - Click to add points, then click "Finish Drawing"
                        </div>
                      )}
                      <div className="flex gap-2">
                        <Button onClick={handleSkipPartitioning} variant="secondary">
                          Skip Partitioning
                        </Button>
                        <Button onClick={handleProceedToDashboard} variant="primary">
                          Go to Dashboard
                        </Button>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>
            
            {/* Map Component */}
            <div className="h-[60vh] md:h-[70vh]">
              <OnboardingMapComponent
                onLocationSelect={handleLocationSelect}
                selectedLocation={userLocation || undefined}
                className="w-full h-full"
                step={currentStep}
                isDrawingLand={isDrawingLand}
                onLandDraw={handleLandDraw}
                lands={ownedLands}
                selectedLandId={selectedLandId}
                onLandSelect={handleLandSelect}
                isDrawingPartition={isDrawingPartition}
                onPartitionDraw={handlePartitionDraw}
                partitions={partitions}
                selectedPartitionId={selectedPartitionId}
                onPartitionSelect={handlePartitionSelect}
              />
            </div>
          </div>

          {/* Details Section - Only show in dashboard step */}
          {currentStep === 'dashboard' && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-8">
              {/* Selection Info */}
              <div className="glassmorphism rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-purple-100 rounded-xl">
                    <MapPin className="w-6 h-6 text-purple-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Selected Area</h3>
                </div>
                
                {selectedData ? (
                  <div className="space-y-3">
                    <div className="bg-white/70 rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-1">Name</p>
                      <p className="font-bold text-gray-800">{selectedData.data.name}</p>
                    </div>
                    <div className="bg-white/70 rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-1">Type</p>
                      <p className="font-bold text-gray-800 capitalize">{selectedData.type}</p>
                    </div>
                    {'area' in selectedData.data && (
                      <div className="bg-white/70 rounded-lg p-3">
                        <p className="text-sm text-gray-600 mb-1">Area</p>
                        <p className="font-bold text-gray-800">{selectedData.data.area.toFixed(2)} acres</p>
                      </div>
                    )}
                    <div className="bg-white/70 rounded-lg p-3">
                      <p className="text-sm text-gray-600 mb-1">Crop</p>
                      <p className="font-bold text-gray-800">{selectedData.data.crop || 'Not specified'}</p>
                    </div>
                    
                    {/* Edit Details Button */}
                    <Button 
                      onClick={() => {
                        if (selectedData.type === 'land') {
                          handleEditLandDetails(selectedData.data.id);
                        } else {
                          handleEditPartitionDetails(selectedData.data.id);
                        }
                      }}
                      variant="primary"
                      className="w-full mt-4"
                    >
                      <Edit2 className="w-4 h-4 mr-2" />
                      Edit Details
                    </Button>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <p className="text-gray-500 mb-2">No area selected</p>
                    <p className="text-sm text-gray-400">Click on your land or partition to view details</p>
                  </div>
                )}
              </div>

              {/* Placeholder Cards */}
              <div className="glassmorphism rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-green-100 rounded-xl">
                    <Sprout className="w-6 h-6 text-green-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Crop Health</h3>
                </div>
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-2">Coming Soon!</p>
                  <p className="text-sm text-gray-400">NDVI analysis and crop health monitoring</p>
                </div>
              </div>

              <div className="glassmorphism rounded-2xl p-6 shadow-xl">
                <div className="flex items-center gap-3 mb-4">
                  <div className="p-3 bg-blue-100 rounded-xl">
                    <MapPin className="w-6 h-6 text-blue-600" />
                  </div>
                  <h3 className="text-xl font-bold text-gray-800">Weather</h3>
                </div>
                <div className="space-y-3">
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Current Temperature</p>
                    <p className="text-2xl font-bold text-gray-800">{weatherData.current.temperature}°C</p>
                  </div>
                  <div className="bg-white/70 rounded-lg p-3">
                    <p className="text-sm text-gray-600 mb-1">Condition</p>
                    <p className="font-bold text-gray-800 capitalize">
                      {weatherData.current.condition.replace('_', ' ')}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Status Summary */}
          <div className="glassmorphism rounded-2xl p-6 shadow-xl">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Setup Summary</h3>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  userLocation ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <MapPin className={`w-6 h-6 ${userLocation ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <p className="font-semibold text-gray-800">Location</p>
                <p className="text-sm text-gray-600">
                  {userLocation ? '✅ Set' : '⏳ Pending'}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  ownedLands.length > 0 ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Sprout className={`w-6 h-6 ${ownedLands.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <p className="font-semibold text-gray-800">Land Areas</p>
                <p className="text-sm text-gray-600">
                  {ownedLands.length > 0 ? `✅ ${ownedLands.length} area(s)` : '⏳ None'}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  partitions.length > 0 ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <Grid3X3 className={`w-6 h-6 ${partitions.length > 0 ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <p className="font-semibold text-gray-800">Partitions</p>
                <p className="text-sm text-gray-600">
                  {partitions.length > 0 ? `✅ ${partitions.length} partition(s)` : '⏳ None'}
                </p>
              </div>
              
              <div className="text-center">
                <div className={`w-12 h-12 mx-auto rounded-full flex items-center justify-center mb-2 ${
                  currentStep === 'dashboard' ? 'bg-green-100' : 'bg-gray-100'
                }`}>
                  <CheckCircle className={`w-6 h-6 ${currentStep === 'dashboard' ? 'text-green-600' : 'text-gray-400'}`} />
                </div>
                <p className="font-semibold text-gray-800">Dashboard</p>
                <p className="text-sm text-gray-600">
                  {currentStep === 'dashboard' ? '✅ Active' : '⏳ Pending'}
                </p>
              </div>
            </div>
          </div>
        </div>
      </main>
      
      {/* Land Details Modal */}
      <LandDetailsModal
        isOpen={isDetailsModalOpen}
        onClose={handleCloseDetailsModal}
        onSave={handleSaveLandDetails}
        initialData={
          editingLandId
            ? ownedLands.find((land: any) => land.id === editingLandId)
            : editingPartitionId
            ? partitions.find((p: any) => p.id === editingPartitionId)
            : undefined
        }
        landArea={
          editingLandId
            ? ownedLands.find((land: any) => land.id === editingLandId)?.area
            : undefined
        }
        title={
          editingLandId
            ? `Edit ${ownedLands.find((land: any) => land.id === editingLandId)?.name || 'Land'} Details`
            : editingPartitionId
            ? `Edit ${partitions.find((p: any) => p.id === editingPartitionId)?.name || 'Partition'} Details`
            : 'Land Details'
        }
      />
    </div>
  );
}