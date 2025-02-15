import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { EProposalType, EReaction, Feed, Post } from "@/lib/types";
import { buildActivityFeedQueryKey } from "../post/useActivityFeed";
import { buildProposalByIndexQueryKey } from "../post/useProposalByIndex";
interface AddReactionPathParams {
  proposalType: EProposalType;
  postIndexOrHash: string;
}

interface AddReactionBody {
  reaction: EReaction;
}

interface AddReactionResponse {
  message: string;
  reactionId: string;
}
const useAddReaction = () => {
  const queryClient = useQueryClient();

  return useMutation<AddReactionResponse, Error, { pathParams: AddReactionPathParams; bodyParams: AddReactionBody }>({
    mutationFn: async ({ pathParams, bodyParams }) => {
      const response = await client.post<AddReactionResponse>(
        `${pathParams.proposalType}/${pathParams.postIndexOrHash}/reactions`,
        bodyParams
      );
      return response.data;
    },
    onError: (error, { pathParams }) => {
      queryClient.invalidateQueries({ queryKey: buildActivityFeedQueryKey({ limit: 10 }) });
      queryClient.invalidateQueries({ queryKey: buildProposalByIndexQueryKey({ proposalType: pathParams.proposalType, indexOrHash: pathParams.postIndexOrHash }) });
      throw new Error("Failed to add reaction", error);
    },

    onSettled: (_, __, { pathParams }) => {
      queryClient.invalidateQueries({ queryKey: buildActivityFeedQueryKey({ limit: 10 }) });
      queryClient.invalidateQueries({ queryKey: buildProposalByIndexQueryKey({ proposalType: pathParams.proposalType, indexOrHash: pathParams.postIndexOrHash }) });
    },
  });
};

export default useAddReaction;