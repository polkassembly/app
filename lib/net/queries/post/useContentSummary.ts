import { useQuery } from "@tanstack/react-query";
import client from "../../client";
import { ContentSummary } from "@/lib/types";
import { QueryHookOptions } from "@/lib/types/query";

export interface useContentSummaryParams {
  proposalType: string;
  indexOrHash: string;
}

// Key factory function
const buildContentSummaryKey = ({ proposalType, indexOrHash }: useContentSummaryParams) => {
  return ["proposal", proposalType, indexOrHash];
};

const useContentSummary = ({ proposalType, indexOrHash }: useContentSummaryParams, options?: QueryHookOptions<ContentSummary>) => {
  const queryKey = buildContentSummaryKey({ proposalType, indexOrHash });

  return useQuery<ContentSummary, Error>({
    queryKey,
    queryFn: async () => {
      const response = await client.get(`/${proposalType}/${indexOrHash}/content-summary`);
      return response.data;
    },
    ...options,
  });
};

export { useContentSummary, buildContentSummaryKey };
