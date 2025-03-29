import { RefreshControl, ScrollView, StyleSheet } from "react-native";
import { useState } from "react";
import { useGetUserById } from "@/lib/net/queries/profile";
import { useAuthStore } from "@/lib/store/authStore";
import { useProfileStore } from "@/lib/store/profileStore";
import getIdFromToken from "@/lib/util/jwt";
import { useEffect } from "react";
import { ThemedView } from "../ThemedView";
import { EmptyViewWithTabBarHeight } from "../util";
import { Actions } from "./Actions";
import { Activity, ActivitySkeleton } from "./activity";
import { Badges, BadgesSkeleton } from "./Badges";
import { PointsView, PointsViewSkeleton } from "./PointsView";
import { ProfileHeader, ProfileHeaderSkeleton } from "./ProfileHeader";
import { ThemedText } from "../ThemedText";

function Profile() {
  const [refreshing, setRefreshing] = useState(false); // State to track refresh

  const userProfile = useProfileStore((state) => state.profile);
  const accessToken = useAuthStore((state) => state.accessToken);

  const userId = getIdFromToken(accessToken || "");
  const { data, isLoading, isError, refetch } = useGetUserById(userId || "");

  useEffect(() => {
    if (data) {
      useProfileStore.setState({ profile: data });
    }
  }, [data]);

  const onRefresh = async () => {
    setRefreshing(true);
    await refetch();
    setRefreshing(false);
  };

  if (isError && !userProfile) {
    return (
      <ScrollView
        contentContainerStyle={[styles.errorContainer, {flexGrow: 1}]}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ThemedView type="container" style={styles.errorContent}>
          <ThemedText type="titleLarge">Error loading profile</ThemedText>
          <ThemedText type="bodySmall" style={{ marginTop: 8 }}>
            Pull to refresh
          </ThemedText>
        </ThemedView>
      </ScrollView>
    );
  }

  if (isLoading || !userProfile) {
    return <ProfileSkeleton />;
  }

  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView
        style={styles.scrollView}
        contentContainerStyle={{ gap: 20 }}
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        <ProfileHeader username={userProfile.username} avatarUrl={userProfile.profileDetails?.image} />
        <PointsView points={userProfile.profileScore} />
        <Badges badges={userProfile?.profileDetails.achievementBadges} />
        <Actions />
        <Activity userId={String(userProfile?.id)} />
        <EmptyViewWithTabBarHeight />
      </ScrollView>
    </ThemedView>
  ); 
}

const ProfileSkeleton = () => (
  <ThemedView type="background" style={{ gap: 20, marginTop: 16, paddingHorizontal: 16 }}>
    <ProfileHeaderSkeleton />
    <PointsViewSkeleton />
    <BadgesSkeleton />
    <Actions />
    <ActivitySkeleton />
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  scrollView: {
    paddingHorizontal: 16,
  },
  errorContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  errorContent: {
    justifyContent: "center",
    alignItems: "center",
  },
});

export { Profile };
