import client from "@/lib/net/client";
import { QueryBuilder } from "../builder";
import { UserProfile } from "@/lib/types";

interface GetUserByIdRequest {
	userId: string;
}

const useGetUserById = new QueryBuilder<GetUserByIdRequest, unknown, unknown, UserProfile>(client)
	.method("GET")
	.url(`users/id/{userId}`)
	.build();
export default useGetUserById;