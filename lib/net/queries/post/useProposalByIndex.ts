import { useQuery } from "@tanstack/react-query";
import client from "../../client";
import { Post } from "@/lib/types";
import { QueryHookOptions } from "@/lib/types/query";

export interface PathParams {
  proposalType: string;
  indexOrHash: string;
}

// Key factory function
const buildProposalByIndexQueryKey = ({ proposalType, indexOrHash }: PathParams) => {
  return ["proposal", proposalType, indexOrHash];
};

const useProposalByIndex = (
  { proposalType, indexOrHash }: PathParams,
  options?: QueryHookOptions<Post>
) => {
  const queryKey = buildProposalByIndexQueryKey({ proposalType, indexOrHash });

  return useQuery<Post, Error>({
    queryKey,
    queryFn: async () => {
      const response = await client.get(`/${proposalType}/${indexOrHash}`);
      return response.data as Post;
    },
    enabled: !!indexOrHash && !!proposalType,
    ...options,
  });
};

export { useProposalByIndex, buildProposalByIndexQueryKey };
