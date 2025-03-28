import { openBrowserAsync } from "expo-web-browser";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Image } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import IconPolkasafe from "../icons/browser/icon-polkasafe";
import { ThemedText } from "../ThemedText";

const FeaturedWebsites = () => {
	return (
		<View style={styles.container}>
			<ThemedText type="bodyMedium2">FEATURED WEBSITES</ThemedText>
			<View style={styles.featuredCardsWrapper}>
				<TouchableOpacity
					style={styles.featuredCard}
					onPress={() => openBrowserAsync("https://polkassembly.io/")}
				>
					<Image
						source={require("@/assets/images/browser/feature-polka.png")}
						style={styles.featuredImage}
					/>
					<View>
						<ThemedText type="bodySmall3">Polkassembly</ThemedText>
						<ThemedText type="bodySmall4" style={styles.featuredSubtext}>Governance</ThemedText>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.featuredCard}
					onPress={() => openBrowserAsync("https://townhallgov.com/")}
				>
					<Image
						source={require("@/assets/images/browser/feature-townhall.png")}
						style={styles.featuredImage}
					/>
					<View>
						<ThemedText type="bodySmall3">Townhall</ThemedText>
						<ThemedText type="bodySmall4" style={styles.featuredSubtext}>Governance</ThemedText>
					</View>
				</TouchableOpacity>

				<TouchableOpacity
					style={styles.featuredCard}
					onPress={() => openBrowserAsync("https://polkasafe.xyz/")}
				>
					<IconPolkasafe />
					<View>
						<ThemedText type="bodySmall3">Polkasafe</ThemedText>
						<ThemedText type="bodySmall4" style={styles.featuredSubtext}>Governance</ThemedText>
					</View>
				</TouchableOpacity>
			</View>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		gap: 16,
	},
	featuredCardsWrapper: {
		flexDirection: "row",
		gap: 16,
	},
	featuredCard: {
		flex: 1,
		borderWidth: 1,
		borderColor: Colors.dark.stroke,
		paddingHorizontal: 16,
		paddingVertical: 16,
		borderRadius: 8,
		alignItems: "flex-start",
		justifyContent: "flex-end",
		gap: 16,
	},
	featuredImage: {
		height: 32,
		width: 32,
		resizeMode: "contain",
	},
	featuredSubtext: {
		color: "#9B9B9B",
	},
});

export default FeaturedWebsites;