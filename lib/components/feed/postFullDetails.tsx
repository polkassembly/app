import { Post } from "@/lib/types";
import { ScrollView, StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import IconClose from "../icons/shared/icon-close";
import HorizontalSeparator from "../shared/HorizontalSeparator";
import { useGetUserByAddress } from "@/lib/net/queries/profile";
import { Skeleton } from "moti/skeleton";
import { EProposalStatus, EProposalType, IBeneficiary, IStatusHistoryItem } from "@/lib/types/post";
import { getFormattedDateTime } from "@/lib/util/dateUtil";
import IconEdit from "../icons/proposals/icon-edit";
import VerticalSeprator from "../shared/VerticalSeprator";

interface postFullDetailsProps {
	post: Post;
	onClose: () => void;
}

function PostFullDetails({ post, onClose }: postFullDetailsProps) {

	if (post.onChainInfo === undefined) return null;

	return (
		<ThemedView type="container" style={styles.sheet}>
			<ScrollView>
				<View style={styles.headerContainer}>
					<ThemedText type="titleSmall">Full Details</ThemedText>
					<TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
						<IconClose iconWidth={14} iconHeight={14} color="#79767D" />
					</TouchableOpacity>
				</View>

				<HorizontalSeparator style={{ marginTop: 15, marginBottom: 25 }} />

				<View style={{ gap: 20 }}>
					<ProposerInfo address={post.onChainInfo?.proposer} coins={7000000} />
					<BenificiariesInfo benificiaries={post.onChainInfo?.beneficiaries || []} />
					<Timeline timeline={post.onChainInfo?.timeline || []} proposalType={post.proposalType} />
				</View>
			</ScrollView>
		</ThemedView>
	);
}

function OnChainUserInfo({ address }: { address: string | undefined }) {
	if (!address) return null;

	const { data, isLoading, isError } = useGetUserByAddress({
		pathParams: {
			address
		}
	})

	if (isError) return (
		<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
			<ThemedText type="bodySmall">User</ThemedText>
			<View style={{ width: 24, height: 24, backgroundColor: "grey", borderRadius: 12 }} />
		</View>
	)
	if (isLoading || !data) return <Skeleton width={116} />

	return (
		<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
			<ThemedText type="bodySmall">{data?.username}</ThemedText>
			{/* Implement identicon */}
			<View style={{ width: 24, height: 24, backgroundColor: "grey" }} />
		</View>
	)
}

function ProposerInfo({ address, coins }: { address: string | undefined; coins: number }) {
	return (
		<ThemedView type="background" style={styles.proposerInfo}>
			<View style={styles.flexRowJustifySpaceBetween}>
				<ThemedText type="bodyLarge">Proposer</ThemedText>
				<OnChainUserInfo address={address} />
			</View>
			<View style={styles.flexRowJustifySpaceBetween}>
				<ThemedText type="bodyLarge">Coins</ThemedText>
				<ThemedText type="bodySmall">{coins}</ThemedText>
			</View>
		</ThemedView>
	);
}

function BenificiariesInfo({ benificiaries }: { benificiaries: IBeneficiary[] }) {
	return (
		<ThemedView type="background" style={styles.proposerInfo}>
			<ThemedText type="bodyLarge">Benificiaries</ThemedText>
			{benificiaries.map((benificary) => (
				<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
					<OnChainUserInfo key={benificary.address} address={benificary.address} />
				</View>
			))}
		</ThemedView>
	);
}

interface TimelineItemProps {
	timeline: IStatusHistoryItem[];
	proposalType: EProposalType;
}
function Timeline({ timeline, proposalType }: TimelineItemProps) {
	return (
		<ThemedView type="background" style={styles.proposerInfo}>
			<ThemedText type="bodyLarge">Timeline</ThemedText>
			<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
				<View style={{ gap: 8, flexDirection: "column", alignItems: "center" }}>
					<IconEdit iconWidth={18} iconHeight={18} />
					<VerticalSeprator style={{ backgroundColor: "#E5007A" }} />
				</View>

				<View style={{ flexDirection: "column", gap: 15, flex: 1 }}>
					<ThemedText type="bodyLarge" colorName="accent">{proposalType}</ThemedText>
					<View>
						{timeline.map((item) => (
							<View key={item.timestamp + item.status} style={{ gap: 8 }}>
								<TimelineItem item={item} />
								<HorizontalSeparator />
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
	sheet: {
		width: "100%",
		height: "81%",
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		paddingTop: 16,
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
		marginHorizontal: 16,
	},
	proposerInfo: {
		padding: 12,
		borderRadius: 12,
		borderColor: "#383838",
		borderWidth: 1,
		gap: 20,
	},
	flexRowJustifySpaceBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
	}
});

export default PostFullDetails;