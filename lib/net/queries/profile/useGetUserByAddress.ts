import { useQuery } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { UserProfile } from "@/lib/types";
import { QueryHookOptions } from "@/lib/types/query";

const buildUserByAddressQueryKey = (address: string) => ["user", "address", address];

const useGetUserByAddress = (address: string, options?: QueryHookOptions<UserProfile>) => {
  return useQuery<UserProfile, Error>({
    queryKey: buildUserByAddressQueryKey(address),
    queryFn: async () => {
      const response = await client.get<UserProfile>(`users/address/${address}`);
      return response.data;
    },
    enabled: !!address,
    refetchOnWindowFocus: false,
    ...options
  });
};

export { useGetUserByAddress, buildUserByAddressQueryKey };