import { useQuery } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { UserActivity } from "./type";

interface GetUserActivityPathParams {
  userId: string;
}

const buildUserActivityQueryKey = (params: GetUserActivityPathParams) => ["user-activity", params];

const useGetUserActivity = (params: GetUserActivityPathParams) => {
  return useQuery<UserActivity[], Error>({
    queryKey: buildUserActivityQueryKey(params),
    queryFn: () => getUserActivity(params.userId),
    enabled: !!params.userId,
		refetchOnWindowFocus: true,
  });
};

async function getUserActivity(userId: string) {
  const response = await client.get<UserActivity[]>(`users/id/${userId}/activities`);
  return response.data;
}

export { getUserActivity, useGetUserActivity, buildUserActivityQueryKey };
