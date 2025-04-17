import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { IUserActivity } from '../types/user';

interface ActivityState {
  activities: IUserActivity[];
  setActivities: (activities: IUserActivity[]) => void;
  addActivity: (activity: IUserActivity) => void;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      setActivities: (activities: IUserActivity[]) => set({ activities }),
      addActivity: (activity: IUserActivity) =>
        set((state) => ({ activities: [...state.activities, activity] })),
      clearActivities: () => set({ activities: [] }),
    }),
    {
      name: 'activity-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
