// useProposalComments.ts
import { useQuery } from "@tanstack/react-query";
import client from "../../client";
import { ICommentResponse } from "@/lib/types";

export interface ProposalCommentsParams {
  proposalType: string;
  proposalId: string;
}

// Key factory function for proposal comments query
const buildProposalCommentsQueryKey = ({ proposalType, proposalId }: ProposalCommentsParams) => {
  return ["proposalComments", proposalType, proposalId];
};

const useProposalComments = ({ proposalType, proposalId }: ProposalCommentsParams) => {
  const queryKey = buildProposalCommentsQueryKey({ proposalType, proposalId });

  return useQuery<ICommentResponse[], Error>({
    queryKey,
    queryFn: async () => {
      const response = await client.get(`/${proposalType}/${proposalId}/comments`);
      return response.data;
    },
  });
};

export { useProposalComments, buildProposalCommentsQueryKey };
