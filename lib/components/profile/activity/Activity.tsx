import React, { useEffect } from "react";
import { StyleSheet, View, } from "react-native";
import { ThemedText } from "../../shared/text/ThemedText";
import { useGetUserActivity } from "@/lib/net/queries/actions/useGetUserActivity";
import { useActivityStore } from "@/lib/store/activityStore";
import ActivityItem from "./ActivityItem";
import ActivitySkeleton from "./ActivitySkeleton";
import NoActivity from "./NoActivity";

const Activity = ({ userId }: { userId: string }) => {

  const { activities, setActivities } = useActivityStore();
  const { data, isLoading } = useGetUserActivity({ userId });

  // On every load, when data is fetched, update the store
  useEffect(() => {
    if (data) {
      setActivities(data.slice(0, 10));
    }
  }, [data]);

  if (!activities && isLoading) return <ActivitySkeleton />;
  if (!activities || activities.length === 0) return <NoActivity />;

  return (
    <View style={styles.mainContainer}>
      <ThemedText type="bodySmall">RECENT ACTIVITY</ThemedText>
      {activities.map((item) => (
        <ActivityItem key={item.id} item={item} />
      ))}
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
