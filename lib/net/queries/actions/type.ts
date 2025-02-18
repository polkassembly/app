export enum EActivityName {
	// On-chain Activities
	VOTED_ON_PROPOSAL = 'voted_on_proposal',
	CREATED_PROPOSAL = 'created_proposal',
	CREATED_TIP = 'created_tip',
	GAVE_TIP = 'gave_tip',
	CREATED_BOUNTY = 'created_bounty',
	CREATED_CHILD_BOUNTY = 'created_child_bounty',
	CLAIMED_BOUNTY = 'claimed_bounty',
	SIGNED_UP_FOR_IDENTITY_VERIFICATION = 'signed_up_for_identity_verification',
	APPROVED_BOUNTY = 'approved_bounty',
	VERIFIED_IDENTITY = 'verified_identity',
	COMPLETED_IDENTITY_JUDGEMENT = 'completed_identity_judgement',
	DELEGATED_VOTE = 'delegated_vote',
	RECEIVED_DELEGATION = 'received_delegation',
	PLACED_DECISION_DEPOSIT = 'placed_decision_deposit',
	REMOVED_VOTE = 'removed_vote',
	REDUCED_CONVICTION = 'reduced_conviction',
	REDUCED_CONVICTION_AFTER_SIX_HOURS_OF_FIRST_VOTE = 'reduced_conviction_after_six_hours_of_first_vote',
	REMOVED_VOTE_AFTER_SIX_HOURS_OF_FIRST_VOTE = 'removed_vote_after_six_hours_of_first_vote',
	LOST_DUE_TO_SLASHING_TIP_OR_PROPOSAL = 'lost_due_to_slashing_tip_or_proposal',
	PROPOSAL_FAILED = 'proposal_failed',
	PROPOSAL_PASSED = 'proposal_passed',
	VOTE_PASSED = 'vote_passed',
	VOTE_FAILED = 'vote_failed',

	// Off-chain Activities
	QUIZ_ANSWERED_CORRECTLY = 'quiz_answered_correctly',
	REACTED_TO_POST = 'reacted_to_post',
	REACTED_TO_COMMENT = 'reacted_to_comment',
	COMMENTED_ON_POST = 'commented_on_post',
	DELETED_COMMENT = 'deleted_comment',
	REPLIED_TO_COMMENT = 'replied_to_comment',
	CREATED_OFFCHAIN_POST = 'created_offchain_post',
	LINKED_DISCUSSION = 'linked_discussion',
	TOOK_QUIZ = 'took_quiz',
	UPDATED_PROFILE = 'updated_profile',
	REPORTED_CONTENT = 'reported_content',
	RECEIVED_REPORT = 'received_report',
	RECEIVED_SPAM_REPORT = 'received_spam_report',
	REMOVED_CONTENT = 'removed_content',
	RECEIVED_LIKE_ON_DISCUSSION = 'received_like_on_discussion',
	RECEIVED_LIKE_ON_COMMENT = 'received_like_on_comment',
	DELETED_REACTION = 'deleted_reaction',
	ADDED_CONTEXT_TO_PROPOSAL = 'added_context_to_proposal',
	ADDED_PROFILE_PICTURE = 'added_profile_picture',
	ADDED_BIO = 'added_bio',
	ADDED_PROFILE_TITLE = 'added_profile_title',
	ADDED_PROFILE_TAGS = 'added_profile_tags',
	COMMENT_TAKEN_DOWN = 'comment_taken_down',
	POST_TAKEN_DOWN = 'post_taken_down',
	POST_MARKED_AS_SPAM = 'post_marked_as_spam',
	LINKED_ADDRESS = 'linked_address',
	LINKED_MULTIPLE_ADDRESSES = 'linked_multiple_addresses',
	UNLINKED_ADDRESS = 'unlinked_address',
	UNLINKED_MULTIPLE_ADDRESSES = 'unlinked_multiple_addresses'
}

export enum EActivityCategory {
	ON_CHAIN = 'on_chain',
	OFF_CHAIN = 'off_chain'
}

export enum ENetwork {
	KUSAMA = 'kusama',
	POLKADOT = 'polkadot',
	WESTEND = 'westend'
}

export enum EVoteDecision {
	AYE = 'aye',
	NAY = 'nay',
	ABSTAIN = 'abstain',
	SPLIT = 'split',
	SPLIT_ABSTAIN = 'splitAbstain'
}

export enum EReaction {
	like = 'like',
	dislike = 'dislike'
}

export interface IActivityMetadata {
	// For votes
	decision?: EVoteDecision;
	conviction?: number;

	// For reactions
	reaction?: EReaction;

	// For comments
	commentId?: string;
	parentCommentId?: string;

	// For reports
	reportReason?: string;
	reportedByUserId?: number;

	// For profile updates
	field?: string;

	// For likes received
	likeCount?: number;

	// For delegations
	delegatedToAddress?: string;
	delegatedFromAddress?: string;

	// For quiz
	score?: number;

	// For bounties/tips
	amount?: string;
	beneficiaryAddress?: string;

	// for identity and link address
	address?: string;
}

export enum EProposalType {
	ALLIANCE_MOTION = 'AllianceMotion',
	ANNOUNCEMENT = 'Announcement',
	DEMOCRACY_PROPOSAL = 'DemocracyProposal',
	TECH_COMMITTEE_PROPOSAL = 'TechCommitteeProposal',
	TREASURY_PROPOSAL = 'TreasuryProposal',
	REFERENDUM = 'Referendum',
	FELLOWSHIP_REFERENDUM = 'FellowshipReferendum',
	COUNCIL_MOTION = 'CouncilMotion',
	BOUNTY = 'Bounty',
	TIP = 'Tip',
	CHILD_BOUNTY = 'ChildBounty',
	REFERENDUM_V2 = 'ReferendumV2',
	TECHNICAL_COMMITTEE = 'TechnicalCommittee',
	COMMUNITY = 'Community',
	UPGRADE_COMMITTEE = 'UpgradeCommittee',
	ADVISORY_COMMITTEE = 'AdvisoryCommittee',
	DISCUSSION = 'Discussion',
	GRANT = 'Grant'
}

export interface UserActivity {
	id: string;
	userId: number;
	name: EActivityName;
	subActivityName?: EActivityName;
	category: EActivityCategory;
	network?: ENetwork; // optional for profile activities
	proposalType?: EProposalType;
	indexOrHash?: string;
	metadata?: IActivityMetadata;
	createdAt: Date;
	updatedAt: Date;
	message?: string;
}
export interface CartItemParams {
  postIndexOrHash: string;
  proposalType: string;
  decision: "aye" | "nay" | "abstain";
  amount: {
    aye?: string;
    nay?: string;
    abstain?: string;
  };
  conviction: number;
}