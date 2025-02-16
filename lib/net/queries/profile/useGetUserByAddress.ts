import client from "@/lib/net/client";
import { QueryBuilder } from "../builder";
import { UserProfile } from "@/lib/types";

interface GetUserByAddressRequest {
	address: string;
}

const useGetUserByAddress = new QueryBuilder<GetUserByAddressRequest, unknown, unknown, UserProfile>(client)
	.method("GET")
	.url(`users/address/{address}`)
	.build();


export default useGetUserByAddress;