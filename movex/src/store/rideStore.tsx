import { create } from 'zustand';
import { createJSONStorage, persist } from 'zustand/middleware';
import { mmkvStorage } from './storage';

type CustomLocation = {
  latitude: number;
  longitude: number;
  address: string;
  heading: number;
} | null;

interface RiderStoreProps {
  user: any;
  location: CustomLocation;
  outOfRange: boolean;
  setUser: (data: any) => void;
  setOnDuty: (data: boolean) => void;
  setLocation: (data: CustomLocation) => void;
  clearRiderData: () => void;
}

export const useRideStore = create<RiderStoreProps>()(
  persist(
    (set) => ({
        user: null,
        location: null,
        outOfRange: false,
        setUser: (data) => set({ user: data }),
        setOnDuty: (data) => set({ outOfRange: data }),
        setLocation: (data) => set({ location: data }),
        clearRiderData: () => set({ 
        user: null, 
        location: null, 
        outOfRange: false 
      }),
    }),
    {
      name: 'ride-store',
       partialize: (state) => ({
        user: state.user
      }),
      storage: createJSONStorage(() => mmkvStorage),
    }
  )
);