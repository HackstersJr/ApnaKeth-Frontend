import { create } from 'zustand';

interface AppState {
  selectedLand: string | null;
  setSelectedLand: (landId: string | null) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (location: { lat: number; lng: number }) => void;
}

export const useAppStore = create<AppState>((set) => ({
  selectedLand: null,
  setSelectedLand: (landId) => set({ selectedLand: landId }),
  userLocation: null,
  setUserLocation: (location) => set({ userLocation: location }),
}));
