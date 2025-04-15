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
    queryFn: () => getProposalByIndex({ proposalType, indexOrHash }),
    enabled: !!indexOrHash && !!proposalType,
    ...options,
  });
};

const getProposalByIndex = async ({ proposalType, indexOrHash }: PathParams) => {
  const response = await client.get<Post>(`${proposalType}/${indexOrHash}`);
  return response.data;
}

export { getProposalByIndex, useProposalByIndex, buildProposalByIndexQueryKey };
