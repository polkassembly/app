import client from "@/lib/net/client";
import { MutationBuilder } from "../builder";
import { EProposalType, EReaction } from "@/lib/types";

interface AddReactionPathParams {
	proposalType: EProposalType;
	postIndexOrHash: number;
}

interface AddReactionBody {
	reaction: EReaction;
}

interface AddReactionResponse {
	message: string;
	reactionId: string;
}

const useAddReaction = new MutationBuilder<AddReactionPathParams, AddReactionBody, unknown, AddReactionResponse>(client)
	.method("POST")
	.url(`proposals/{proposalType}/{postIndexOrHash}/reactions`)
	.build();

export default useAddReaction;