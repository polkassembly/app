import { EProposalType } from "../types";

export enum ProposalType {
	DEMOCRACY_PROPOSALS = 'democracy_proposals',
	TECH_COMMITTEE_PROPOSALS = 'tech_committee_proposals',
	TREASURY_PROPOSALS = 'treasury_proposals',
	REFERENDUMS = 'referendums',
	FELLOWSHIP_REFERENDUMS = 'fellowship_referendums',
	COUNCIL_MOTIONS = 'council_motions',
	BOUNTIES = 'bounties',
	TIPS = 'tips',
	CHILD_BOUNTIES = 'child_bounties',
	OPEN_GOV = 'referendums_v2',
	REFERENDUM_V2 = 'referendums_v2',
	DISCUSSIONS = 'discussions',
	GRANTS = 'grants',
	ANNOUNCEMENT = 'announcement',
	ALLIANCE_MOTION = 'alliance_motion',
	TECHNICAL_PIPS = 'technical_pips',
	UPGRADE_PIPS = 'upgrade_pips',
	COMMUNITY_PIPS = 'community_pips',
	ADVISORY_COMMITTEE = 'advisory_committee',
	USER_CREATED_BOUNTIES = 'user_created_bounties'
}
export enum OffChainProposalType {
	DISCUSSIONS = 'discussions',
	GRANTS = 'grants'
}
export function getSinglePostLinkFromProposalType(proposalType: ProposalType | OffChainProposalType): string {
	switch (proposalType) {
		case ProposalType.BOUNTIES:
			return EProposalType.BOUNTY;
		case ProposalType.CHILD_BOUNTIES:
			return EProposalType.CHILD_BOUNTY;
		case ProposalType.COUNCIL_MOTIONS:
			return EProposalType.COUNCIL_MOTION;
		case ProposalType.DEMOCRACY_PROPOSALS:
			return EProposalType.DEMOCRACY_PROPOSAL;
		case ProposalType.DISCUSSIONS:
			return EProposalType.DISCUSSION;
		case ProposalType.GRANTS:
			return EProposalType.GRANT;
		case ProposalType.FELLOWSHIP_REFERENDUMS:
			return EProposalType.FELLOWSHIP_REFERENDUM;
		case ProposalType.OPEN_GOV:
			return EProposalType.REFERENDUM_V2;
		case ProposalType.REFERENDUMS:
			return EProposalType.REFERENDUM;
		case ProposalType.TECH_COMMITTEE_PROPOSALS:
			return EProposalType.TECH_COMMITTEE_PROPOSAL;
		case ProposalType.TIPS:
			return EProposalType.TIP;
		case ProposalType.TREASURY_PROPOSALS:
			return EProposalType.TREASURY_PROPOSAL;
		case ProposalType.ALLIANCE_MOTION:
			return EProposalType.ALLIANCE_MOTION;
		case ProposalType.ANNOUNCEMENT:
			return EProposalType.ANNOUNCEMENT;
		case ProposalType.TECHNICAL_PIPS:
			return 'technical';
		case ProposalType.COMMUNITY_PIPS:
			return EProposalType.COMMUNITY;
		case ProposalType.UPGRADE_PIPS:
			return 'upgrade';
		case ProposalType.ADVISORY_COMMITTEE:
			return EProposalType.ADVISORY_COMMITTEE;
	}
	return '';
}