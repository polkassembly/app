import { useThemeColor } from "@/lib/hooks";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import IconArrowRightEnclosed from "../../icons/icon-arrow-right-enclosed";
import { ThemedText } from "../../shared/text";

interface SeeDetailsProps {
	setOpen: (open: boolean) => void;
}

function SeeDetails({ setOpen }: SeeDetailsProps) {
	const backgroundColor = useThemeColor({}, "background");

	return (
		<TouchableOpacity onPress={() => setOpen(true)}>
			<View
				style={[
					styles.box,
					{
						flexDirection: "row",
						paddingHorizontal: 16,
						paddingVertical: 16,
						backgroundColor: backgroundColor,
						alignItems: "center",
						justifyContent: "space-between",
						gap: 16,
					},
				]}
			>
				<ThemedText type="bodyMedium1">See Full Details</ThemedText>
				<IconArrowRightEnclosed iconWidth={30} iconHeight={30} color="#FFF" />
			</View>
		</TouchableOpacity>
	);
}
const styles = StyleSheet.create({
	box: {
		borderColor: Colors.dark.stroke,
		borderWidth: 1,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderRadius: 12,
	},
});

export default SeeDetails;