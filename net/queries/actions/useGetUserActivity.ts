import client from "@/net/client";
import { QueryBuilder } from "../builder";
import { UserActivity } from "./type";

interface GetUserActivityPathParams {
	userId: string;
}

const useGetUserActivity =  new QueryBuilder< GetUserActivityPathParams, unknown, unknown, UserActivity[]>(client)
	.method("GET")
	.url(`users/id/{userId}/activities`)
	.build();

export default useGetUserActivity;