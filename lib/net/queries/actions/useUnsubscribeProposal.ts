import { useMutation, useQueryClient } from "@tanstack/react-query";
import client from "../../client";
import { EProposalType, Feed, Post } from "@/lib/types";
import { buildIsSubscribedProposalKey } from "../post/useIsSubscribedProposal";
import { buildActivityFeedQueryKey } from "../post";

interface UnsubscribeProposalParams {
	proposalType: EProposalType;
	postIndexOrHash: string;
}

interface MutationContext {
	isSubscribedOldData?: unknown;
	activityFeedOldData?: unknown;
}

const useUnsubscribeProposal = () => {
	const queryClient = useQueryClient();

	return useMutation<
		void,
		unknown,
		{ pathParams: UnsubscribeProposalParams },
		MutationContext
	>({
		mutationFn: async ({ pathParams }) => {
			const response = await client.delete(
				`${pathParams.proposalType}/${pathParams.postIndexOrHash}/subscription`
			);
			return response.data;
		},
		onMutate: async ({ pathParams }) => {
			await queryClient.cancelQueries({ queryKey: buildIsSubscribedProposalKey(pathParams) });
		
			// Store old data before updating the cache
			const isSubscribedOldData = queryClient.getQueryData(buildIsSubscribedProposalKey(pathParams));
			const activityFeedOldData = queryClient.getQueryData(buildActivityFeedQueryKey({ limit: 10 }));
		
			// Optimistically update cache for isSubscribed
			queryClient.setQueryData(buildIsSubscribedProposalKey(pathParams), null);
		
			// Optimistically update the infinite query cache for activity feed
			queryClient.setQueryData(buildActivityFeedQueryKey({ limit: 10 }), (oldData: any) => {
				if (!oldData) return oldData;
				const newData = {
					...oldData,
					pages: oldData.pages.map((page: any) => ({
						...page,
						items: page.items.map((post: Post) =>
							post.index === pathParams.postIndexOrHash
								? { ...post, userSubscriptionId: undefined }
								: post
						)
					}))
				}
				return newData;
			});
		
			return { isSubscribedOldData, activityFeedOldData };
		},		
		onError: (error, variables, context) => {
			console.error("Error", error);

			// Restore previous state if mutation fails
			if (context?.isSubscribedOldData !== undefined) {
				queryClient.setQueryData(buildIsSubscribedProposalKey(variables.pathParams), context.isSubscribedOldData);
			}

			if (context?.activityFeedOldData !== undefined) {
				queryClient.setQueryData(buildActivityFeedQueryKey({ limit: 10 }), context.activityFeedOldData);
			}
		},
		onSettled: () => {
			// Skip invalidating as cache is already updated
		}
	});
};


export default useUnsubscribeProposal;
