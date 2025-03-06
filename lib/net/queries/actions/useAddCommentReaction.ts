import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { EProposalType, EReaction, Feed, Post } from "@/lib/types";
import { buildActivityFeedQueryKey } from "../post/useActivityFeed";
import { buildProposalByIndexQueryKey } from "../post/useProposalByIndex";

interface AddCommentReactionPathParams {
  proposalType: EProposalType;
  postIndexOrHash: string;
	commentId: string;
}

interface AddReactionBody {
  reaction: EReaction;
}

interface AddReactionResponse {
  message: string;
  reactionId: string;
}

const useAddCommentReaction = () => {
  const queryClient = useQueryClient();

  return useMutation<AddReactionResponse, Error, { pathParams: AddCommentReactionPathParams
		; bodyParams: AddReactionBody }>({
    mutationFn: async ({ pathParams, bodyParams }) => {
      const response = await client.post<AddReactionResponse>(
        `${pathParams.proposalType}/${pathParams.postIndexOrHash}/comments/${pathParams.commentId}/reactions`,
        bodyParams
      );
      return response.data;
    },
    onError: (error, { pathParams }) => {
      throw new Error("Failed to add reaction", error);
    },

    onSettled: (_, __, { pathParams }) => {
    },
  });
};

export default useAddCommentReaction;