import { IconBookmark } from "../../icons/shared";
import ThemedButton from "../../ThemedButton";
import { StyleSheet } from "react-native";
import { EProposalType } from "@/lib/types";
import { useIsSubscribedProposal } from "@/lib/net/queries/post";
import { useSubscribeProposal, useUnsubscribeProposal } from "@/lib/net/queries/actions";

function BookmarkButton({ proposalId, proposalType, isSubscribed }: { proposalId: string; proposalType: EProposalType, isSubscribed: boolean }) {

	const { mutate: subscribeProposal, isPending: isSubscribing } = useSubscribeProposal();
	const { mutate: unsubscribeProposal, isPending: isUnsubscribing } = useUnsubscribeProposal();

	const handleBookmark = () => {
		if (isSubscribed) {
			unsubscribeProposal(
				{ pathParams: { postIndexOrHash: proposalId, proposalType: proposalType } }
			);
		} else {
			subscribeProposal(
				{ pathParams: { postIndexOrHash: proposalId, proposalType: proposalType } }
			);
		}
	};

	return (
		<ThemedButton
			onPress={handleBookmark}
			buttonBgColor="selectedIcon"
			style={styles.iconButton}
			disabled={ isSubscribing || isUnsubscribing} // Prevent spamming
		>
			<IconBookmark color="white" filled={!!isSubscribed} />
		</ThemedButton>
	);
}

const styles = StyleSheet.create({
	iconButton: {
		height: 26,
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		gap: 4,
	},
});

export default BookmarkButton;
