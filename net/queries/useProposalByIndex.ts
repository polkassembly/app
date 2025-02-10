import client from "../client";
import { QueryBuilder } from "./builder";
import { Post } from "./useActivityFeed";

interface PathParams {
    // FIXME: Enumerate the possible values for a better API
    proposalType: string;

    indexOrHash: string;
}

const useProposalByIndex = new QueryBuilder<PathParams, undefined, undefined, Post>(client)
    .method("GET")
    .url("{proposalType}/{indexOrHash}")
    .build();

export default useProposalByIndex;