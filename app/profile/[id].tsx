import { RefreshControl, ScrollView, StyleSheet, View } from "react-native";
import { useState } from "react";
import { useGetUserById } from "@/lib/net/queries/profile";
import { useAuthStore } from "@/lib/store/authStore";
import { useProfileStore } from "@/lib/store/profileStore";
import getIdFromToken from "@/lib/util/jwt";
import { useEffect } from "react";
import { useThemeColor } from "@/lib/hooks";
import { useAuthModal } from "@/lib/context/authContext";
import { ThemedText } from "@/lib/components/shared/text/ThemedText";
import { ThemedView } from "@/lib/components/shared/View/ThemedView";
import { EmptyViewWithTabBarHeight } from "@/lib/components/shared/util";
import { Activity, Badges, PointsView, ProfileHeader } from "@/lib/components/profile";

function Profile() {
	const [refreshing, setRefreshing] = useState(false);

	const userProfile = useProfileStore((state) => state.profile);
	const accessToken = useAuthStore((state) => state.accessToken);
	const { openLoginModal } = useAuthModal();

	const userId = getIdFromToken(accessToken || "");
	const { data, isError, refetch } = useGetUserById(
		userId || "",
		{
			enabled: !!userId,
		}
	);

	const accentColor = useThemeColor({}, "accent");

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
				contentContainerStyle={[styles.errorContainer, { flexGrow: 1 }]}
				refreshControl={<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					tintColor={accentColor}
					colors={[accentColor]}
					progressBackgroundColor={"transparent"}
				/>}
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

	if (!userId || !userProfile) {
		openLoginModal('Please login to like this post.', true);
	}

	return (
		<ThemedView type="secondaryBackground" style={styles.container}>
			<ProfileHeader />
			<ScrollView
				style={styles.scrollView}
				contentContainerStyle={{ gap: 20 }}
				refreshControl={<RefreshControl
					refreshing={refreshing}
					onRefresh={onRefresh}
					tintColor={accentColor}
					colors={[accentColor]}
					progressBackgroundColor={"transparent"}
				/>}
			>
				<PointsView points={userProfile?.profileScore} />
				<Badges badges={userProfile?.profileDetails.achievementBadges} />
				<Activity userId={String(userProfile?.id)} />
				<EmptyViewWithTabBarHeight />
			</ScrollView>
		</ThemedView>
	);
}

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

export default Profile;
