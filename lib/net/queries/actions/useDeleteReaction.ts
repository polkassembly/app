import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { EProposalType } from "@/lib/types";
import { buildActivityFeedQueryKey } from "../post/useActivityFeed";
import { buildProposalByIndexQueryKey } from "../post/useProposalByIndex";

interface DeleteReactionPathParams {
  proposalType: EProposalType;
  postIndexOrHash: string;
  reactionId: string;
}

interface DeleteReactionResponse {
  message: string;
}

const useDeleteReaction = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteReactionResponse, Error, { pathParams: DeleteReactionPathParams }>({
    mutationFn: async ({ pathParams }) => {
      const response = await client.delete<DeleteReactionResponse>(
        `${pathParams.proposalType}/${pathParams.postIndexOrHash}/reactions/${pathParams.reactionId}`
      );
      return response.data;
    },
    onError: (error, { pathParams }) => {
      queryClient.invalidateQueries({ queryKey: buildProposalByIndexQueryKey({ proposalType: pathParams.proposalType, indexOrHash: pathParams.postIndexOrHash }) });
      throw new Error("Failed to delete reaction", error);
    },
    onSettled: (_, __, { pathParams }) => {
      queryClient.invalidateQueries({ queryKey: buildProposalByIndexQueryKey({ proposalType: pathParams.proposalType, indexOrHash: pathParams.postIndexOrHash }) });
    },
  });
};

export default useDeleteReaction;
