import { View, TouchableOpacity, StyleSheet } from "react-native";
import IconAbstain from "../../icons/shared/icon-abstain";
import IconAye from "../../icons/shared/icon-aye";
import IconNay from "../../icons/shared/icon-nay";
import { IconProps } from "../../icons/types";
import { ThemedText } from "../../shared/text/ThemedText";
import { useThemeColor } from "@/lib/hooks";
import { Vote } from "@/lib/types/voting";

interface TriStateButtonsProps {
	selected: Vote;
	onSelectionChanged: (next: Vote) => void;
}

function TriStateButtons({ selected, onSelectionChanged }: TriStateButtonsProps) {
	const colorAye = "#2ED47A";
	const colorNay = "#F53C3C";
	const colorAbstain = "#FFA013";
	return (
		<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
			<TriStateButton
				Icon={IconAye}
				color={colorAye}
				selected={selected === "aye"}
				onPress={() => onSelectionChanged("aye")}
			>
				AYE
			</TriStateButton>
			<TriStateButton
				Icon={IconNay}
				color={colorNay}
				selected={selected === "nay"}
				onPress={() => onSelectionChanged("nay")}
			>
				NAY
			</TriStateButton>
			<TriStateButton
				Icon={IconAbstain}
				color={colorAbstain}
				selected={selected === "splitAbstain"}
				onPress={() => onSelectionChanged("splitAbstain")}
			>
				ABSTAIN
			</TriStateButton>
		</View>
	);
}

interface TriStateButtonProps {
	selected: boolean;
	Icon: React.FunctionComponent<IconProps>;
	color: string;
	onPress: () => void;
	children: string;
}

function TriStateButton({ color, Icon, selected, onPress, children }: TriStateButtonProps) {
	
	const backgroundColor = useThemeColor({}, "secondaryBackground")
	return (
		<TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
			<View
				style={[
					styles.triStateButton,
					{ backgroundColor: selected ? color : backgroundColor },
				]}
			>
				<Icon color={selected ? backgroundColor : color} />
				<ThemedText
					darkColor={selected ? backgroundColor : color}
					lightColor={selected ? backgroundColor : color}
					type="bodySmall"
				>
					{children}
				</ThemedText>
			</View>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	triStateButton: {
		flexDirection: "row",
		gap: 8,
		paddingHorizontal: 16,
		paddingVertical: 2,
		borderRadius: 16,
		alignItems: "center",
		justifyContent: "center",
	},
});

export default TriStateButtons;