import { StyleSheet, View, Image } from "react-native";
import { router } from "expo-router";
import { ThemedView } from "@/lib/components/shared/View";
import { ThemedText } from "@/lib/components/shared/text";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { ThemedButton } from "@/lib/components/shared/button";

const Colors = {
	primaryBackground: "#222121",
	textPrimary: "#C6C5C8",
	textSecondary: "#79767D",
	errorBackground: "#6C0516",
};

export default function LoginOptionsScreen() {
	const strokeColor = useThemeColor({}, "stroke");

	return (
		<ThemedView type="secondaryBackground" style={styles.safeAreaView}>
			<View style={styles.headerContainer}>
				<Image style={styles.logo} source={require("@/assets/images/logo-wide.png")} />
				<Image style={{ flexGrow: 0.8, flexBasis: 0 }} resizeMode="contain" source={require("@/assets/images/auth/qr-auth-screen.gif")} />
				<View style={styles.loginText}>
					<ThemedText type="display">Login to the App</ThemedText>
					<ThemedText type="bodyMedium2" colorName="mediumText">
						Explore Proposals on the go and add your vote!
					</ThemedText>
				</View>
			</View>

			<ThemedView type="background" style={styles.loginDescContainer}>
				<ThemedButton text='Scan Qr' onPress={() => router.push("/auth/qrAuth")} style={{ marginVertical: 10 }}></ThemedButton>
				<View style={{ flexDirection: "row", alignItems: "center" }}>
					<View style={{ flex: 1, height: 1, backgroundColor: strokeColor }} />
					<ThemedText type="bodySmall" style={{ marginHorizontal: 8, textAlign: 'center' }}>
						or
					</ThemedText>
					<View style={{ flex: 1, height: 1, backgroundColor: strokeColor }} />
				</View>
				<ThemedButton buttonBgColor="secondaryBackground" text='Log in Via Email' onPress={() => router.push("/auth/web2auth")} bordered style={{ marginVertical: 10 }} />
			</ThemedView>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	safeAreaView: {
		flex: 1,
		display: "flex",
		flexDirection: "column",
		justifyContent: "flex-end",
	},
	headerContainer: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		flex: 1,
	},
	logo: {
		width: 160,
		height: 50,
		resizeMode: "contain",
	},
	loginText: {
		display: "flex",
		flexDirection: "column",
		alignItems: "center",
		justifyContent: "center",
		gap: 8,
	},
	loginDescContainer: {
		display: "flex",
		flexDirection: "column",
		padding: 24,
		gap: 16,
	},
});