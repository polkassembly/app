import { StyleSheet, View } from "react-native";
import { IconProps } from "../../icons/types";
import { ThemedText } from "../../shared/text/ThemedText";

interface SectionHeaderProps {
	title: string;
	Icon: React.FunctionComponent<IconProps>;
	color: string;
}

function SectionHeader({ title, Icon, color }: SectionHeaderProps) {
	return (
		<View style={styles.sectionHeader}>
			<Icon color={color} />
			<ThemedText type="bodyMedium2">{title}</ThemedText>
		</View>
	);
}

const styles = StyleSheet.create({
	sectionHeader: {
		flexDirection: "row",
		alignItems: "center",
		gap: 8,
	},
});


export default SectionHeader;