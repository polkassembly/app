import { useState } from "react"
import { StyleSheet, ActivityIndicator } from "react-native"
import { ThemedTextInput } from "../shared"
import { ThemedButton } from "../shared/button"
import { ThemedText } from "../shared/text"
import { ThemedView } from "../shared/View"
import Toast from "react-native-toast-message"
import { useForgotPassword } from "@/lib/net/queries/auth"

interface ForgotPasswordProps {
	onClose: () => void
}

const ForgotPassword = ({ onClose }: ForgotPasswordProps) => {
	const [email, setEmail] = useState("")
	const [error, setError] = useState("")
	const [loading, setLoading] = useState(false)
	const { mutateAsync: sendEmail } = useForgotPassword()

	const isValidEmail = (email: string) =>
		/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)

	const handleForgotPassword = async () => {
		if (!email.trim()) {
			setError("Email is required.")
			return
		}

		if (!isValidEmail(email)) {
			setError("Please enter a valid email address.")
			return
		}

		setError("")
		setLoading(true)

		try {
			await sendEmail(
				{ email },
				{
					onSuccess: () => {
						Toast.show({
							type: "success",
							text1: "Email sent",
							visibilityTime: 2000,
						})
						onClose()
					},
					onError: () => {
						Toast.show({
							type: "error",
							text1: "Failed to send email",
						})
					},
				}
			)
		} finally {
			setLoading(false)
		}
	}

	return (
		<ThemedView style={styles.container}>
			<ThemedText type="titleMedium" style={{ textAlign: "center", paddingTop: 8 }}>
				Forgot Password
			</ThemedText>

			<ThemedTextInput
				value={email}
				onChangeText={(text) => {
					setEmail(text)
					if (error) setError("")
				}}
				errorText={error}
				label="Enter Registered Email"
				required
				textContentType="emailAddress"
				keyboardType="email-address"
				autoCapitalize="none"
				autoCorrect={false}
			/>
			<ThemedButton
				text="Done"
				onPress={handleForgotPassword}
				disabled={!email || !!error}
				loading={loading}
			/>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	container: {
		flex: 1,
		padding: 16,
		gap: 24,
		borderTopRightRadius: 24,
		borderTopLeftRadius: 24,
	},
})

export default ForgotPassword
