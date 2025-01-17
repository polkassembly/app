import client from "../client";
import { QueryBuilder } from "./builder";

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

interface Feed {
  posts: Post[];
  totalCount: string;
}

const useActivityFeed = new QueryBuilder<undefined, Feed>(client)
  .method("GET")
  .url("activityFeed")
  .build();

export default useActivityFeed;
