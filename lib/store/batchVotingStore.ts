import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Abstain, Vote } from "@/lib/types/voting";

interface BatchVotingState {
  vote: Vote;
  ayeAmount: number;
  nayAmount: number;
  abstainAmount: Abstain;
  conviction: number;
  setVote: (vote: Vote) => void;
  setAyeAmount: (amount: number) => void;
  setNayAmount: (amount: number) => void;
  setAbstainAmount: (amount: Abstain) => void;
  setConviction: (conviction: number) => void;
  resetDefaults: () => void;
}

// Default initial values
const DEFAULT_VALUES = {
  vote: 'aye' as Vote,
  ayeAmount: 1,
  nayAmount: 1,
  abstainAmount: { abstain: 1, aye: 1, nay: 1 } as Abstain,
  conviction: 0,
};

export const useBatchVotingStore = create<BatchVotingState>()(
  persist(
    (set) => ({
      ...DEFAULT_VALUES,
      
      setVote: (vote) => set({ vote }),
      
      setAyeAmount: (ayeAmount) => set({ ayeAmount }),
      
      setNayAmount: (nayAmount) => set({ nayAmount }),
      
      setAbstainAmount: (abstainAmount) => set({ abstainAmount }),
      
      setConviction: (conviction) => set({ conviction }),
      
      resetDefaults: () => set(DEFAULT_VALUES),
    }),
    {
      name: 'batch-voting-storage',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
);