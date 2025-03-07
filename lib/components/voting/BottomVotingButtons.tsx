import { View, TouchableOpacity, StyleSheet } from "react-native";
import IconAbstain from "../icons/shared/icon-abstain";
import IconAye from "../icons/shared/icon-aye";
import IconNay from "../icons/shared/icon-nay";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import Svg, { Ellipse } from "react-native-svg";

const BottomVotingButtons = ({ swiperRef }: { swiperRef: any }) => {
	const colorStroke = useThemeColor({}, "stroke");
	return (
		<View style={[styles.bottomContainer, { borderColor: colorStroke }]}>
			<View
				style={{
					position: "absolute",
					width: "100%",
					height: "100%",
					bottom: 0,
					zIndex: 50,
				}}
			>
				<TabBarBackground />
			</View>
			<View
				style={{
					flexDirection: "row",
					justifyContent: "center",
					alignItems: "center",
					gap: 24,
					zIndex: 100,
					marginTop: 15,
				}}
			>
				<TouchableOpacity
					style={[
						styles.voteButton,
						{ backgroundColor: "#F53C3C", width: 50, height: 50 },
					]}
					onPress={() => swiperRef.current?.swipeLeft()}
				>
					<IconNay color="white" filled iconWidth={25} iconHeight={25} />
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.voteButton,
						{ backgroundColor: "#FFBF60", width: 40, height: 40 },
					]}
					onPress={() => swiperRef.current?.swipeTop()}
				>
					<IconAbstain color="white" iconWidth={20} iconHeight={20} />
				</TouchableOpacity>
				<TouchableOpacity
					style={[
						styles.voteButton,
						{ backgroundColor: "#2ED47A", width: 50, height: 50 },
					]}
					onPress={() => swiperRef.current?.swipeRight()}
				>
					<IconAye color="white" filled iconWidth={25} iconHeight={25} />
				</TouchableOpacity>
			</View>
		</View>
	);
};

function TabBarBackground() {
  return (
    <Svg width={"100%"} height={"100%"} fill={"#00000000"}>
      <Ellipse
        fill={"#000000"}
        cx={"50%"}
        cy={125} // 250/2
        rx={330} // 660/2
        ry={125} // 250/2
        stroke={"#666666"}
        strokeWidth={1}
      />
    </Svg>
  );
}

const styles = StyleSheet.create({
	bottomContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: "flex-end",
    alignItems: "center",
  },
	voteButton: {
		borderRadius: 100,
		justifyContent: "center",
		alignItems: "center",
	},
})

export default BottomVotingButtons;