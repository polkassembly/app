import { useThemeColor } from "@/lib/hooks";
import Slider from "@react-native-community/slider";
import { View, Platform } from "react-native";
import { ThemedText } from "../../ThemedText";

interface ConvictionSliderProps {
	conviction: number;
	onConvictionChange: (value: number) => void;
}

function ConvictionSlider({ conviction, onConvictionChange }: ConvictionSliderProps) {
	const STEPS = 6;
	const transformOut = (value: number) => Math.round(value * STEPS);
	const transformIn = (value: number) => value / STEPS;
	const color = useThemeColor({}, "accent");

	return (
		<View>
			<Slider
				style={{ width: "100%", height: 20 }}
				value={transformIn(conviction)}
				thumbImage={require("@/assets/images/slider-thumb.png")}
				tapToSeek={true}
				minimumTrackTintColor={color}
				maximumTrackTintColor="#39383A"
				step={1 / STEPS}
				onSlidingComplete={(value: number) => onConvictionChange(transformOut(value))}
			/>
			<View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
				<ThemedText type="bodyMedium3">0.1x</ThemedText>
				<ThemedText type="bodyMedium3">1x</ThemedText>
				<ThemedText type="bodyMedium3">2x</ThemedText>
				<ThemedText type="bodyMedium3">3x</ThemedText>
				<ThemedText type="bodyMedium3">4x</ThemedText>
				<ThemedText type="bodyMedium3">5x</ThemedText>
				<ThemedText type="bodyMedium3">6x</ThemedText>
			</View>
		</View>
	);
}

export default ConvictionSlider;