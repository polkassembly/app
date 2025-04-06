import { REPUTATION_SCORES } from "@/lib/constants/reputationPoints";
import { useThemeColor } from "@/lib/hooks";
import { UserActivity } from "@/lib/net/queries/actions/type";
import { toTitleCase } from "@/lib/util/stringUtil";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { IconPoints } from "../../icons/icon-points";
import { ThemedText } from "../../shared/text/ThemedText";

const ActivityItem = ({ item }: { item: UserActivity }) => {
	const points = (REPUTATION_SCORES[item.name as keyof typeof REPUTATION_SCORES] as { value: number })?.value || 0;
	const color = points > 0 ? "green" : "red";
	const strokeColor = useThemeColor({}, "stroke")
	const secondaryBackgroundColor = useThemeColor({}, "secondaryBackground")

	const onPress = () => {
		if (item.proposalType && item.indexOrHash) {
			router.push(`/proposal/${item.indexOrHash}?proposalType=${item.proposalType}`);
		}
	}

	return (
		<TouchableOpacity style={[styles.activityItemContainer, { backgroundColor: secondaryBackgroundColor, borderColor: strokeColor }]} onPress={onPress}>
			<View style={{ flexDirection: "row", alignItems: "center" }}>
				<IconPoints color="white" iconWidth={24} iconHeight={24} style={{ marginRight: 8 }} />
				{points !== 0 &&
					<>
						<ThemedText type="bodyMedium3">Earned </ThemedText>
						<ThemedText type="bodyMedium3" style={{ color: color }}>{(points > 0 ? "+" : "-") + points}pts </ThemedText>
					</>
				}
				<ThemedText type="bodyMedium3">
					{toTitleCase(item.name.replaceAll("_", " "))}
				</ThemedText>
			</View>
			<Ionicons
				name="chevron-forward"
				size={20}
				color={strokeColor}
			/>
		</TouchableOpacity>
	);
}

const styles = StyleSheet.create({
	activityItemContainer: {
		flexDirection: "row",
		padding: 12,
		alignItems: "center",
		justifyContent: "space-between",
		borderRadius: 34,
		borderWidth: 1,
	}
});

export default ActivityItem;