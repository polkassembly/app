import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { EProposalType, EReaction, ICommentResponse } from "@/lib/types";
import { buildProposalByIndexQueryKey } from "../post/useProposalByIndex";
import { buildProposalCommentsQueryKey } from "../post";
import { Reaction } from "@/lib/types/post";

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

  return useMutation<
    AddReactionResponse, 
    Error, 
    { pathParams: AddCommentReactionPathParams; bodyParams: AddReactionBody }, 
    { previousComments?: ICommentResponse[] }  // Explicitly defining context type here
  >({
    mutationFn: async ({ pathParams, bodyParams }) => {
      const response = await client.post<AddReactionResponse>(
        `${pathParams.proposalType}/${pathParams.postIndexOrHash}/comments/${pathParams.commentId}/reactions`,
        bodyParams
      );
      return response.data;
    },
    onMutate: async ({ pathParams, bodyParams }) => {
      await queryClient.cancelQueries({
        queryKey: buildProposalByIndexQueryKey({ proposalType: pathParams.proposalType, indexOrHash: pathParams.postIndexOrHash }),
      });

      const previousComments = queryClient.getQueryData<ICommentResponse[]>(
        buildProposalCommentsQueryKey({
          proposalType: pathParams.proposalType,
          proposalId: pathParams.postIndexOrHash,
        })
      );

      if (previousComments) {
        queryClient.setQueryData<ICommentResponse[]>(
          buildProposalCommentsQueryKey({
            proposalType: pathParams.proposalType,
            proposalId: pathParams.postIndexOrHash,
          }),
          previousComments.map((comment) => {
            if (comment.id === pathParams.commentId) {
              return {
                ...comment,
                reactions: [
                  {
                    id: "newReaction",
                    reaction: bodyParams.reaction,
                  } as Reaction,
                ],
              };
            }
            return comment;
          })
        );
      }

      return { previousComments }; // Return previous comments for rollback
    },
    onError: (error, variables, context) => {
      if (context?.previousComments) {
        queryClient.setQueryData<ICommentResponse[]>(
          buildProposalCommentsQueryKey({
            proposalType: variables.pathParams.proposalType,
            proposalId: variables.pathParams.postIndexOrHash,
          }),
          context.previousComments
        );
      }
      console.error("Failed to add reaction:", error);
    },
    onSettled: (_, __, { pathParams }) => {
      queryClient.invalidateQueries({
        queryKey: buildProposalCommentsQueryKey({
          proposalType: pathParams.proposalType,
          proposalId: pathParams.postIndexOrHash,
        }),
      });
    },
  });
};

export default useAddCommentReaction;
