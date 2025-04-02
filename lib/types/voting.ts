import { EProposalStatus } from "./post";

export type Vote = "aye" | "nay" | "splitAbstain" | "split";

export interface Abstain {
  abstain: number;
  aye: number;
  nay: number;
}
export const ACTIVE_PROPOSAL_STATUSES = [
	EProposalStatus.DecisionDepositPlaced,
	EProposalStatus.Submitted,
	EProposalStatus.Deciding,
	EProposalStatus.ConfirmStarted,
	EProposalStatus.ConfirmAborted
];
