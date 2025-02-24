import { IconBookmark } from "../../icons/shared";
import ThemedButton from "../../ThemedButton";
import { StyleSheet } from "react-native";

function BookmarkButton() {
	return (
		<ThemedButton buttonBgColor="selectedIcon" style={styles.iconButton}>
			<IconBookmark color="white" />
		</ThemedButton>

	)
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

export default BookmarkButton;