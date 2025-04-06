import { Video, ResizeMode } from "expo-av"
import { LinearGradient } from "expo-linear-gradient"
import { StyleSheet, View } from "react-native"
import { ThemedText } from "../shared/text/ThemedText"
import { Image } from "react-native"
import { memo } from "react"

const BrowserHeroSection = () => {
	return (
		<View style={styles.videoContainer}>
			<Video
				source={require("@/assets/videos/browser/bg.mp4")}
				style={styles.videoStyle}
				shouldPlay
				isLooping
				isMuted
				resizeMode={ResizeMode.COVER}
			/>
			<View style={styles.bannerContainer}>
				<LinearGradient
					colors={["#000000", "#01017F"]}
					start={{ x: 0.5, y: 0 }}
					end={{ x: 0.5, y: 1 }}
					style={styles.gradientOverlay}
				/>
				<View style={styles.bannerContent}>
					<ThemedText type="titleMedium" style={styles.bannerTitle}>
						Welcome to{"\n"} Polkassembly Browser!
					</ThemedText>
					<ThemedText type="bodyMedium3" style={styles.bannerSubtitle}>
						Polkadot anything, everything!
					</ThemedText>
					<Image
						style={styles.bannerLogo}
						source={require("@/assets/images/browser/polkaassembly.png")}
					/>
				</View>
			</View>
			<View style={styles.videoFade} />
		</View>
	)
}

const styles = StyleSheet.create({
	videoContainer: {
		position: "relative",
		height: 250,
	},
	videoStyle: {
		position: "absolute",
		top: 0,
		height: "100%",
		width: "100%",
		opacity: 0.3,
	},
	bannerContainer: {
		alignItems: "center",
		backgroundColor: "#01017F",
		marginHorizontal: 50,
		marginVertical: 35,
		overflow: "hidden",
	},
	gradientOverlay: {
		position: "absolute",
		top: 0,
		height: "100%",
		width: "100%",
	},
	bannerContent: {
		padding: 20,
		alignItems: "center",
	},
	bannerTitle: {
		textAlign: "center",
		marginBottom: 10,
	},
	bannerSubtitle: {
		textAlign: "center",
		color: "#737373",
		marginBottom: 20,
	},
	bannerLogo: {
		height: 36,
		width: 102,
	},
	videoFade: {
		position: "absolute",
		left: 0,
		right: 0,
		top: 0,
		bottom: 0,
		backgroundColor: "#000",
		opacity: 0.3,
	},
});

export default memo(BrowserHeroSection)