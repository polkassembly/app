import { Skeleton } from "moti/skeleton";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "../../ThemedView";

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
		padding: 12,
		alignItems: "center",
		justifyContent: "space-between",
		borderRadius: 34,
	},
	noActivityContainer: {
		alignItems: "center",
	}
});

export default ActivitySkeleton;