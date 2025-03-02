import { create } from "zustand";
import { Post } from "../types";

interface ProposalState {
  proposal: Post | null;
  setProposal: (proposal: Post) => void;
  clearProposal: () => void;
}

export const useProposalStore = create<ProposalState>((set: (partial: Partial<ProposalState>) => void) => ({
  proposal: null,
  setProposal: (proposal: Post) => set({ proposal }),
  clearProposal: () => set({ proposal: null }),
}));
