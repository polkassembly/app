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
    queryFn: async () => {
      const response = await client.get<UserActivity[]>(`users/id/${params.userId}/activities`);
      return response.data;
    },
		refetchOnWindowFocus: true,
  });
};

export { useGetUserActivity, buildUserActivityQueryKey };
