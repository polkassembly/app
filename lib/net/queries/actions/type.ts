import { Vote } from "@/lib/types/voting";

export interface CartItemParams {
  postIndexOrHash: string;
  proposalType: string;
  decision: Vote;
  amount: {
    aye?: string;
    nay?: string;
    abstain?: string;
  };
  conviction: number;
	proposalTitle: string;
}