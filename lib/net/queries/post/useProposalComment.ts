import { useQuery } from "@tanstack/react-query";
import client from "../../client";
import { ICommentResponse } from "@/lib/types";
import { QueryHookOptions } from "@/lib/types/query";

export interface ProposalCommentsParams {
  proposalType: string;
  proposalId: string;
}

// Key factory function for proposal comments query
const buildProposalCommentsQueryKey = ({ proposalType, proposalId }: ProposalCommentsParams) => {
  return ["proposalComments", proposalType.toString(), proposalId.toString()];
};

const useProposalComments = (
  { proposalType, proposalId }: ProposalCommentsParams,
  options?: QueryHookOptions<ICommentResponse[]>
) => {
  const queryKey = buildProposalCommentsQueryKey({ proposalType, proposalId });

  return useQuery<ICommentResponse[], Error>({
    queryKey,
    queryFn: () => getProposalComments({proposalType, proposalId}),
    enabled: !!proposalId && !!proposalType,
    ...options,
  });
};

async function getProposalComments({ proposalType, proposalId }: ProposalCommentsParams) {
  const response = await client.get(`/${proposalType}/${proposalId}/comments`);
  return response.data as ICommentResponse[];
}

export { useProposalComments, buildProposalCommentsQueryKey, getProposalComments };
