import { create } from 'zustand';

interface LatLng {
  lat: number;
  lng: number;
}

interface LandArea {
  id: string;
  name: string;
  coordinates: LatLng[];
  area: number;
  crop?: string;
  cropVariety?: string;
  plantedDate?: string;
  expectedHarvestDate?: string;
  irrigationType?: 'drip' | 'sprinkler' | 'flood' | 'rainfed' | 'other';
  fertilizers?: string;
  pesticides?: string;
  notes?: string;
}

interface Partition {
  id: string;
  name: string;
  coordinates: LatLng[];
  parentLandId: string;
  crop?: string;
  cropVariety?: string;
  plantedDate?: string;
  expectedHarvestDate?: string;
  irrigationType?: 'drip' | 'sprinkler' | 'flood' | 'rainfed' | 'other';
  fertilizers?: string;
  pesticides?: string;
  notes?: string;
}

type OnboardingStep = 'location' | 'land-selection' | 'partitioning' | 'dashboard';

interface AppState {
  // Onboarding flow
  currentStep: OnboardingStep;
  setCurrentStep: (step: OnboardingStep) => void;
  
  // Location
  userLocation: LatLng | null;
  setUserLocation: (location: LatLng) => void;
  
  // Land management
  ownedLands: LandArea[];
  addLand: (land: LandArea) => void;
  updateLand: (landId: string, updates: Partial<LandArea>) => void;
  removeLand: (landId: string) => void;
  
  // Partitions
  partitions: Partition[];
  addPartition: (partition: Partition) => void;
  updatePartition: (partitionId: string, updates: Partial<Partition>) => void;
  removePartition: (partitionId: string) => void;
  
  // Selection
  selectedLandId: string | null;
  selectedPartitionId: string | null;
  setSelectedLand: (landId: string | null) => void;
  setSelectedPartition: (partitionId: string | null) => void;
  
  // UI state
  isDrawingLand: boolean;
  setIsDrawingLand: (drawing: boolean) => void;
  isDrawingPartition: boolean;
  setIsDrawingPartition: (drawing: boolean) => void;
}

export const useAppStore = create<AppState>((set, get) => ({
  // Onboarding flow
  currentStep: 'location',
  setCurrentStep: (step) => set({ currentStep: step }),
  
  // Location
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
  
  // Land management
  ownedLands: [],
  addLand: (land) => set((state) => ({ 
    ownedLands: [...state.ownedLands, land] 
  })),
  updateLand: (landId, updates) => set((state) => ({
    ownedLands: state.ownedLands.map(land => 
      land.id === landId ? { ...land, ...updates } : land
    )
  })),
  removeLand: (landId) => set((state) => ({
    ownedLands: state.ownedLands.filter(land => land.id !== landId),
    partitions: state.partitions.filter(partition => partition.parentLandId !== landId),
    selectedLandId: state.selectedLandId === landId ? null : state.selectedLandId
  })),
  
  // Partitions
  partitions: [],
  addPartition: (partition) => set((state) => ({ 
    partitions: [...state.partitions, partition] 
  })),
  updatePartition: (partitionId, updates) => set((state) => ({
    partitions: state.partitions.map(partition => 
      partition.id === partitionId ? { ...partition, ...updates } : partition
    )
  })),
  removePartition: (partitionId) => set((state) => ({
    partitions: state.partitions.filter(partition => partition.id !== partitionId),
    selectedPartitionId: state.selectedPartitionId === partitionId ? null : state.selectedPartitionId
  })),
  
  // Selection
  selectedLandId: null,
  selectedPartitionId: null,
  setSelectedLand: (landId) => set({ 
    selectedLandId: landId,
    selectedPartitionId: null // Clear partition selection when selecting land
  }),
  setSelectedPartition: (partitionId) => set({ 
    selectedPartitionId: partitionId,
    selectedLandId: null // Clear land selection when selecting partition
  }),
  
  // UI state
  isDrawingLand: false,
  setIsDrawingLand: (drawing) => set({ isDrawingLand: drawing }),
  isDrawingPartition: false,
  setIsDrawingPartition: (drawing) => set({ isDrawingPartition: drawing }),
}));
