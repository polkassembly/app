import React from "react";
import { IconPoints } from "../icons/icon-points";
import { StyleSheet, Image, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { UserActivity } from "@/lib/net/queries/actions/type";
import useGetUserActivity from "@/lib/net/queries/actions/useGetUserActivity";
import { Skeleton } from "moti/skeleton";
import { Link } from "expo-router";
import { toTitleCase } from "@/lib/util/stringUtil";


const Activity = ({ userId }: { userId: string }) => {
  const { data, isLoading } = useGetUserActivity({ pathParams: { userId } }, { refetchOnWindowFocus: true });

  if (isLoading) return <ActivitySkeleton />;
  if (!data || data.length === 0) return <NoActivity />;

  return (
    <View style={styles.mainContainer}>
      <ThemedText type="bodySmall">RECENT ACTIVITY</ThemedText>
      {data.slice(0, 10).map((item) => (
        <ActivityItem key={item.id} item={item} />
      ))}
    </View>
  );
};

const ActivityItem = ({ item }: { item: UserActivity }) => (
  <ThemedView type="container" style={styles.activityItemContainer}>
    <IconPoints color="white" iconWidth={24} iconHeight={24} />
    <ThemedText type="bodyMedium2">{toTitleCase(item.name.replaceAll("_", " "))}</ThemedText>
  </ThemedView>
);

const NoActivity = () => (
  <ThemedView style={styles.noActivityContainer}>
    <Image
      style={styles.emptyImage}
      resizeMode="contain"
      source={require("@/assets/images/profile/empty-activity.png")}
    />
    <ThemedView style={styles.noActivityTextContainer}>
      <ThemedText>No Activity Yet.</ThemedText>
      <Link href="/(tabs)">
        <ThemedText colorName="accent">Vote Now!</ThemedText>
      </Link>
    </ThemedView>
  </ThemedView>
);

const ActivitySkeleton = () => (
  <View style={styles.mainContainer}>
    {Array(4)
      .fill(null)
      .map((_, index) => (
        <SkeletonItem key={index} />
      ))}
  </View>
);

const SkeletonItem = () => (
  <ThemedView type="container" style={styles.activityItemContainer}>
    <Skeleton height={24} width={24} radius={12} />
    <Skeleton height={24} width={100} />
  </ThemedView>
);

const styles = StyleSheet.create({
  mainContainer: {
    flexDirection: "column",
    gap: 16,
  },
  activityItemContainer: {
    flexDirection: "row",
    gap: 8,
    padding: 12,
    alignItems: "center",
    borderRadius: 34,
  },
  noActivityContainer: {
    alignItems: "center",
  },
  emptyImage: {
    width: 170,
    height: 170,
  },
  noActivityTextContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 5,
  },
});

export { Activity, ActivitySkeleton };
