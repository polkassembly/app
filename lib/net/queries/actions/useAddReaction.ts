import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { EProposalType, EReaction, Feed, Post } from "@/lib/types";
import { ACTIVITY_FEED_LIMIT, buildActivityFeedQueryKey } from "../post/useActivityFeed";
import { buildProposalByIndexQueryKey } from "../post/useProposalByIndex";
import { useProfileStore } from "@/lib/store/profileStore";

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
  const user = useProfileStore((state) => state.profile);

  return useMutation<
    AddReactionResponse,
    Error,
    { pathParams: AddReactionPathParams; bodyParams: AddReactionBody },
    { proposalOldData: Post; activityOldData: unknown }
  >({
    mutationFn: async ({ pathParams, bodyParams }) => {
      const response = await client.post<AddReactionResponse>(
        `${pathParams.proposalType}/${pathParams.postIndexOrHash}/reactions`,
        bodyParams
      );
      return response.data;
    },
    onMutate: async ({ pathParams, bodyParams }) => {
      if (!user) return;

      // Cancel any outgoing refetches for the proposal and activity feed
      await queryClient.cancelQueries({
        queryKey: buildProposalByIndexQueryKey({
          proposalType: pathParams.proposalType,
          indexOrHash: pathParams.postIndexOrHash,
        }),
      });
      await queryClient.cancelQueries({
        queryKey: buildActivityFeedQueryKey({ limit: ACTIVITY_FEED_LIMIT }),
      });

      // Snapshot the previous value for rollback
      const proposalOldData = queryClient.getQueryData<Post>(
        buildProposalByIndexQueryKey({
          proposalType: pathParams.proposalType,
          indexOrHash: pathParams.postIndexOrHash,
        })
      );
      const activityOldData = queryClient.getQueryData(
        buildActivityFeedQueryKey({ limit: ACTIVITY_FEED_LIMIT })
      );

      // Helper to calculate the like/dislike count changes.
      const updateCounts = (oldPost: Post) => {
        const existingReaction = oldPost.reactions?.find(
          (r) => r.userId === user.id
        );
        let likeDelta = 0;
        let dislikeDelta = 0;
        if (existingReaction) {
          // If changing reaction type, adjust counts accordingly.
          if (existingReaction.reaction === EReaction.like && bodyParams.reaction === EReaction.dislike) {
            likeDelta = -1;
            dislikeDelta = 1;
          } else if (existingReaction.reaction === EReaction.dislike && bodyParams.reaction === EReaction.like) {
            likeDelta = 1;
            dislikeDelta = -1;
          }
        } else {
          // New reaction added.
          if (bodyParams.reaction === EReaction.like) {
            likeDelta = 1;
          } else if (bodyParams.reaction === EReaction.dislike) {
            dislikeDelta = 1;
          }
        }
        return { likeDelta, dislikeDelta };
      };

      // Optimistically update the proposal detail
      queryClient.setQueryData(
        buildProposalByIndexQueryKey({
          proposalType: pathParams.proposalType,
          indexOrHash: pathParams.postIndexOrHash,
        }),
        (oldProposal: Post | undefined): Post | undefined => {
          if (!oldProposal) return oldProposal;
          const { likeDelta, dislikeDelta } = updateCounts(oldProposal);
          const existingReaction = oldProposal.reactions?.find(
            (r) => r.userId === user.id
          );
          const updatedReactions = existingReaction
            ? oldProposal.reactions!.map((r) =>
              r.userId === user.id ? { ...r, reaction: bodyParams.reaction } : r
            )
            : [...(oldProposal.reactions || []), { id: "temp-id", userId: user.id, reaction: bodyParams.reaction }];
          return {
            ...oldProposal,
            reactions: updatedReactions as Post["reactions"],
            metrics: {
              ...oldProposal.metrics,
              reactions: {
                like: oldProposal.metrics.reactions.like + likeDelta,
                dislike: oldProposal.metrics.reactions.dislike + dislikeDelta
              },
            }
          };
        }
      );

      // Optimistically update the activity feed in a similar manner
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
                  const { likeDelta, dislikeDelta } = updateCounts(post)

                  const existingReaction = post.reactions?.find((r) => r.userId === user.id);
                  const updatedReactions = existingReaction
                    ? post.reactions!.map((r) =>
                      r.userId === user.id ? { ...r, reaction: bodyParams.reaction } : r
                    )
                    : [...(post.reactions || []), { id: "temp-id", userId: user.id, reaction: bodyParams.reaction }];
                  return {
                    ...post,
                    reactions: updatedReactions as Post["reactions"],
                    metrics: {
                      ...post.metrics,
                      reactions: {
                        like: post.metrics.reactions.like + likeDelta,
                        dislike: post.metrics.reactions.dislike + dislikeDelta
                      },
                    }
                  };
                }
                return post;
              }),
            })),
          };
        }
      );
      const newData = await queryClient.getQueryData(buildActivityFeedQueryKey({ limit: ACTIVITY_FEED_LIMIT }));
      return { proposalOldData: proposalOldData || ({} as Post), activityOldData };
    },
    onError: (_, __, context) => {
      // Rollback if mutation fails
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
    },
    onSettled: (res, __, { pathParams }) => {
      // Invalidate proposal query to fetch fresh data
      queryClient.invalidateQueries({
        queryKey: buildProposalByIndexQueryKey({
          proposalType: pathParams.proposalType,
          indexOrHash: pathParams.postIndexOrHash,
        }),
      });

      if (!user) return;

      // Update the temporary reaction ID in the activity feed to the one returned from the server
      queryClient.setQueryData(
        buildActivityFeedQueryKey({ limit: ACTIVITY_FEED_LIMIT }),
        (oldActivity: { pageParams: number[]; pages: { items: Post[]; totalCount: number }[] } | undefined) => {
          if (!oldActivity) return oldActivity;
          return {
            ...oldActivity,
            pages: oldActivity.pages.map((page) => ({
              ...page,
              items: page.items.map((post) =>
                post.index === pathParams.postIndexOrHash
                  ? {
                    ...post,
                    reactions: post.reactions?.map((r) =>
                      r.userId === user.id ? { ...r, id: res?.reactionId } : r
                    ),
                  }
                  : post
              ),
            })),
          };
        }
      );
    },
  });
};

export { useAddReaction, AddReactionResponse };