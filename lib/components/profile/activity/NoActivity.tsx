import { Link } from "expo-router";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../../shared/text/ThemedText";
import { Image } from "react-native";

const NoActivity = () => (
	<>
		<ThemedText type="bodySmall">RECENT ACTIVITY</ThemedText>
		<View style={styles.noActivityContainer}>
			<Image
				style={styles.emptyImage}
				resizeMode="contain"
				source={require("@/assets/images/profile/empty-activity.png")}
			/>
			<View style={styles.noActivityTextContainer}>
				<ThemedText>No Activity Yet.</ThemedText>
				<Link href="/(tabs)">
					<ThemedText colorName="accent">Vote Now!</ThemedText>
				</Link>
			</View>
		</View>
	</>
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