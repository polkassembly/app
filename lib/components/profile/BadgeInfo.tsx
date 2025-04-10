import { Image, StyleSheet } from "react-native";
import { View } from "react-native";
import { BadgeDetails } from "../util/badgeInfo";
import { BADGEIMAGES } from "./Badges";
import { ThemedView } from "../shared/View";
import { ThemedText } from "../shared/text";
import { ENetwork } from "@/lib/types/post";
import { useThemeColor } from "@/lib/hooks";
import { LinearGradient } from 'expo-linear-gradient';

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
		<View>
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
			<View>
				<LinearGradient
					colors={['transparent', accentColor]}
					style={styles.topGlow}
				/>
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
		borderTopEndRadius: 16,
		borderTopStartRadius: 16,
	},
	topGlow: {
		position: 'absolute',
		top: -8,
		left: 0,
		right: 0,
		height: 100,
		borderRadius: 16,
	},
	badgeContainer: {
		alignItems: "center",
		position: "absolute",
		top: -50,
		left: 0,
		right: 0,
		justifyContent: "center",
		zIndex: 2
	}
});

export default BadgeInfo;