export type Vote = "aye" | "nay" | "splitAbstain" | "split";

export interface Abstain {
  abstain: number;
  aye: number;
  nay: number;
}