import { StyleSheet, View } from "react-native";
import IconAbstain from "../icons/shared/icon-abstain";
import IconAye from "../icons/shared/icon-aye";
import IconNay from "../icons/shared/icon-nay";
import React from "react";

const OverlayLabel = React.memo(({ type }: { type: "aye" | "nay" | "abstain" }) => {
	let overlayBackground, badgeBackground, IconComponent;
	if (type === "nay") {
		overlayBackground = "rgba(249, 201, 201, 0.7)";
		badgeBackground = "#F53C3C";
		IconComponent = IconNay;
	} else if (type === "aye") {
		overlayBackground = "rgba(177, 234, 203, 0.7)";
		badgeBackground = "#2ED47A";
		IconComponent = IconAye;
	} else if (type === "abstain") {
		overlayBackground = "rgba(247, 219, 175, 0.7)";
		badgeBackground = "#FFBF60";
		IconComponent = IconAbstain;
	}
	return (
		<View style={[styles.overlayLabel, { backgroundColor: overlayBackground }]}>
			<View style={[styles.iconBadge, { backgroundColor: badgeBackground }]}>
				{IconComponent && <IconComponent color="white" filled iconWidth={50} iconHeight={50} />}
			</View>
		</View>
	);
});

const styles = StyleSheet.create({

	overlayLabel: {
		flex: 1,
		alignItems: "center",
		justifyContent: "center",
		borderRadius: 10,
		padding: 10,
		maxHeight: "85%",
	},
	iconBadge: {
		borderRadius: 100,
		padding: 20,
	},
})

export default OverlayLabel;