import { useMutation, useQuery } from "@tanstack/react-query"
import client from "../../client";
import { EProposalType } from "@/lib/types";
import { useProfileStore } from "@/lib/store/profileStore";
import { QueryHookOptions } from "@/lib/types/query";

interface IsSubscribedProposalParams {
	proposalType: EProposalType;
	postIndexOrHash: string;
}

interface IsSubscribedProposalResponse {
	subscriptionId: string;
}

// Key factory function
const buildIsSubscribedProposalKey = ({ proposalType, postIndexOrHash }: IsSubscribedProposalParams) => {
	return ["is-subscribed-proposal", proposalType, postIndexOrHash];
};

// Returns subscription ID if found, 404 error if not subscribed
const useIsSubscribedProposal = (
	{ proposalType, postIndexOrHash }: IsSubscribedProposalParams,
	options?: QueryHookOptions<IsSubscribedProposalResponse>
) => {
	const queryKey = buildIsSubscribedProposalKey({ proposalType, postIndexOrHash });
	const user = useProfileStore((state) => state.profile);

	return useQuery<IsSubscribedProposalResponse, Error>({
		queryKey,
		queryFn: async () => {
			try {
				const response = await client.get(
					`${proposalType}/${postIndexOrHash}/subscription`
				)
				return response.data;
			} catch (error) {
				console.error(error);
			}
		},
		enabled: !!user,
		...options,
	})
};

export { useIsSubscribedProposal, buildIsSubscribedProposalKey };
