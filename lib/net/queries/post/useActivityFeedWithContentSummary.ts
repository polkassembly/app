import { useQueries } from "@tanstack/react-query";
import client from "../../client";
import { Feed, Post, ContentSummary } from "@/lib/types";
import { FeedRequest, useActivityFeed } from "./useActivityFeed";
import { buildContentSummaryKey } from "./useContentSummary";

const useActivityFeedWithContentSummary = (params: FeedRequest) => {
  // First, get the activity feed:
  const feedQuery = useActivityFeed(params);

  // Flatten all feed items from all pages
  const feedItems = feedQuery.data?.pages.flatMap((page) => page.items) || [];

  // For each feed item, fire off a content summary query.
  const contentSummaryQueries = useQueries({
    queries: feedItems.map((item) => ({
      queryKey: buildContentSummaryKey({ proposalType: item.proposalType, indexOrHash: item.index }),
      queryFn: async () => {
        const response = await client.get<ContentSummary>(`/${item.proposalType}/${item.index}/content-summary`);
        return response.data;
      },
      enabled: !!item.proposalType && !!item.index,
    })),
  });

  // Determine if any content summary query is still loading:
  const isLoadingContentSummaries = contentSummaryQueries.some((q) => q.isLoading);

  // Build the posts by merging feed items with the corresponding content summary
  const posts: Post[] = feedItems.map((item, index) => {
    const summaryData = contentSummaryQueries[index]?.data as ContentSummary | undefined;
    return {
      ...item,
      markdownSummary: summaryData?.postSummary || "",
    } as Post;
  });

  return {
    ...feedQuery,
    posts,
    isLoadingContentSummaries,
  };
};

export { useActivityFeedWithContentSummary };
