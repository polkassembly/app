import { Skeleton } from "moti/skeleton";
import { StyleSheet, View } from "react-native";
import { ThemedView } from "../../shared/View/ThemedView";
import { useThemeColor } from "@/lib/hooks";

const ActivityItemSkeleton = () => {
	const strokeColor = useThemeColor({}, "stroke");
	return (
		<ThemedView type="container" style={[styles.activityItemContainer, { borderColor: strokeColor }]}>
			<Skeleton height={32} width={32} radius="round" />
			<View style={styles.textContainer}>
				<Skeleton height={12} width="60%" radius="round" />
				<View style={styles.metaContainer}>
					<Skeleton height={12} width={40} radius="round" />
					<Skeleton height={12} width="50%" radius="round" />
				</View>
				<View style={styles.timeContainer}>
					<Skeleton height={12} width={12} radius="round" />
					<Skeleton height={12} width={80} radius="round" />
				</View>
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flexDirection: "column",
		gap: 16,
	},
	activityItemContainer: {
		flexDirection: "row",
		padding: 12,
		gap: 8,
		borderRadius: 12,
		borderWidth: 1,
		flex: 1
	},
	textContainer: {
		flex: 1,
		gap: 8,
	},
	metaContainer: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center",
	},
	timeContainer: {
		flexDirection: "row",
		gap: 4,
		alignItems: "center",
	},
});

export default ActivityItemSkeleton;
