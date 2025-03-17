import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useGetCartItems } from "@/lib/net/queries/actions";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import IconVotedProposal from "../icons/proposals/icon-voted-proposal";
import { ThemedText } from "../ThemedText";

const CartItemsPreview = () => {
	const { data: cartItems, isLoading } = useGetCartItems();
	const colorStroke = useThemeColor({}, "stroke");
	const accent = useThemeColor({}, "accent");
	const router = useRouter();

	if (!cartItems || cartItems.length === 0 || isLoading) {
		return (
			<View style={[styles.floatingPreview, { backgroundColor: "#FFE5F3" }]}>
				<IconVotedProposal />
				<View style={styles.previewText}>
					<ThemedText style={{ color: "#000" }}>Preview</ThemedText>
					<ThemedText style={{ color: colorStroke }}>{ isLoading ? "loading.." : 0}</ThemedText>
				</View>
			</View>
		)
	}

	return (
		<View style={[styles.floatingPreview, { backgroundColor: "#FFE5F3" }]}>
			<IconVotedProposal />
			<View style={styles.previewText}>
				<ThemedText style={{ color: "#000" }}>Preview</ThemedText>
				<ThemedText style={{ color: colorStroke }}>
					{cartItems.length} Proposals
				</ThemedText>
			</View>
			<TouchableOpacity onPress={() => router.push("/batch-vote/voted-proposals")}>
				<View style={[styles.iconView, { backgroundColor: accent }]}>
					<Ionicons name="chevron-forward" color="white" size={30} />
				</View>
			</TouchableOpacity>
		</View>
	);
};

const styles = StyleSheet.create({
	floatingPreview: {
		position: "absolute",
		bottom: 110,
		alignSelf: "center",
		paddingHorizontal: 12,
		paddingVertical: 8,
		borderRadius: 100,
		flexDirection: "row",
		gap: 10,
		zIndex: 200,
		alignItems: "center",
	},
	previewText: {
		flexDirection: "column",
		alignContent: "flex-start",
	},
	iconView: {
		width: 30,
		height: 30,
		borderRadius: 15,
	},
})

export default CartItemsPreview;