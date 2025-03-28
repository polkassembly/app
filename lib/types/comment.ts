import { EProposalType } from ".";
import { UserProfile } from ".";
import { ENetwork, Reaction } from "./post";

export enum EDataSource {
	POLKASSEMBLY = 'polkassembly',
	SUBSQUARE = 'subsquare'
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
	address: string | null;
	dataSource: EDataSource;
	reactions: Reaction[];
}

export interface ICommentResponse extends IComment {
	user: Omit<UserProfile, 'rank'>;
	children?: ICommentResponse[];
}