
import { Share, StyleSheet } from "react-native";
import { IconShare } from "../../icons/shared";
import ThemedButton from "../../ThemedButton";

const POLKASSEMBLY_URL = process.env.EXPO_PUBLIC_POLKASSEMBLY_URL;

interface ShareButtonProps {
	proposalId: string;
	proposalTitle: string;
}

function ShareButton({ proposalId, proposalTitle }: ShareButtonProps) {
	const onShare = async () => {
			try {
				const shareUrl = `${POLKASSEMBLY_URL}/refrenda/${proposalId}`;
				const message = `Check out this proposal: "${proposalTitle}"\n\nRead more: ${shareUrl}`;
				await Share.share({ message });
			} catch (error: any) {
				console.error("Error sharing:", error.message);
			}
		};

	return (
		<ThemedButton onPress={onShare} buttonBgColor="selectedIcon" style={styles.iconButton}>
			<IconShare color="white" />
		</ThemedButton>
	);
}

const styles = StyleSheet.create(
	{
		iconButton: {
			height: 26,
			paddingHorizontal: 6,
			paddingVertical: 2,
			borderRadius: 6,
			justifyContent: "center",
			alignItems: "center",
			flexDirection: "row",
			gap: 4,
		}
	}
)

export default ShareButton;