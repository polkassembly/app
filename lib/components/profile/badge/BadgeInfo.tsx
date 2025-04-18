import { Image, StyleSheet } from "react-native";
import { View } from "react-native";
import { ENetwork } from "@/lib/types/post";
import { useThemeColor } from "@/lib/hooks";
import { ThemedText } from "../../shared/text";
import { ThemedView, TopGlow } from "../../shared/View";
import { BadgeDetails, BADGEIMAGES } from "../../util/badgeInfo";

interface BadgeInfoProps {
	badge: BadgeDetails & { isUnlocked: boolean };
}

const BadgeInfo = ({ badge }: BadgeInfoProps) => {

	const backgroundColor = useThemeColor({}, "container");
	const accentColor = useThemeColor({}, "accent");

	const description = badge.isUnlocked
		? typeof badge.requirements.unlocked === "function"
			? badge.requirements.unlocked(ENetwork.POLKADOT)
			: badge.requirements.unlocked
		: typeof badge.requirements.locked === "function"
			? badge.requirements.locked(ENetwork.POLKADOT)
			: badge.requirements.locked;

	return (
		<View style={{ flex: 1 }}>
			<View style={styles.badgeContainer}>
				<Image
					source={
						badge.isUnlocked
							? BADGEIMAGES[badge.name]
							: BADGEIMAGES[`${badge.name} Locked`]
					}
					style={styles.badgeImage}
					key={badge.name}
					resizeMode="contain"
				/>
			</View>
			<View style={{ marginTop: 50 }}>
				<TopGlow />
				<ThemedView
					type="container"
					style={[styles.container, { backgroundColor }]}
				>
					<ThemedText type="titleMedium1" style={{ textAlign: "center" }}>
						{badge.name}
					</ThemedText>
					<ThemedText type="bodyMedium1" colorName="mediumText" style={{ textAlign: "center", marginTop: 10 }}>
						{description}
					</ThemedText>
				</ThemedView>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	badgeImage: {
		width: 100,
		height: 100,
	},
	container: {
		paddingHorizontal: 16,
		paddingVertical: 30,
		borderTopEndRadius: 24,
		borderTopStartRadius: 24,
	},
	badgeContainer: {
		alignItems: "center",
		position: "absolute",
		top: 0,
		left: 0,
		right: 0,
		justifyContent: "center",
		zIndex: 2
	}
});

export default BadgeInfo;