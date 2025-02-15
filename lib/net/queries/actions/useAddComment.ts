// useAddComment.ts
import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { EProposalType } from "@/lib/types";
import { buildActivityFeedQueryKey } from "../post/useActivityFeed";
import { buildProposalByIndexQueryKey } from "../post/useProposalByIndex";

interface AddCommentPathParams {
  proposalType: EProposalType;
  postIndexOrHash: string;
}

interface AddCommentBody {
  content: string;
  parentCommentId?: string;
  address?: string;
}

interface AddCommentResponse {
  message: string;
  commentId: string;
}

const useAddComment = () => {
  const queryClient = useQueryClient();

  return useMutation<AddCommentResponse, Error, { 
    pathParams: AddCommentPathParams; 
    bodyParams: AddCommentBody;
  }>({
    mutationFn: async ({ pathParams, bodyParams }) => {
      const response = await client.post<AddCommentResponse>(
        `${pathParams.proposalType}/${pathParams.postIndexOrHash}/comments`,
        bodyParams
      );
      return response.data;
    },
    onError: (error, { pathParams }) => {
      queryClient.invalidateQueries({ queryKey: buildActivityFeedQueryKey({ limit: 10 }) });
      queryClient.invalidateQueries({ queryKey: buildProposalByIndexQueryKey({ 
        proposalType: pathParams.proposalType, 
        indexOrHash: pathParams.postIndexOrHash 
      }) });
      throw new Error("Failed to add comment", error);
    },
    onSettled: (_, __, { pathParams }) => {
      queryClient.invalidateQueries({ queryKey: buildActivityFeedQueryKey({ limit: 10 }) });
      queryClient.invalidateQueries({ queryKey: buildProposalByIndexQueryKey({ 
        proposalType: pathParams.proposalType, 
        indexOrHash: pathParams.postIndexOrHash 
      }) });
    },
  });
};

export default useAddComment;
