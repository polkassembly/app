import { EReaction, Post, UserProfile } from "@/lib/types";
import { StyleSheet, View } from "react-native";
import ShareButton from "./ShareButton";
import { IconLike, IconDislike, IconComment } from "../../icons/shared";
import ThemedButton from "../../ThemedButton";
import { ThemedText } from "../../ThemedText";
import BookmarkButton from "./BookmarkButton";
import { useState } from "react";
import CommentBox from "../../feed/CommentBox";
import Toast from "react-native-toast-message";
import { useProfileStore } from "@/lib/store/profileStore";
import { useAddReaction, useDeleteReaction } from "@/lib/net/queries/actions";

interface ProposalActionsProps {
	post: Post
}

function ProposalActions({
	post
}: ProposalActionsProps) {

	const [isLiked, setIsLiked] = useState<boolean>(
		post.userReaction?.reaction === EReaction.like
	);
	const [isDisliked, setIsDisliked] = useState<boolean>(
		post.userReaction?.reaction === EReaction.dislike
	);
	const [likes, setLikes] = useState<number>(post.metrics.reactions.like);
	const [dislikes, setDislikes] = useState<number>(
		post.metrics.reactions.dislike
	);
	const [comments, setComments] = useState<number>(post.metrics.comments);
	const [showCommentBox, setShowCommentBox] = useState(false)

	const { mutate: addReaction } = useAddReaction();
	const { mutate: deleteReaction } = useDeleteReaction();
	const userProfile = useProfileStore((state) => state.profile);

	const handleLike = () => {
		if (isLiked) {
			deleteReaction({
				pathParams: {
					proposalType: post.proposalType,
					postIndexOrHash: post.index,
					reactionId: post.userReaction?.id || "",
				},
			});
			setLikes((prev) => prev - 1);
			setIsLiked(false);
		} else {
			addReaction({
				pathParams: {
					proposalType: post.proposalType,
					postIndexOrHash: post.index,
				},
				bodyParams: { reaction: EReaction.like },
			});
			setLikes((prev) => prev + 1);
			setIsLiked(true);
			if (isDisliked) {
				setDislikes((prev) => prev - 1);
				setIsDisliked(false);
			}
		}
	};

	const handleDislike = () => {
		if (isDisliked) {
			deleteReaction({
				pathParams: {
					proposalType: post.proposalType,
					postIndexOrHash: post.index,
					reactionId: post.userReaction?.id || "",
				},
			});
			setDislikes((prev) => prev - 1);
			setIsDisliked(false);
		} else {
			addReaction({
				pathParams: {
					proposalType: post.proposalType,
					postIndexOrHash: post.index,
				},
				bodyParams: { reaction: EReaction.dislike },
			});
			setDislikes((prev) => prev + 1);
			setIsDisliked(true);
			if (isLiked) {
				setLikes((prev) => prev - 1);
				setIsLiked(false);
			}
		}
	};

	const handleComment = () => {

		if (showCommentBox === true) {
			setShowCommentBox(false)
			return;
		}

		if (post.allowedCommentor && post.allowedCommentor === "none") {
			Toast.show({
				type: "error",
				text1: "Commenting is disabled",
				text2: "This post does not allow comments",
			})
			return;
		}
		if (post.allowedCommentor && post.allowedCommentor === "onchain_verified" && userProfile?.addresses.length === 0) {
			Toast.show({
				type: "error",
				text1: "Commenting is disabled",
				text2: "Only verified users can comment on this post",
			})
			return;
		}

		setShowCommentBox(true)
	}

	return (
		<>
			<View style={styles.flexRowJustifySpaceBetween}>
				<View style={styles.flexRowGap8}>
					<ThemedButton onPress={handleLike} buttonBgColor="selectedIcon" style={styles.iconButton}>
						<IconLike color="white" filled={isLiked} />
						<ThemedText type="bodySmall">{likes}</ThemedText>
					</ThemedButton>
					<ThemedButton onPress={handleDislike} buttonBgColor="selectedIcon" style={styles.iconButton}>
						<IconDislike color="white" filled={isDisliked} />
						<ThemedText type="bodySmall">{dislikes}</ThemedText>
					</ThemedButton>
					<ThemedButton onPress={handleComment} buttonBgColor="selectedIcon" style={styles.iconButton}>
						<IconComment color="white" filled={false} />
						<ThemedText type="bodySmall">{comments}</ThemedText>
					</ThemedButton>
				</View>
				<View style={styles.flexRowGap8}>
					<BookmarkButton proposalId={post.index} proposalType={post.proposalType} isSubscribed={post.userSubscriptionId !== undefined}/>
					<ShareButton proposalId={post.index} proposalTitle={post.title} />
				</View>
			</View>

			{
				showCommentBox && (
					<CommentBox
						proposalIndex={post.index}
						proposalType={post.proposalType}
						onCommentSubmitted={() => {
							setShowCommentBox(false)
							setComments((prev) => prev + 1)
						}}
					/>
				)
			}
		</>
	);
}

const styles = StyleSheet.create({
	flexRowJustifySpaceBetween: {
		flexDirection: "row",
		justifyContent: "space-between"
	},
	flexRowGap8: {
		flexDirection: "row",
		gap: 8
	},
	iconButton: {
		height: 26,
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		gap: 4,
	}
})

export default ProposalActions;