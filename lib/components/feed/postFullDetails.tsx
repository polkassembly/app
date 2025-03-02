import { Post } from "@/lib/types";
import { ScrollView, StyleSheet, Touchable, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { ThemedText } from "../ThemedText";
import IconClose from "../icons/shared/icon-close";
import HorizontalSeparator from "../shared/HorizontalSeparator";
import { useGetUserByAddress } from "@/lib/net/queries/profile";
import { Skeleton } from "moti/skeleton";
import { ENetwork, EProposalStatus, EProposalType, IBeneficiary, IStatusHistoryItem, OnChainPostInfo } from "@/lib/types/post";
import { getFormattedDateTime } from "@/lib/util/dateUtil";
import IconEdit from "../icons/proposals/icon-edit";
import VerticalSeprator from "../shared/VerticalSeprator";
import { UserAvatar } from "../shared";
import { formatBnBalance } from "@/lib/util";
import { NETWORKS_DETAILS } from "@/lib/constants/networks";
import ProposalPeriodStatus from "./ProposalPeriodStatus";
import { pascalToNormal } from "@/lib/util/stringUtil";
import { Dayjs } from "dayjs";

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
					<TouchableOpacity onPress={onClose} style={{ padding: 5, paddingHorizontal: 10 }}>
						<IconClose iconWidth={14} iconHeight={14} color="#79767D" />
					</TouchableOpacity>
				</View>

				<HorizontalSeparator style={{ marginTop: 15, marginBottom: 25 }} />

				<View style={{ gap: 20 }}>
					<ProposerInfo address={post.onChainInfo?.proposer} amount={0} />
					<BenificiariesInfo benificiaries={post.onChainInfo?.beneficiaries || []} />
					<ProposalPeriodStatus proposal={post} />
					<Timeline timeline={post.onChainInfo?.timeline || []} proposalType={post.proposalType} />
					<OnChainInfo onChainInfo={post.onChainInfo} />
				</View>
			</ScrollView>
		</ThemedView>
	);
}

function UserInfo({ address, amount, assetId }: { address: string | undefined, amount?: string, assetId?: string | null }) {
	if (!address) return null;

	const { data: user, isLoading, isError } = useGetUserByAddress(address)

	if (isError) return (
		<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
			<View style={{ width: 24, height: 24, backgroundColor: "grey", borderRadius: 12 }} />
			<ThemedText type="bodySmall">User</ThemedText>
		</View>
	)
	if (isLoading || !user) return <Skeleton width={116} />

	return (
		<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
			<View style={{ width: 24, height: 24, borderRadius: 12 }}>
				{
					user.profileDetails.image ? (
						<UserAvatar avatarUrl={user.profileDetails.image} width={24} height={24} />
					) : (
						// Implement Identicon
						<UserAvatar avatarUrl="" width={24} height={24} />
					)
				}
			</View>
			<ThemedText type="bodySmall">{user?.username}</ThemedText>
			{
				amount && assetId && (
					<ThemedText>{"(" + formatBnBalance(amount, { withUnit: true, numberAfterComma: 2, compactNotation: true }, ENetwork.POLKADOT, assetId === NETWORKS_DETAILS[`${ENetwork.POLKADOT}`].tokenSymbol ? null : assetId) + ")"}</ThemedText>
				)
			}
		</View>
	)
}

function ProposerInfo({ address, amount }: { address: string | undefined; amount: number }) {
	return (
		<ThemedView type="background" style={styles.proposerInfo}>
			<View style={styles.flexRowJustifySpaceBetween}>
				<ThemedText type="bodyLarge">Proposer</ThemedText>
				<UserInfo address={address} />
			</View>
			{/* <View style={styles.flexRowJustifySpaceBetween}>
				<ThemedText type="bodyLarge">Deposit</ThemedText>
				<ThemedText type="bodySmall">{coins}</ThemedText>
			</View> */}
		</ThemedView>
	);
}

function BenificiariesInfo({ benificiaries }: { benificiaries: IBeneficiary[] }) {
	return (
		<ThemedView type="background" style={[styles.proposerInfo, styles.flexRowJustifySpaceBetween]}>
			<ThemedText type="bodyLarge">Benificiaries</ThemedText>
			<View style={{ flexDirection: "column", gap: 8 }}>
				{benificiaries.map((benificary) => (
					<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
						<UserInfo key={benificary.address} address={benificary.address} amount={benificary.amount} assetId={benificary.assetId} />
					</View>
				))}
			</View>
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
					<View style={{ gap: 16 }}>
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

function OnChainInfo({ onChainInfo }: { onChainInfo: OnChainPostInfo }) {
	return (
		<ThemedView type="background" style={styles.proposerInfo}>
			<ThemedText type="bodyMedium1">Metadata</ThemedText>

			<View style={{ flexDirection: "column", gap: 16, width: "100%" }}>
				<View style={{ flexDirection: "row" }}>
					<ThemedText style={{ width: "30%" }} type="bodySmall">Proposal Hash</ThemedText>
					<ThemedText style={{ flex: 1, flexWrap: "wrap" }} type="bodySmall">{onChainInfo.hash}</ThemedText>
				</View>
				<HorizontalSeparator />
				<View style={{ flexDirection: "row" }}>
					<ThemedText style={{ width: "30%" }} type="bodySmall">Origin</ThemedText>
					<ThemedText type="bodySmall">{pascalToNormal(onChainInfo.origin || "")}</ThemedText>
				</View>
				<HorizontalSeparator />
				{
					onChainInfo.createdAt && (
						<>
							<View style={{ flexDirection: "row" }}>
								<ThemedText style={{ width: "30%" }} type="bodySmall">Created At</ThemedText>
								<ThemedText type="bodySmall">{(new Date(onChainInfo.createdAt)).toLocaleDateString()}</ThemedText>
							</View>
							<HorizontalSeparator />
						</>
					)
				}

				<View style={{ flexDirection: "row" }}>
					<ThemedText style={{ width: "30%" }} type="bodySmall">Description</ThemedText>
					<ThemedText type="bodySmall">{onChainInfo.description}</ThemedText>
				</View>
				<HorizontalSeparator />

				<View style={{ flexDirection: "row" }}>
					<ThemedText style={{ width: "30%" }} type="bodySmall">Status</ThemedText>
					<ThemedText type="bodySmall">{pascalToNormal(onChainInfo.status)}</ThemedText>
				</View>
				<HorizontalSeparator />

			</View>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	sheet: {
		width: "100%",
		height: "81%",
		borderTopLeftRadius: 16,
		borderTopRightRadius: 16,
		paddingTop: 16,
		paddingHorizontal: 16
	},
	headerContainer: {
		flexDirection: "row",
		justifyContent: "space-between",
		alignItems: "center",
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