import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserActivity } from '@/lib/net/queries/actions/type';

interface ActivityState {
  activities: UserActivity[];
  setActivities: (activities: UserActivity[]) => void;
  addActivity: (activity: UserActivity) => void;
  clearActivities: () => void;
}

export const useActivityStore = create<ActivityState>()(
  persist(
    (set) => ({
      activities: [],
      setActivities: (activities: UserActivity[]) => set({ activities }),
      addActivity: (activity: UserActivity) =>
        set((state) => ({ activities: [...state.activities, activity] })),
      clearActivities: () => set({ activities: [] }),
    }),
    {
      name: 'activity-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
