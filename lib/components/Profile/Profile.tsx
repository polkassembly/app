import { useGetUserById } from "@/lib/net/queries/profile";
import { useAuthStore } from "@/lib/store/authStore";
import { useProfileStore } from "@/lib/store/profileStore";
import getIdFromToken from "@/lib/util/jwt";
import { useEffect } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { ThemedView } from "../ThemedView";
import { EmptyViewWithTabBarHeight } from "../util";
import { Actions, ActionsSkeleton } from "./Actions";
import { Activity, ActivitySkeleton } from "./Activity";
import { Badges, BadgesSkeleton } from "./Badges";
import { PointsView, PointsViewSkeleton } from "./PointsView";
import { ProfileHeader, ProfileHeaderSkeleton } from "./ProfileHeader";

function Profile() {
  const userProfile = useProfileStore((state) => state.profile);
  const accessToken = useAuthStore((state) => state.accessToken);

  const userId = getIdFromToken(accessToken || "");
  const { data } = useGetUserById(userId || "");

  useEffect(() => {
    if (data) {
      useProfileStore.setState({ profile: data });
    }
  }, [data]);

  if (!userProfile) {
    return <ProfileSkeleton />;
  }

  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 20 }}>
        <ProfileHeader username={userProfile.username} avatarUrl={userProfile.profileDetails?.image} />
        <PointsView points={userProfile.profileScore} />
        <Badges />
        <Actions />
        <Activity userId={String(userProfile.id)} />
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
    <ActionsSkeleton />
    <ActivitySkeleton />
  </ThemedView>
);

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	scrollView: {
		paddingHorizontal: 16,
		marginTop: 16,
	},
});

export { Profile };