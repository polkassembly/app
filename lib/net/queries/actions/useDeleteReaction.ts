import client from "@/lib/net/client";
import { MutationBuilder } from "../builder";
import { EProposalType } from "@/lib/types";

interface DeleteReactionPathParams {
	proposalType: EProposalType;
	postIndexOrHash: number;
	reactionId: string;
}

const useDeleteReaction = new MutationBuilder<DeleteReactionPathParams, unknown, unknown, unknown>(client)
	.method("DELETE")
	.url(`proposals/{proposalType}/{postIndexOrHash}/reactions/{reactionId}`)
	.build();

export default useDeleteReaction;