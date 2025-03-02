import { create } from "zustand";
import { UserProfile } from "../types";

interface ProfileState {
  profile: UserProfile | null;
  setProfile: (profile: UserProfile) => void;
  clearProfile: () => void;
}

export const useProfileStore = create<ProfileState>((set: (partial: Partial<ProfileState>) => void) => ({
  profile: null,
  setProfile: (profile: UserProfile) => set({ profile }),
  clearProfile: () => set({ profile: null }),
}));
