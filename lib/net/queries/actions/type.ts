export interface CartItemParams {
  postIndexOrHash: string;
  proposalType: string;
  decision: "aye" | "nay" | "splitAbstain" | "split";
  amount: {
    aye?: string;
    nay?: string;
    abstain?: string;
  };
  conviction: number;
	proposalTitle: string;
}