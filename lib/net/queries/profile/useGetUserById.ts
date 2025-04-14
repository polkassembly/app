import { useQuery } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { UserProfile } from "@/lib/types";
import { QueryHookOptions } from "@/lib/types/query";

const buildUserByIdQueryKey = (userId: string) => ["user", "id", userId];

const useGetUserById = (userId: string, options?: QueryHookOptions<UserProfile>) => {
  return useQuery<UserProfile, Error>({
    queryKey: buildUserByIdQueryKey(userId),
    queryFn: () => getUserById(userId),
    refetchOnWindowFocus: false,
    enabled: !!userId,
    ...options
  });
};

async function getUserById(userId: string) {
  console.log("Fetching user by ID:", userId);
  const response = await client.get<UserProfile>(`users/id/${userId}`);
  return response.data;
}

export { getUserById, useGetUserById, buildUserByIdQueryKey };