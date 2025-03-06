import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { EProposalType } from "@/lib/types";

interface DeleteCommentReactionPathParams {
  proposalType: EProposalType;
  postIndexOrHash: string;
  reactionId: string;
	commentId: string;
}

interface DeleteReactionResponse {
  message: string;
}

const useDeleteCommentReaction = () => {
  const queryClient = useQueryClient();

  return useMutation<DeleteReactionResponse, Error, { pathParams: DeleteCommentReactionPathParams }>({
    mutationFn: async ({ pathParams }) => {
      const response = await client.delete<DeleteReactionResponse>(
        `${pathParams.proposalType}/${pathParams.postIndexOrHash}/comments/${pathParams.commentId}/reactions/${pathParams.reactionId}`
      );
      return response.data;
    },
    onError: (error, { pathParams }) => {
      throw new Error("Failed to delete reaction", error);
    },
    onSettled: (_, __, { pathParams }) => {
    },
  });
};

export default useDeleteCommentReaction;
