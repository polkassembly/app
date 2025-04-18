import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useGetCartItems } from "@/lib/net/queries/actions";
import { Ionicons } from "@expo/vector-icons";
import { useRouter } from "expo-router";
import React, { useState } from "react";
import { View, TouchableOpacity, StyleSheet } from "react-native";
import IconVotedProposal from "../icons/proposals/icon-voted-proposal";
import { ThemedText } from "../shared/text/ThemedText";
import { useLocalCartStore } from "@/lib/store/localCartStore";

const CartItemsPreview = () => {
	const cartItems = useLocalCartStore((state) => state.items)
	const accent = useThemeColor({}, "accent");
	const router = useRouter();
	const [isNavigating, setIsNavigating] = useState(false);

	const handlePress = () => {
		if (isNavigating) return;
		setIsNavigating(true);
		router.push("/batch-vote/confirm-cart");
		setTimeout(() => {
			setIsNavigating(false);
		}, 1000);
	};

	if (!cartItems || cartItems.length === 0) {
		return (
			<View style={[styles.floatingPreview, { backgroundColor: "#FFE5F3" }]}>
				<IconVotedProposal iconHeight={32} iconWidth={32} />
				<View style={styles.previewText}>
					<ThemedText type="bodyMedium1" style={{ color: "#243A57" }}>Preview</ThemedText>
					<ThemedText type="bodySmall" style={{ color: "#485F7D" }}>
						 0 Proposals
					</ThemedText>
				</View>
				<TouchableOpacity disabled>
					<View style={[styles.iconView, { backgroundColor: accent, opacity: 0.5 }]}>
						<Ionicons name="chevron-forward" color="white" size={16} />
					</View>
				</TouchableOpacity>
			</View>
		);
	}

	return (
		<View style={[styles.floatingPreview, { backgroundColor: "#FFE5F3" }]}>
			<IconVotedProposal iconHeight={32} iconWidth={32} />
			<View style={styles.previewText}>
				<ThemedText type="bodyMedium1" style={{ color: "#243A57", fontFamily: "Poppins-SemiBold" }}>Preview</ThemedText>
				<ThemedText type="bodySmall" style={{ color: "#485F7D" }}>
					{cartItems.length} Proposals
				</ThemedText>
			</View>
			<TouchableOpacity
				onPress={handlePress}
				disabled={isNavigating}
			>
				<View
					style={[
						styles.iconView,
						{
							backgroundColor: accent,
						},
					]}
				>
					<Ionicons name="chevron-forward" color="white" size={16} />
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
		justifyContent: "center",
		alignItems: "center",
	},
});

export default CartItemsPreview;
