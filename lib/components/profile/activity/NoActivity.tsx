import { Link } from "expo-router";
import { StyleSheet } from "react-native";
import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";
import { Image } from "react-native";

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

const styles = StyleSheet.create({
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

export default NoActivity;