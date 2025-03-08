import { useMutation, useQueryClient } from "@tanstack/react-query";
import { EProposalType, ICommentResponse } from "@/lib/types";
import { buildActivityFeedQueryKey } from "../post/useActivityFeed";
import { buildProposalByIndexQueryKey } from "../post/useProposalByIndex";
import { buildProposalCommentsQueryKey } from "../post";
import { ENetwork } from "@/lib/types/post";
import { EDataSource } from "@/lib/types/comment";
import { useProfileStore } from "@/lib/store/profileStore";
import client from "../../client";

interface AddCommentPathParams {
  proposalType: EProposalType;
  postIndexOrHash: string;
}

export interface AddCommentBody {
  content: string;
  parentCommentId?: string;
  address?: string;
}

interface AddCommentResponse {
  message: string;
  commentId: string;
}

// A helper to convert text to HTML
const convertTextToHtml = (text: string): string => {
  return `<p>${text.replace(/\n/g, "<br />")}</p>`;
};

const useAddComment = () => {
  const queryClient = useQueryClient();
  // Retrieve user info from the profile store at the top level of the hook.
  const userInfo = useProfileStore((state) => state.profile);

  return useMutation<
    AddCommentResponse,
    Error,
    {
      pathParams: AddCommentPathParams;
      bodyParams: AddCommentBody;
    },
    {
      previousCommentsData?: ICommentResponse[];
      commentsQueryKey: any;
    }
  >({
    mutationFn: async ({ pathParams, bodyParams }) => {
      const response = await client.post<AddCommentResponse>(
        `${pathParams.proposalType}/${pathParams.postIndexOrHash}/comments`,
        bodyParams
      );
      return response.data;
      return {
        message: "Comment added successfully",
        commentId: "12345",
      };
    },
    onMutate: async ({ pathParams, bodyParams }) => {
      if (!userInfo) {
        throw new Error("User information is missing");
      }

      // Create the query key for the proposal comments.
      const commentsQueryKey = buildProposalCommentsQueryKey({
        proposalType: pathParams.proposalType.toString(),
        proposalId: pathParams.postIndexOrHash.toString(),
      });

      // Cancel outgoing refetches to avoid race conditions.
      await queryClient.cancelQueries({ queryKey: commentsQueryKey });

      // Snapshot the previous comments (which we assume is an array)
      const previousComments = queryClient.getQueryData<ICommentResponse[]>(commentsQueryKey);

      // Create an optimistic comment.
      const optimisticComment: ICommentResponse = {
        id: `temp-${Date.now()}`,
        createdAt: new Date(),
        updatedAt: new Date(),
        userId: userInfo.id,
        content: bodyParams.content,
        htmlContent: convertTextToHtml(bodyParams.content),
        markdownContent: bodyParams.content,
        network: ENetwork.POLKADOT,
        proposalType: pathParams.proposalType,
        indexOrHash: pathParams.postIndexOrHash,
        parentCommentId: bodyParams.parentCommentId || null,
        isDeleted: false,
        address: bodyParams.address || null,
        dataSource: EDataSource.POLKASSEMBLY,
        user: { ...userInfo },
      };

      // Optimistically update the comments in the cache.
      queryClient.setQueryData<ICommentResponse[]>(commentsQueryKey, (oldComments) => {
        // Default to an empty array if oldComments is undefined.
        if (!bodyParams.parentCommentId || !oldComments) {
          oldComments = oldComments ? [...oldComments, optimisticComment] : [optimisticComment];
          return oldComments
        }

        // If the comment is a reply, find the parent comment and add the reply.
        return oldComments.map((comment) => {
          if (comment.id === bodyParams.parentCommentId) {
            return {
              ...comment,
              children: comment.children ? [...comment.children, optimisticComment] : [optimisticComment],
            };
          }
          return comment;
        });
      });

      // Return context so we can roll back on error.
      return { previousCommentsData: previousComments, commentsQueryKey };
    },
    onError: (error, variables, context) => {
      // Roll back to the previous comments on error.
      if (context?.previousCommentsData) {
        queryClient.setQueryData(context.commentsQueryKey, context.previousCommentsData);
      }
      console.error("Failed to add comment", error);
      throw new Error("Failed to add comment");
    },
    onSettled: (_, __, { pathParams }) => {
      // Invalidate queries to fetch fresh data from the backend.
      queryClient.invalidateQueries({ queryKey: buildActivityFeedQueryKey({ limit: 10 }) });
      queryClient.invalidateQueries({
        queryKey: buildProposalByIndexQueryKey({
          proposalType: pathParams.proposalType,
          indexOrHash: pathParams.postIndexOrHash,
        }),
      });
      queryClient.invalidateQueries({
        queryKey: buildProposalCommentsQueryKey({
          proposalType: pathParams.proposalType,
          proposalId: pathParams.postIndexOrHash,
        }),
      });
    },
  });
};

export default useAddComment;
