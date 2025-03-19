import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { EProposalType, Post, Feed, EReaction } from "@/lib/types";
import { buildActivityFeedQueryKey, ACTIVITY_FEED_LIMIT } from "../post/useActivityFeed";
import { buildProposalByIndexQueryKey } from "../post/useProposalByIndex";
import { useProfileStore } from "@/lib/store/profileStore";

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
  const user = useProfileStore((state) => state.profile);

  return useMutation<
    DeleteReactionResponse,
    Error,
    { pathParams: DeleteReactionPathParams },
    { proposalOldData: Post; activityOldData: unknown }
  >({
    mutationFn: async ({ pathParams }) => {
      const response = await client.delete<DeleteReactionResponse>(
        `${pathParams.proposalType}/${pathParams.postIndexOrHash}/reactions/${pathParams.reactionId}`
      );
      return response.data;
    },
    onMutate: async ({ pathParams }) => {
      if (!user) return;

      // Cancel any outgoing refetches for the proposal and activity feed.
      await queryClient.cancelQueries({
        queryKey: buildProposalByIndexQueryKey({
          proposalType: pathParams.proposalType,
          indexOrHash: pathParams.postIndexOrHash,
        }),
      });
      await queryClient.cancelQueries({
        queryKey: buildActivityFeedQueryKey({ limit: ACTIVITY_FEED_LIMIT }),
      });

      // Snapshot the previous values for rollback.
      const proposalOldData = queryClient.getQueryData<Post>(
        buildProposalByIndexQueryKey({
          proposalType: pathParams.proposalType,
          indexOrHash: pathParams.postIndexOrHash,
        })
      );
      const activityOldData = queryClient.getQueryData<Feed>(
        buildActivityFeedQueryKey({ limit: ACTIVITY_FEED_LIMIT })
      );

      // Helper to calculate count changes when deleting a reaction.
      const updateCountsForDelete = (oldPost: Post) => {
        const reactionToDelete = oldPost.reactions?.find(
          (r) => r.id === pathParams.reactionId
        );
        let likeDelta = 0;
        let dislikeDelta = 0;
        if (reactionToDelete) {
          if (reactionToDelete.reaction === EReaction.like) {
            likeDelta = -1;
          } else if (reactionToDelete.reaction === EReaction.dislike) {
            dislikeDelta = -1;
          }
        }
        return { likeDelta, dislikeDelta };
      };

      // Optimistically update the proposal detail.
      queryClient.setQueryData(
        buildProposalByIndexQueryKey({
          proposalType: pathParams.proposalType,
          indexOrHash: pathParams.postIndexOrHash,
        }),
        (oldProposal: Post | undefined): Post | undefined => {
          if (!oldProposal) return oldProposal;
          const { likeDelta, dislikeDelta } = updateCountsForDelete(oldProposal);
          return {
            ...oldProposal,
            reactions: oldProposal.reactions?.filter(
              (r) => r.id !== pathParams.reactionId
            ),
            metrics: {
              ...oldProposal.metrics,
              reactions: {
                like: oldProposal.metrics.reactions.like + likeDelta,
                dislike: oldProposal.metrics.reactions.dislike + dislikeDelta,
              },
            },
          };
        }
      );

      // Optimistically update the activity feed.
      queryClient.setQueryData(
        buildActivityFeedQueryKey({ limit: ACTIVITY_FEED_LIMIT }),
        (oldActivity: { pageParams: number[]; pages: { items: Post[]; totalCount: number }[] } | undefined) => {
          if (!oldActivity) return oldActivity;
          return {
            ...oldActivity,
            pages: oldActivity.pages.map((page) => ({
              ...page,
              items: page.items.map((post: Post): Post => {
                if (post.index === pathParams.postIndexOrHash) {
                  const { likeDelta, dislikeDelta } = updateCountsForDelete(post);
                  return {
                    ...post,
                    reactions: post.reactions?.filter(
                      (r) => r.id !== pathParams.reactionId
                    ),
                    metrics: {
                      ...post.metrics,
                      reactions: {
                        like: post.metrics.reactions.like + likeDelta,
                        dislike: post.metrics.reactions.dislike + dislikeDelta,
                      },
                    },
                  };
                }
                return post;
              }),
            })),
          };
        }
      );

      // Return context to enable rollback in case of error.
      return { proposalOldData: proposalOldData || ({} as Post), activityOldData };
    },
    onError: (error, { pathParams }, context) => {
      // Rollback the optimistic update if the mutation fails.
      if (context?.proposalOldData) {
        queryClient.setQueryData(
          buildProposalByIndexQueryKey({
            proposalType: context.proposalOldData.proposalType,
            indexOrHash: context.proposalOldData.index,
          }),
          context.proposalOldData
        );
      }
      if (context?.activityOldData) {
        queryClient.setQueryData(
          buildActivityFeedQueryKey({ limit: ACTIVITY_FEED_LIMIT }),
          context.activityOldData
        );
      }
      // Rethrow the error to let calling components handle it.
      throw error;
    },
    onSettled: (_, __, { pathParams }) => {
      // Invalidate the proposal query to refetch the fresh data.
      queryClient.invalidateQueries({
        queryKey: buildProposalByIndexQueryKey({
          proposalType: pathParams.proposalType,
          indexOrHash: pathParams.postIndexOrHash,
        }),
      });
    },
  });
};

export default useDeleteReaction;
