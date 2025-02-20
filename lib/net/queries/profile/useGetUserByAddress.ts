import { useQuery } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { UserProfile } from "@/lib/types";

const buildUserByAddressQueryKey = (address: string) => ["user", "address", address];

const useGetUserByAddress = (address: string) => {
  return useQuery<UserProfile, Error>({
    queryKey: buildUserByAddressQueryKey(address),
    queryFn: async () => {
      const response = await client.get<UserProfile>(`users/address/${address}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};

export { useGetUserByAddress, buildUserByAddressQueryKey };