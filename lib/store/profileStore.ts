import { create } from "zustand";
import { persist, createJSONStorage } from "zustand/middleware";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { UserProfile } from "../types";

interface ProfileState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>()(
  persist(
    (set) => ({
      profile: null,

      setProfile: (profile) => set({ profile }),

      clearProfile: () => set({ profile: null }),
    }),
    {
      name: "user-profile-storage",
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);
