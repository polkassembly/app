import React, { useEffect, useState } from "react";
import { StyleSheet, View, } from "react-native";
import { ThemedText } from "../../shared/text/ThemedText";
import { useGetUserActivity } from "@/lib/net/queries/actions/useGetUserActivity";
import ActivityItem from "./ActivityItem";
import NoActivity from "./NoActivity";
import { IUserActivity } from "@/lib/types/user";
import ActivityItemSkeleton from "./ActivityItemSkeleton";

const Activity = ({
  userId,
  refreshKey = 0
}: {
  userId: string,
  refreshKey?: number
}) => {

  const [activities, setActivities] = useState<IUserActivity[]>([]);
  const { data, isLoading, refetch } = useGetUserActivity({ userId });

  // On every load, when data is fetched, update activities
  useEffect(() => {
    if (data) {
      setActivities(data.slice(0, 10));
    }
  }, [data]);

  useEffect(() => {
    refetch();
  }, [userId, refetch]);

  // Refetch activities when refreshKey changes
  useEffect(() => {
    if (refreshKey > 0) {
      refetch();
    }
  }, [refreshKey, refetch]);

  if (!isLoading && (!activities || activities.length === 0)) return <NoActivity />;

  return (
    <View style={styles.mainContainer}>
      <ThemedText type="bodySmall">RECENT ACTIVITY</ThemedText>
      {activities.length === 0 && isLoading ? (

        Array(4)
          .fill(null)
          .map((_, index) => (
            <ActivityItemSkeleton key={index} />
          ))
      ) : (
        activities.map((item) => (
          <ActivityItem key={item.id} item={item} />
        ))
      )
      }
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    gap: 16,
  },
});

export default Activity;
