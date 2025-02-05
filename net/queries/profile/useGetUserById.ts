import client from "@/net/client";
import { QueryBuilder } from "../builder";
import UserProfile from "./types";

interface GetUserByIdRequest {
	userId: string;
}

const useGetUserById = new QueryBuilder<GetUserByIdRequest, unknown, unknown, UserProfile>(client)
	.method("GET")
	.url(`users/id/{userId}`)
export default useGetUserById;