import { useMutation, useQuery } from "@tanstack/react-query"
import client from "../../client";
import { EProposalType } from "@/lib/types";

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
const useIsSubscribedProposal = ({ proposalType, postIndexOrHash }: IsSubscribedProposalParams) => {
	const queryKey = buildIsSubscribedProposalKey({ proposalType, postIndexOrHash });

	return useQuery<IsSubscribedProposalResponse, Error>({
		queryKey,
		queryFn: async () => {
			const response = await client.get(
				`${proposalType}/${postIndexOrHash}/subscription`
			)
			return response.data
		}
	})
};

export { useIsSubscribedProposal, buildIsSubscribedProposalKey };
