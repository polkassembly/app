import React from "react";
import { View, Image, StyleSheet } from "react-native";
import { ThemedText } from "../shared/text/ThemedText";
import useTreasuryStats from "@/lib/net/queries/treasury/useTreasuryStats";
import { formatBnBalance } from "@/lib/util";
import { ENetwork } from "@/lib/types/post";
import { LinearGradient } from "expo-linear-gradient";
import { ThemedView } from "../shared/View/ThemedView";

function TreasurySection() {
	const { data, error, isLoading } = useTreasuryStats();

	// Select the latest treasury stats based on createdAt or updatedAt
	const latestTreasuryStats = Array.isArray(data) && data.length > 0
		? data.reduce((latest, current) => {
			const latestTimestamp = latest.createdAt || latest.updatedAt;
			const currentTimestamp = current.createdAt || current.updatedAt;

			return (currentTimestamp > latestTimestamp) ? current : latest;
		})
		: null;

	return (
		<View style={styles.container}>
			<Image
				source={require('@/assets/gif/treasury_bg.gif')}
				style={styles.backgroundImage}
			/>
			<View style={styles.overlayContainer}>
				<View style={styles.contentContainer}>
					{/* Gradient Border Wrapper */}
					<View style={styles.gradientBorderWrapper}>
						<LinearGradient
							colors={['#F0B44F', '#FFFFFF', '#d4e645']}
							start={{ x: 0, y: 0 }}
							end={{ x: 0, y: 1 }}
							style={styles.gradientBorder}
						>
							<ThemedView type="secondaryBackground" style={styles.contentInnerContainer}>
								<ThemedText type="bodyMedium3" style={{ fontSize: 16, marginBottom: 4 }}>Polkadot Treasury</ThemedText>
								{error ? (
									<ThemedText>Error loading treasury stats</ThemedText>
								) : latestTreasuryStats ? (
									<>
										<ThemedText style={styles.amountText}>
											{formatBnBalance(latestTreasuryStats.total?.totalDot || "0", { compactNotation: true, numberAfterComma: 2 }, ENetwork.POLKADOT)} DOT
										</ThemedText>
										<ThemedText type="titleMedium" style={styles.usdcText}>
											~${formatBnBalance(latestTreasuryStats.total?.totalUsdc || "0", { compactNotation: true, numberAfterComma: 2 }, ENetwork.POLKADOT, '1337')}
										</ThemedText>
									</>
								) : (
									<ThemedText>Loading ...</ThemedText>
								)}
							</ThemedView>
						</LinearGradient>
					</View>
				</View>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		width: '100%',
		height: 220,
		justifyContent: "center",
		alignItems: "center"
	},
	backgroundImage: {
		width: '80%',
		height: 220,
		resizeMode: 'contain',
	},
	overlayContainer: {
		position: 'absolute',
		top: 0,
		left: 0,
		right: 0,
		bottom: 0,
		justifyContent: 'center',
		alignItems: 'center'
	},
	contentContainer: {
		justifyContent: 'center',
		alignItems: 'center',
		padding: 12,
	},
	gradientBorderWrapper: {
		borderRadius: 20,
		overflow: 'hidden',
		borderWidth: 1,
		borderColor: 'transparent',
		shadowColor: '#EDFC74',
		shadowOffset: { width: 0, height: 4 },
		shadowOpacity: 0.24,
		shadowRadius: 8.6,
		elevation: 5,
	},
	gradientBorder: {
		padding: 1,
		borderRadius: 20,
	},
	contentInnerContainer: {
		borderRadius: 18,
		padding: 12,
		justifyContent: 'center',
		alignItems: 'center',
	},
	amountText: {
		fontSize: 32,
		fontWeight: '600',
		lineHeight: 48
	},
	usdcText: {
		opacity: 0.53
	}
});

export default TreasurySection;