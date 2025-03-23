import { IStatusHistoryItem, EProposalType } from "@/lib/types";
import { EProposalStatus } from "@/lib/types/post";
import { getFormattedDateTime } from "@/lib/util/dateUtil";
import { StyleSheet, View } from "react-native";
import IconEdit from "../../icons/proposals/icon-edit";
import HorizontalSeparator from "../../shared/HorizontalSeparator";
import VerticalSeprator from "../../shared/VerticalSeprator";
import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";

interface TimelineItemProps {
	timeline: IStatusHistoryItem[];
	proposalType: EProposalType;
}
function Timeline({ timeline, proposalType }: TimelineItemProps) {
	return (
		<ThemedView type="background" style={styles.container}>
			<ThemedText type="bodyLarge">Timeline</ThemedText>
			<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
				<View style={{ flexDirection: "column", alignItems: "center" }}>
					<IconEdit iconWidth={18} iconHeight={18} />
					<VerticalSeprator style={{ backgroundColor: "#E5007A", marginTop: 8 }} />
					<View style={styles.timelineDot} />
				</View>

				<View style={{ flexDirection: "column", gap: 15, flex: 1 }}>
					<ThemedText type="bodyLarge" colorName="accent">{proposalType}</ThemedText>
					<View style={{ gap: 16, marginBottom: 8 }}>
						{timeline.map((item, i) => (
							<View key={item.timestamp + item.status} style={{ gap: 8 }}>
								<TimelineItem item={item} />
								{
									i !== timeline.length - 1 && <HorizontalSeparator />
								}
							</View>
						))}
					</View>
				</View>
			</View>
		</ThemedView>
	)
}

function TimelineItem({ item }: { item: IStatusHistoryItem }) {
	const dateText = getFormattedDateTime(new Date(item.timestamp));
	return (
		<View style={{ flexDirection: "row", gap: 8, alignItems: "center", justifyContent: "space-between" }}>
			<ThemedText type="bodySmall">{dateText}</ThemedText>
			<TimelineItemStatus status={item.status} />
		</View>
	)
}

function TimelineItemStatus({ status }: { status: EProposalStatus }) {
	const colorMap: Partial<Record<EProposalStatus, string>> = {
		[EProposalStatus.Submitted]: "#5BC044",
		[EProposalStatus.Deciding]: "#FF6700",
		[EProposalStatus.ConfirmStarted]: "#407AFC",
		[EProposalStatus.Confirmed]: "#5BC044",
		[EProposalStatus.Rejected]: "#FF0000",
		[EProposalStatus.DecisionDepositPlaced]: "#666666",
		[EProposalStatus.Proposed]: "#407AFC",
		[EProposalStatus.Awarded]: "#5100B9",
	}
	return (
		<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
			<ThemedText type="bodySmall" style={{ backgroundColor: colorMap[status] || "#666666", paddingHorizontal: 4, paddingVertical: 2, borderRadius: 4 }}>{status}</ThemedText>
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		padding: 12,
		borderRadius: 12,
		borderColor: "#383838",
		borderWidth: 1,
		gap: 20,
	},
	timelineDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: '#E5007A',
  },
});

export default Timeline;