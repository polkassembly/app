import { SafeAreaView } from "react-native-safe-area-context";
import { StyleSheet, View, Image } from "react-native";
import { Link, router } from "expo-router";
import { ThemedView } from "@/lib/components/shared/View";
import { ThemedText } from "@/lib/components/shared/text";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { ThemedButton } from "@/lib/components/shared/button";
import { Ionicons } from "@expo/vector-icons";
import { ThemedCheckbox, ThemedTextInput } from "@/lib/components/shared";
import { AxiosError } from "axios";
import { useState } from "react";
import { useWeb2Login } from "@/lib/net/queries/auth";

const Colors = {
	primaryBackground: "#222121",
	textPrimary: "#C6C5C8",
	textSecondary: "#79767D",
	errorBackground: "#6C0516",
};

export default function Web2Auth() {
	const [rememberMeChecked, setRememberMeChecked] = useState(false);

	const [email, setEmail] = useState("");
	const [password, setPassword] = useState("");

	const { mutateAsync: login, isPending } = useWeb2Login();

	async function onPressLogin() {
		try {
			await login({
				emailOrUsername: email,
				password,
			});
			router.dismissAll();
			router.replace("/(tabs)");
		} catch (e) {
			console.error(e);
			if (e instanceof AxiosError) {
				console.error(e.response?.data);
			}

			// FIXME: report errors to UI

			return;
		}
	}


	const secondaryBackgroundColor = useThemeColor({}, "secondaryBackground");
	const accentColor = useThemeColor({}, "accent");

	return (
		<SafeAreaView style={[styles.safeAreaView, { backgroundColor: secondaryBackgroundColor }]}>
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
			<Link href="/auth/loginOptionsScreen" style={{ paddingLeft: 24, paddingBottom: 16 }}>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
					<Ionicons name="arrow-back" size={16} color={accentColor} />
					<ThemedText type="bodyMedium2" colorName="accent">Go Back</ThemedText>
				</View>
			</Link>

			<ThemedView type="background" style={styles.loginDescContainer}>
				<ThemedTextInput
					value={email}
					onChangeText={setEmail}
					label="Email or Username"
					textContentType="emailAddress"
				/>
				<ThemedTextInput
					value={password}
					onChangeText={setPassword}
					label="Password"
					password
				/>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<ThemedCheckbox
						value={rememberMeChecked}
						onValueChange={setRememberMeChecked}
						label="Remember me"
					/>

					<ThemedButton borderless text="Forgot Password?" />
				</View>

				<ThemedButton
					onPress={onPressLogin}
					text="Log In"
					textType="buttonLarge"
					disabled={isPending}
					loading={isPending}
				/>
			</ThemedView>
		</SafeAreaView>
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
	loginDescText: {
		backgroundColor: Colors.primaryBackground,
		color: Colors.textPrimary,
		borderRadius: 7,
		paddingHorizontal: 10,
		paddingVertical: 10,
	},
});