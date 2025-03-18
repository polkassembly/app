import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { EProposalType, Feed, Post } from "@/lib/types";
import { buildActivityFeedQueryKey, buildIsSubscribedProposalKey } from "../post";

interface SubscribeProposalParams {
  proposalType: EProposalType;
  postIndexOrHash: string;
}

interface SubscribeProposalResponse {
  subscriptionId: string;
}

interface MutationContext {
  isSubscribedOldData?: unknown;
  activityFeedOldData?: Feed;
}

const useSubscribeProposal = () => {
  const queryClient = useQueryClient();

  return useMutation<
    SubscribeProposalResponse,
    unknown,
    { pathParams: SubscribeProposalParams },
    MutationContext
  >({
    mutationFn: async ({ pathParams }) => {
      // Call your subscribe endpoint
      const response = await client.post(
        `${pathParams.proposalType}/${pathParams.postIndexOrHash}/subscription`
      );
      return response.data;
    },
    onMutate: async ({ pathParams }) => {
      await queryClient.cancelQueries({
        queryKey: buildIsSubscribedProposalKey(pathParams),
      });
			await queryClient.cancelQueries({
				queryKey: buildActivityFeedQueryKey({ limit: 10 }),
			});

      // Store previous query data for rollback if needed
      const isSubscribedOldData = queryClient.getQueryData(
        buildIsSubscribedProposalKey(pathParams)
      );
      const activityFeedOldData: Feed | undefined = queryClient.getQueryData(
        buildActivityFeedQueryKey({ limit: 10 })
      );

      // Create a temporary subscription id
      const temporarySubscriptionId = "temp-" + Date.now();

      // Optimistically update the is-subscribed query with the temporary id
      queryClient.setQueryData(
        buildIsSubscribedProposalKey(pathParams),
        { subscriptionId: temporarySubscriptionId }
      );

      // Optimistically update the activity feed cache by traversing its pages
      queryClient.setQueryData(buildActivityFeedQueryKey({ limit: 10 }), (oldData: any) => {
        if (!oldData) return oldData;
        const newData = {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((post: Post) =>
              post.index === pathParams.postIndexOrHash
                ? { ...post, userSubscriptionId: temporarySubscriptionId }
                : post
            ),
          })),
        };
				return newData;
      });

      return { isSubscribedOldData, activityFeedOldData };
    },
    onError: (error, variables, context) => {
      console.error("Error during subscription:", error);
      // Roll back optimistic updates if the mutation fails
      if (context?.isSubscribedOldData !== undefined) {
        queryClient.setQueryData(
          buildIsSubscribedProposalKey(variables.pathParams),
          context.isSubscribedOldData
        );
      }
      if (context?.activityFeedOldData !== undefined) {
        queryClient.setQueryData(
          buildActivityFeedQueryKey({ limit: 10 }),
          context.activityFeedOldData
        );
      }
    },
    onSuccess: (data, variables) => {
      // Replace the temporary id with the actual subscription id returned from the server
      queryClient.setQueryData(
        buildIsSubscribedProposalKey(variables.pathParams),
        data
      );
      queryClient.setQueryData(buildActivityFeedQueryKey({ limit: 10 }), (oldData: any) => {
        if (!oldData) return oldData;
        return {
          ...oldData,
          pages: oldData.pages.map((page: any) => ({
            ...page,
            items: page.items.map((post: any) =>
              post.id === variables.pathParams.postIndexOrHash
                ? { ...post, userSubscriptionId: data.subscriptionId }
                : post
            ),
          })),
        };
      });
    },
    onSettled: () => {
      // Optionally, you could invalidate the queries to refetch fresh data
    },
  });
};

export default useSubscribeProposal;
