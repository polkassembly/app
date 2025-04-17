import { useThemeColor } from "@/lib/hooks";
import { Feather } from "@expo/vector-icons";
import { router } from "expo-router";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedText } from "../../shared/text/ThemedText";
import { useProposalByIndex } from "@/lib/net/queries/post";
import { formatTime } from "../../util/time";
import { ACTIVITY_MAP } from "@/lib/constants/ACTIVITY_MAP";
import { UserAvatar } from "../../shared";
import { useProfileStore } from "@/lib/store/profileStore";
import { IUserActivity } from "@/lib/types/user";
import { toSentenceCase } from "@/lib/util/stringUtil";

const ActivityItem = ({ item }: { item: IUserActivity }) => {
	const strokeColor = useThemeColor({}, "stroke")
	const secondaryBackgroundColor = useThemeColor({}, "secondaryBackground")
	const mediumTextColor = useThemeColor({}, "mediumText")
	const { data: proposal } = useProposalByIndex({
		proposalType: item.proposalType || "",
		indexOrHash: item.indexOrHash || ""
	})
	const userProfile = useProfileStore((state) => state.profile)

	const onPress = () => {
		if (item.proposalType && item.indexOrHash) {
			router.push(`/proposal/${item.indexOrHash}?proposalType=${item.proposalType}`);
		}
	}

	return (
		<View style={{ flexDirection: "row", gap: 8, flex: 1 }}>
			<TouchableOpacity style={[styles.activityItemContainer, { backgroundColor: secondaryBackgroundColor, borderColor: strokeColor }]} onPress={onPress}>
				<UserAvatar
					avatarUrl={userProfile?.profileDetails.image || ""}
					address={userProfile?.addresses.length ? userProfile?.addresses[0] : ""}
					width={32}
					height={32}
				/>
				<View style={{ gap: 8, flex: 1 }}>
					{ACTIVITY_MAP[item.name](item) ?? (
						<ThemedText type="bodySmall">{toSentenceCase(item.name.replaceAll("_", " "))}</ThemedText>
					)}
					{
						item.indexOrHash && item.proposalType && (
							<View style={{ flexDirection: "row", gap: 8, paddingRight: 40 }}>
								<View>
									<ThemedText
										type="bodySmall3"
										colorName="secondaryText"
										style={{ backgroundColor: "#EAEDF0", padding: 2, borderRadius: 4 }}
									>
										#{item.indexOrHash}
									</ThemedText>
								</View>
								{
									(item.metadata?.title || proposal?.title) && (
										<ThemedText
											type="bodySmall"
											colorName="mediumText"
											numberOfLines={2}
											ellipsizeMode="tail"
										>
											`{item.metadata?.title || proposal?.title || ""}`
										</ThemedText>
									)
								}
							</View>
						)
					}
					<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
						<Feather name="clock" color={mediumTextColor} size={16} />
						<ThemedText type="bodySmall" colorName="mediumText">{formatTime(new Date(item.createdAt))}</ThemedText>
					</View>
				</View>
			</TouchableOpacity>
		</View>
	);
}

const styles = StyleSheet.create({
	activityItemContainer: {
		flexDirection: "row",
		padding: 12,
		gap: 8,
		borderRadius: 12,
		borderWidth: 1,
		flex: 1
	}
});

export default ActivityItem;