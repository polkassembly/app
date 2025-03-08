import { useInfiniteQuery } from "@tanstack/react-query";
import client from "../../client";
import { Feed, Post } from "@/lib/types";

interface FeedRequest {
  limit: number;
}

const buildActivityFeedQueryKey = (params: FeedRequest) => ["activity-feed", params];

const useActivityFeed = (params: FeedRequest) => {
  return useInfiniteQuery<Feed, Error>({
    queryKey: buildActivityFeedQueryKey(params),
    queryFn: ({ pageParam }) => activityFeedFunction({ params, pageParam: Number(pageParam) }),
    initialPageParam: 1,
    getNextPageParam: (lastPage, allPages) => {
      const totalCount = Number(lastPage.totalCount);
      const itemsPerPage = params.limit || 10;

      return totalCount > allPages.length * itemsPerPage
        ? allPages.length + 1
        : undefined;
    },
  });
};

const activityFeedFunction = async ({ params, pageParam }: { params: FeedRequest, pageParam: number }) => {
  console.log("activityFeedFunction", { params, pageParam });
  const response = await client.get<Feed>("activity-feed", {
    params: { ...params, page: pageParam },
  });
  return response.data as Feed;
}

export { activityFeedFunction, useActivityFeed, buildActivityFeedQueryKey, FeedRequest };
