import client from "../client";
import { InfiniteQueryBuilder } from "./builder";
import useGetUserByAddress from "./profile/useGetUserByAddress";

// FIXME: Add other variants to the sum-type
type ProposalType = "ReferendumV2";

// FIXME: Add other variants to the sum-type
type Status = "Deciding";

// This is likely not relevant
// perhaps remove?
type Content = unknown;
export interface Post {
  id: "";
  index: number;
  title: string;
  content: Content;
  htmlContent: string;
  createdAt: string;
  updatedAt: string;
  tags: [];
  proposalType: ProposalType;
  network: string;
  dataSource: string;
  metrics: {
    reactions: {
      like: number;
      dislike: number;
    };
    comments: number;
  };
  onChainInfo: {
    createdAt: string;
    description: string;
    index: string;
    origin: string;
    proposer: string;
    status: Status;
    type: ProposalType;
    hash: string;
    voteMetrics: {
      nay: {
        count: number;
        value: string;
      };
      aye: {
        count: number;
        value: string;
      };
      support: {
        value: string;
      };
      bareAyes: {
        value: string;
      };
    };
    beneficiaries: [
      {
        address: string;
        amount: string;
        assetId: string;
      }
    ];
    decisionPeriodEndsAt: string;
  };
}

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
