import { ThemedButton } from "@/lib/components/shared/button";
import { ThemedText } from "@/lib/components/shared/text";
import { Note, TopBar } from "@/lib/components/shared";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { StyleSheet, View } from "react-native";
import { ThemedView, TopGlow, VoteSuccessView } from "@/lib/components/shared/View";

type Params = {
	proposalCount: string
	totalDotSpent: string
};

export default function SuccessScreen() {
	const backgroundColor = useThemeColor({}, "secondaryBackground");
	const { proposalCount, totalDotSpent } = useLocalSearchParams<Params>();

	return (
		<View style={{ flex: 1, backgroundColor }}>
			<TopBar style={{ paddingHorizontal: 16 }} />
			<VoteSuccessView />
			<View>
				<TopGlow />
				<ThemedView type="secondaryBackground" style={styles.bottomContainer}>
					<ThemedText type="titleMedium">Batch Votes were added to cart</ThemedText>
					<View
						style={{
							flexDirection: "row",
							alignItems: "baseline",
							justifyContent: "center",
							gap: 12
						}}
					>
						<ThemedText type="titleMedium">
							{proposalCount} Proposals
						</ThemedText>
						<ThemedText type="bodyMedium1" colorName="mediumText">
							with
						</ThemedText>
						<ThemedText type="titleMedium" colorName="ctaText">
							{totalDotSpent} DOT
						</ThemedText>
					</View>

					<Note content="NOTE: Login Via web view to confirm your vote" />

					<ThemedButton
						onPress={() => router.dismissTo("/(tabs)")}
						text="Explore Feed"
						textType="buttonLarge"
						style={{ width: "100%" }}
					/>
				</ThemedView>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	bottomContainer: {
		gap: 16,
		justifyContent: "center",
		alignItems: "center",
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
		paddingTop: 24,
		paddingBottom: 16,
		paddingHorizontal: 16
	}
})