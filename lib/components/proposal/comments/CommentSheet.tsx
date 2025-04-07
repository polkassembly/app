import { ScrollView, View, TouchableOpacity, StyleSheet } from "react-native"
import IconClose from "../../icons/shared/icon-close"
import { ThemedText } from "../../shared/text"
import { HorizontalSeparator, ThemedView } from "../../shared/View"

interface CommentSheetProps {
	onClose: () => void
}

const CommentSheet = ({ onClose }: CommentSheetProps) => {
	return (
		<ThemedView type="container" style={styles.sheet}>
			<ScrollView>
				<View style={styles.headerContainer}>
					<ThemedText type="titleSmall">Add Comment</ThemedText>
					<TouchableOpacity onPress={onClose} style={{ padding: 5, paddingHorizontal: 10 }}>
						<IconClose iconWidth={14} iconHeight={14} color="#79767D" />
					</TouchableOpacity>
				</View>

				<HorizontalSeparator style={{ marginTop: 15, marginBottom: 25 }} />
			</ScrollView>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	sheet: {
		width: "100%",
		height: "81%",
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		paddingTop: 16,
		paddingHorizontal: 16
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
	},
});

export default CommentSheet