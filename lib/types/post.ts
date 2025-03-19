export enum EGovType {
	GOV_1 = 'gov_1',
	OPENGOV = 'opengov'
}

export enum EAssets {
	DED = 'DED',
	USDT = 'USDT',
	USDC = 'USDC'
}

export enum EReaction {
  like = "like",
  dislike = "dislike",
}

export enum EProposalType {
  ALLIANCE_MOTION = "AllianceMotion",
  ANNOUNCEMENT = "Announcement",
  DEMOCRACY_PROPOSAL = "DemocracyProposal",
  TECH_COMMITTEE_PROPOSAL = "TechCommitteeProposal",
  TREASURY_PROPOSAL = "TreasuryProposal",
  REFERENDUM = "Referendum",
  FELLOWSHIP_REFERENDUM = "FellowshipReferendum",
  COUNCIL_MOTION = "CouncilMotion",
  BOUNTY = "Bounty",
  TIP = "Tip",
  CHILD_BOUNTY = "ChildBounty",
  REFERENDUM_V2 = "ReferendumV2",
  TECHNICAL_COMMITTEE = "TechnicalCommittee",
  COMMUNITY = "Community",
  UPGRADE_COMMITTEE = "UpgradeCommittee",
  ADVISORY_COMMITTEE = "AdvisoryCommittee",
  DISCUSSION = "Discussion",
  GRANT = "Grant",
}

export enum ENetwork {
  KUSAMA = "kusama",
  POLKADOT = "polkadot",
  WESTEND = "westend",
}

export enum EProposalStatus {
  Unknown = "Unknown",
  Noted = "Noted",
  Proposed = "Proposed",
  Tabled = "Tabled",
  Started = "Started",
  Passed = "Passed",
  NotPassed = "NotPassed",
  Cancelled = "Cancelled",
  CuratorProposed = "CuratorProposed",
  CuratorAssigned = "CuratorAssigned",
  CuratorUnassigned = "CuratorUnassigned",
  Executed = "Executed",
  ExecutionFailed = "ExecutionFailed",
  Used = "Used",
  Invalid = "Invalid",
  Missing = "Missing",
  Reaped = "Reaped",
  Approved = "Approved",
  Disapproved = "Disapproved",
  Closed = "Closed",
  Awarded = "Awarded",
  Added = "Added",
  Rejected = "Rejected",
  Retracted = "Retracted",
  Slashed = "Slashed",
  Active = "Active",
  Extended = "Extended",
  Claimed = "Claimed",
  Unrequested = "Unrequested",
  Requested = "Requested",
  Submitted = "Submitted",
  Killed = "Killed",
  Cleared = "Cleared",
  Deciding = "Deciding",
  ConfirmStarted = "ConfirmStarted",
  ConfirmAborted = "ConfirmAborted",
  Confirmed = "Confirmed",
  DecisionDepositPlaced = "DecisionDepositPlaced",
  TimedOut = "TimedOut",
  Opened = "Opened",
  Created = "Created",
}

export enum EAllowedCommentor {
	ALL = 'all',
	ONCHAIN_VERIFIED = 'onchain_verified',
	NONE = 'none'
}

export interface Reaction {
  id: string;
  network: ENetwork;
  proposalType: EProposalType;
  indexOrHash: string;
  userId: number;
  reaction: EReaction;
  createdAt: string;
  updatedAt: string;
}

export enum EPostOrigin {
  AUCTION_ADMIN = "AuctionAdmin",
  BIG_SPENDER = "BigSpender",
  BIG_TIPPER = "BigTipper",
  CANDIDATES = "Candidates",
  EXPERTS = "Experts",
  FELLOWS = "Fellows",
  FELLOWSHIP_ADMIN = "FellowshipAdmin",
  GENERAL_ADMIN = "GeneralAdmin",
  GRAND_MASTERS = "GrandMasters",
  LEASE_ADMIN = "LeaseAdmin",
  MASTERS = "Masters",
  MEDIUM_SPENDER = "MediumSpender",
  MEMBERS = "Members",
  PROFICIENTS = "Proficients",
  REFERENDUM_CANCELLER = "ReferendumCanceller",
  REFERENDUM_KILLER = "ReferendumKiller",
  ROOT = "Root",
  SENIOR_EXPERTS = "SeniorExperts",
  SENIOR_FELLOWS = "SeniorFellows",
  SENIOR_MASTERS = "SeniorMasters",
  SMALL_SPENDER = "SmallSpender",
  SMALL_TIPPER = "SmallTipper",
  STAKING_ADMIN = "StakingAdmin",
  TREASURER = "Treasurer",
  WHITELISTED_CALLER = "WhitelistedCaller",
  WISH_FOR_CHANGE = "WishForChange",
  FAST_GENERAL_ADMIN = "FastGeneralAdmin",
}

export enum EVoteDecision {
  AYE = "aye",
  NAY = "nay",
  ABSTAIN = "abstain",
  SPLIT = "split",
  SPLIT_ABSTAIN = "splitAbstain",
}

export interface IVoteMetrics {
  [EVoteDecision.AYE]: { count: number; value: string };
  [EVoteDecision.NAY]: { count: number; value: string };
  support: { value: string };
  bareAyes: { value: string };
}

export interface IBeneficiary {
  address: string;
  amount: string;
  assetId: string | null;
}

export interface IStatusHistoryItem {
  status: EProposalStatus;
  timestamp: string;
  block: number;
}

export interface OnChainPostInfo {
  proposer: string;
  status: EProposalStatus;
  createdAt?: string;
  index?: number;
  hash?: string;
  origin?: EPostOrigin;
  description?: string;
  voteMetrics?: IVoteMetrics;
  beneficiaries?: IBeneficiary[];
  preparePeriodEndsAt?: string;
  decisionPeriodEndsAt?: string;
  confirmationPeriodEndsAt?: string;
  timeline?: IStatusHistoryItem[];
}

export interface Post {
  id: "";
  index: string;
  title: string;
  content: {};
  htmlContent: string;
  createdAt: string;
  updatedAt: string;
  tags: [];
  proposalType: EProposalType;
  network: string;
  dataSource: string;
  metrics: {
    reactions: {
      like: number;
      dislike: number;
    };
    comments: number;
  };
  allowedCommentor?: EAllowedCommentor;
  onChainInfo?: OnChainPostInfo;
  reactions?: Reaction[];
  userSubscriptionId?: string;
  preimageArgs?: Record<string, unknown>;
}

export interface Feed {
  items: Post[];
  totalCount: string;
}

export interface ContentSummary {
  id: string,
  indexOrHash: string,
  postSummary: string,
  proposalType: EProposalType,
  network: ENetwork,
  createdAt: string,
  updatedAt: string,
}