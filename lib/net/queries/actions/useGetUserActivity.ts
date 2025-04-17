import { useQuery } from "@tanstack/react-query";
import client from "@/lib/net/client";
import { QueryHookOptions } from "@/lib/types/query";
import { IUserActivity } from "@/lib/types/user";

interface GetUserActivityPathParams {
  userId: string;
}

const buildUserActivityQueryKey = (params: GetUserActivityPathParams) => ["user-activity", params];

const useGetUserActivity = ({ userId }: GetUserActivityPathParams, options?: QueryHookOptions<IUserActivity[]>) => {
  return useQuery<IUserActivity[], Error>({
    queryKey: buildUserActivityQueryKey({ userId }),
    queryFn: () => getUserActivity(userId),
    enabled: !!userId,
    ...options,
  });
};

async function getUserActivity(userId: string) {
  const response = await client.get<IUserActivity[]>(`users/id/${userId}/activities`);
  return response.data;
}

export { getUserActivity, useGetUserActivity, buildUserActivityQueryKey };
