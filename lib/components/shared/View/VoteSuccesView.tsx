import React, { useMemo } from "react";
import { View, Image, ViewStyle } from "react-native";
import { IconTwinkle } from "../../icons/games";
import IconTwinkleAnimated from "../../icons/games/icon-twinkle-animated";


export const VoteSuccessView = () => {
	// Memoize the main success image
	const SuccessImage = useMemo(() => (
		<Image
			style={{
				width: "100%",
				aspectRatio: 1,
				objectFit: "contain",
			}}
			source={require("@/assets/images/vote-success.gif")}
		/>
	), []);

	return (
		<View style={{ flex: 1 }}>
			<View style={{ flexDirection: "row", paddingHorizontal: 16 }}>
				{SuccessImage}
			</View>
			<View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: 1 }}>
				<IconTwinkleAnimated iconWidth={25} iconHeight={40} style={{ position: "absolute", top: 89, left: 16}}/>
				<IconTwinkleAnimated iconWidth={25} iconHeight={40} style={{ position: "absolute", top: 23, left: 110}}/>
				<IconTwinkleAnimated iconWidth={15} iconHeight={25} style={{ position: "absolute", top: 98, right: 98}}/>
				<IconTwinkleAnimated iconWidth={25} iconHeight={40} style={{ position: "absolute", top: 17, right: 2}}/>
				<IconTwinkleAnimated iconWidth={25} iconHeight={40} style={{ position: "absolute", bottom: 14, left: 12}}/>
				<IconTwinkleAnimated iconWidth={30} iconHeight={50} style={{ position: "absolute", bottom: 71, left: 165}}/>
				<IconTwinkleAnimated iconWidth={25} iconHeight={40} style={{ position: "absolute", bottom: 6, right: 2}}/>
			</View>
		</View>
	);
};

export default VoteSuccessView;