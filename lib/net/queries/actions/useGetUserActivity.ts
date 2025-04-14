import { useQuery } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { UserActivity } from "./type";
import { QueryHookOptions } from "@/lib/types/query";

interface GetUserActivityPathParams {
  userId: string;
}

const buildUserActivityQueryKey = (params: GetUserActivityPathParams) => ["user-activity", params];

const useGetUserActivity = ({ userId }: GetUserActivityPathParams, options?: QueryHookOptions<UserActivity[]>) => {
  return useQuery<UserActivity[], Error>({
    queryKey: buildUserActivityQueryKey({ userId }),
    queryFn: () => getUserActivity(userId),
    enabled: !!userId,
    ...options,
  });
};

async function getUserActivity(userId: string) {
  const response = await client.get<UserActivity[]>(`users/id/${userId}/activities`);
  return response.data;
}

export { getUserActivity, useGetUserActivity, buildUserActivityQueryKey };
