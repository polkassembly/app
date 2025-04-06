import { Link, router } from "expo-router";
import { IconViewMore } from "../../icons/shared";
import ThemedButton from "../../ThemedButton";
import { ThemedText } from "../../ThemedText";
import { StyleSheet } from "react-native";
import { Post } from "@/lib/types";
import { useProposalStore } from "@/lib/store/proposalStore";

interface ViewMoreButtonProps {
	post: Post;
}

function ViewMoreButton({ post }: ViewMoreButtonProps) {
	return (
		<ThemedButton
		bordered
		style={styles.viewMoreButton} 
		onPress={() => {
			useProposalStore.getState().setProposal(post);
			router.push(`/proposal/${post.index}?proposalType=${post.proposalType}`);
		}}
		>
			<ThemedText type="bodySmall" colorName="accent">
				View More
			</ThemedText>
			<IconViewMore />
		</ThemedButton>
	);
}

const styles = StyleSheet.create({
	viewMoreButton: {
		borderRadius: 5,
		padding: 0,
		height: 40,
		flexDirection: "row",
		gap: 10,
	}
})

export default ViewMoreButton;