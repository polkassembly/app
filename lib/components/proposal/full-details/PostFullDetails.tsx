/**
 * @component PostFullDetails
 * 
 * @description 
 * This component displays the full details of a proposal. If an initial `post` is 
 * provided, it is used for display until the full details are fetched using 
 * `useProposalByIndex`. The UI updates dynamically once the full proposal details 
 * become available.
 * 
 * @prop {Post} [post] - (Optional) The initial proposal data received from the activity feed.
 * @prop {EProposalType} proposalType - The type of the proposal.
 * @prop {string} indexOrHash - The unique identifier for the proposal.
 * @prop {() => void} onClose - Function to close the full details modal.
 * 
 * @prefetching
 * To ensure a smooth display, the following queries should be prefetched:
 * - `useProposalByIndex({ proposalType, indexOrHash })` to fetch the full details of the proposal.
 * - `useGetUserByAddress(address)` to fetch the user details (e.g., proposer and beneficiaries).
 */

import { EProposalType, Post } from "@/lib/types";
import { ScrollView, StyleSheet, TouchableOpacity, View } from "react-native";
import { ThemedView } from "../../ThemedView";
import { ThemedText } from "../../ThemedText";
import IconClose from "../../icons/shared/icon-close";
import HorizontalSeparator from "../../shared/HorizontalSeparator";
import { Skeleton } from "moti/skeleton";
import ProposalPeriodStatus from "../../feed/ProposalPeriodStatus";
import { useProposalByIndex } from "@/lib/net/queries/post";
import { useEffect, useState } from "react";
import Timeline from "./Timeline";
import OnChainInfo from "./OnChainInfo";
import { ProposerInfo, BenificiariesInfo } from "./UserInfo";

interface postFullDetailsProps {
	post?: Post;
	proposalType: EProposalType;
	indexOrHash: string;
	onClose: () => void;
}

function PostFullDetails({ indexOrHash, post, proposalType, onClose }: postFullDetailsProps) {
	const [proposal, setProposal] = useState<Post>(post || {} as Post);
	const { data: prposal, isLoading } = useProposalByIndex({ proposalType, indexOrHash });

	useEffect(() => {
		if (prposal) {
			setProposal(prposal);
		}
	}, [prposal]);

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

				{
					proposal?.onChainInfo === undefined ? (
						<Skeleton height={100} />
					) : (
						<View style={{ gap: 20 }}>
							<ProposerInfo address={proposal.onChainInfo?.proposer} amount={0} />
							<BenificiariesInfo benificiaries={proposal.onChainInfo?.beneficiaries || []} />
							<ProposalPeriodStatus proposal={proposal} />
							<Timeline timeline={proposal.onChainInfo?.timeline || []} proposalType={proposal.proposalType} />
							<OnChainInfo onChainInfo={proposal.onChainInfo} />
						</View>
					)
				}
			</ScrollView>
		</ThemedView>
	);
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
});

export default PostFullDetails;