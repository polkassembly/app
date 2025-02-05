import client from "@/net/client";
import { QueryBuilder } from "../builder";
import UserProfile from "./types";

interface GetUserByAddressRequest {
	address: string;
}

const useGetUserByAddress = new QueryBuilder<GetUserByAddressRequest, unknown, unknown, UserProfile>(client)
	.method("GET")
	.url(`users/address/{address}`)
	.build();


export default useGetUserByAddress;