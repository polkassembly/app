import { View, StyleSheet } from "react-native";
import { ThemedText } from "@/lib/components/shared/text";
import IconWarn from "@/lib/components/icons/auth/icon-warn";

const ErrorView = ({ content }: { content: string }) => (
	<View style={styles.error}>
		<IconWarn iconHeight={20} iconWidth={20} />
		<ThemedText
			type="bodySmall"
			numberOfLines={2}
			ellipsizeMode="tail"
			style={{ paddingRight: 32}}
		>
			{content || "Something went wrong"}
		</ThemedText>
	</View>
);

export default ErrorView;

const styles = StyleSheet.create({
	error: {
		flexDirection: "row",
		gap: 8,
		paddingHorizontal: 8,
		paddingVertical: 8,
		backgroundColor: "#6C0516",
		borderRadius: 6,
		alignItems: "center",
	},
});
