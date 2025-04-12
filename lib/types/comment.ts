import { EProposalType } from ".";
import { UserProfile } from ".";
import { ENetwork, Reaction } from "./post";

export enum EDataSource {
	POLKASSEMBLY = 'polkassembly',
	SUBSQUARE = 'subsquare'
}

export enum ECommentSentiment {
	AGAINST = 'against',
	SLIGHTLY_AGAINST = 'slightly_against',
	NEUTRAL = 'neutral',
	SLIGHTLY_FOR = 'slightly_for',
	FOR = 'for'
}

export interface IOffChainContentHistoryItem {
	content: string;
	title?: string;
	createdAt: Date;
}

export interface IComment {
	id: string;
	createdAt: Date;
	updatedAt: Date;
	userId: number;
	content: string;
	network: ENetwork;
	proposalType: EProposalType;
	indexOrHash: string;
	parentCommentId: string | null;
	isDeleted: boolean;
	dataSource: EDataSource;
	isSpam?: boolean;
	sentiment?: ECommentSentiment;
	aiSentiment?: ECommentSentiment;
	history?: IOffChainContentHistoryItem[];
}

export interface ICommentResponse extends IComment {
	user: Omit<UserProfile, 'rank'>;
	children?: ICommentResponse[];
	reactions?: Reaction[];
}