import client from "../../client";
import { InfiniteQueryBuilder } from "../builder";
import { Post } from "@/types";

interface FeedRequest {
  limit: number;
}

interface Feed {
  items: Post[];
  totalCount: string;
}

const useActivityFeed = new InfiniteQueryBuilder<unknown, FeedRequest, unknown, Feed>(client)
  .method("GET")
  .url("activity-feed")
  .getNextPageParam((lastPage, allPages) => {
    const totalCount = Number(lastPage.totalCount);
    const itemsPerPage = 10

    return totalCount > allPages.length * itemsPerPage
      ? allPages.length + 1
      : undefined;
  })
  .build();

export default useActivityFeed;
