import { useQuery } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { UserProfile } from "@/lib/types";

const buildUserByIdQueryKey = (userId: string) => ["user", "id", userId];

const useGetUserById = (userId: string) => {
  return useQuery<UserProfile, Error>({
    queryKey: buildUserByIdQueryKey(userId),
    queryFn: async () => {
      const response = await client.get<UserProfile>(`users/id/${userId}`);
      return response.data;
    },
    refetchOnWindowFocus: false,
  });
};

export { useGetUserById, buildUserByIdQueryKey };