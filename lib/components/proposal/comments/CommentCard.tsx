import React, { useCallback, useEffect, useMemo, useState } from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import debounce from "lodash/debounce";
import { ICommentResponse, EReaction, UserProfile } from "@/lib/types";
import { UserAvatar } from "../../shared";
import { IconLike, IconDislike, IconComment } from "../../icons/shared";
import VerticalSeprator from "../../shared/View/VerticalSeprator";
import StackedAvatars from "../../feed/StackedAvatars";
import { extractUniqueChildrenAvatars } from "@/lib/util/commentUtil";
import CommentBox from "./CommentBox";
import useAddCommentReaction from "@/lib/net/queries/actions/useAddCommentReaction";
import useDeleteCommentReaction from "@/lib/net/queries/actions/useDeleteCommentReaction";
import { useProfileStore } from "@/lib/store/profileStore";
import { ThemedMarkdownDisplay } from "@/lib/components/shared";
import { ThemedButton } from "../../shared/button";
import { ThemedText } from "../../shared/text";
import IconReply from "../../icons/proposals/icon-reply";
import { useThemeColor } from "@/lib/hooks";
import dayjs from "dayjs";
import { formatTime } from "../../util/time";
import Toast from "react-native-toast-message";
import { useBottomSheet } from "@/lib/context/bottomSheetContext";
import ProfileCard from "../../profile/ProfileCard";

interface CommentCardProps {
	comment: ICommentResponse;
	commentDisabled?: boolean;
}

function CommentCard({ comment, commentDisabled }: CommentCardProps) {
	const userProfile = useProfileStore((state) => state.profile);
	const mediumTextColor = useThemeColor({}, "mediumText");

	// Local state to manage like/dislike actions
	const [isLiked, setIsLiked] = useState<boolean>(
		comment.reactions.filter((r) => r.reaction === EReaction.like && r.userId === userProfile?.id).length > 0
	);
	const [isDisliked, setIsDisliked] = useState<boolean>(
		comment.reactions.filter((r) => r.reaction === EReaction.dislike && r.userId === userProfile?.id).length > 0
	);
	const [likes, setLikes] = useState<number>(
		comment.reactions.filter((r) => r.reaction === EReaction.like).length
	);
	const [dislikes, setDislikes] = useState<number>(
		comment.reactions.filter((r) => r.reaction === EReaction.dislike).length
	);
	const [commentsCount, setCommentsCount] = useState<number>(
		comment.children?.length || 0
	);
	const [showReplyBox, setShowReplyBox] = useState<boolean>(false);
	const [showReplies, setShowReplies] = useState<boolean>(false);
	const [avatars, setAvatars] = useState<string[]>([]);
	// Flag to disable like/dislike buttons until processing is done
	const [processing, setProcessing] = useState<boolean>(false);
	// Store the reaction id for later deletion
	const [myReactionId, setMyReactionId] = useState<string | null>(null);

	const addReactionMutation = useAddCommentReaction();
	const deleteReactionMutation = useDeleteCommentReaction();
	const { openBottomSheet } = useBottomSheet();

	useEffect(() => {
		setAvatars(extractUniqueChildrenAvatars(comment));
	}, [comment]);

	// Debounced likehandler
	const handleLike = useCallback(
		debounce(() => {
			if (processing) return;
			setProcessing(true);

			if (isLiked) {
				// Remove like reaction
				if (!myReactionId) {
					setProcessing(false);
					return;
				}
				setLikes((prev) => (prev - 1 > 0 ? prev - 1 : 0));
				setIsLiked(false);

				deleteReactionMutation.mutate(
					{
						pathParams: {
							proposalType: comment.proposalType,
							postIndexOrHash: comment.indexOrHash,
							reactionId: myReactionId,
							commentId: comment.id,
						},
					},
					{
						onSuccess: () => {
							setMyReactionId(null);
						},
						onError: () => {
							setLikes((prev) => prev + 1);
							setIsLiked(true);
						},
						onSettled: () => setProcessing(false),
					}
				);
			} else {
				// Add like reaction
				if (isDisliked) {
					setDislikes((prev) => prev - 1);
					setIsDisliked(false);
				}
				setIsLiked(true);
				setLikes((prev) => prev + 1);

				addReactionMutation.mutate(
					{
						pathParams: {
							proposalType: comment.proposalType,
							postIndexOrHash: comment.indexOrHash,
							commentId: comment.id,
						},
						bodyParams: { reaction: EReaction.like },
					},
					{
						onSuccess: (data) => {
							// Save the reactionId returned by the API
							setMyReactionId(data.reactionId);
						},
						onError: () => {
							setLikes((prev) => prev - 1);
							setIsLiked(false);
						},
						onSettled: () => setProcessing(false),
					}
				);
			}
		}, 300),
		[
			processing,
			isLiked,
			isDisliked,
			comment.proposalType,
			comment.indexOrHash,
			comment.id,
			addReactionMutation,
			deleteReactionMutation,
			myReactionId,
		]
	);

	// Debounced dislike handler
	const handleDislike = useCallback(
		debounce(() => {
			if (processing) return;
			setProcessing(true);

			if (isDisliked) {
				// Remove dislike reaction
				if (!myReactionId) {
					setProcessing(false);
					return;
				}

				setDislikes((prev) => (prev - 1 > 0 ? prev - 1 : 0));
				setIsDisliked(false);

				deleteReactionMutation.mutate(
					{
						pathParams: {
							proposalType: comment.proposalType,
							postIndexOrHash: comment.indexOrHash,
							reactionId: myReactionId,
							commentId: comment.id,
						},
					},
					{
						onSuccess: () => {
							setMyReactionId(null);
						},
						onError: () => {
							setDislikes((prev) => (prev + 1 > 0 ? prev + 1 : 0));
							setIsDisliked(true);
						},
						onSettled: () => setProcessing(false),
					}
				);
			} else {
				setDislikes((prev) => prev + 1);
				setIsDisliked(true);

				// If like was active, remove it
				if (isLiked) {
					setLikes((prev) => (prev - 1 > 0 ? prev - 1 : 0));
					setIsLiked(false);
				}

				// Add dislike reaction
				addReactionMutation.mutate(
					{
						pathParams: {
							proposalType: comment.proposalType,
							postIndexOrHash: comment.indexOrHash,
							commentId: comment.id,
						},
						bodyParams: { reaction: EReaction.dislike },
					},
					{
						onSuccess: (data) => {
							setMyReactionId(data.reactionId);
						},
						onError: () => {
							setDislikes((prev) => (prev - 1 > 0 ? prev - 1 : 0));
							if (isLiked) {
								setLikes((prev) => prev + 1);
								setIsLiked(true);
							}
							setIsDisliked(false);
						},
						onSettled: () => setProcessing(false),
					}
				);
			}
		}, 300),
		[
			processing,
			isDisliked,
			isLiked,
			comment.proposalType,
			comment.indexOrHash,
			comment.id,
			addReactionMutation,
			deleteReactionMutation,
			myReactionId,
		]
	);

	const handleOpenProfile = async () => {
		const user = comment.user as UserProfile;
		if (!user) {
			Toast.show({
				type: "success",
				text1: `Address copied to clipboard`,
			})
			return;
		};
		openBottomSheet(
			<ProfileCard user={user} />
		);
	};

	const onToggleComment = () => {
		setShowReplyBox((prev) => !prev);
	};
	return (
		<View style={styles.mainContainer}>
			<View style={{ flexDirection: "column", alignItems: "center", gap: 10 }}>
				<TouchableOpacity onPress={handleOpenProfile}>
					<UserAvatar
						avatarUrl={comment.user.profileDetails.image}
						width={35}
						height={35}
					/>
				</TouchableOpacity>
				{!showReplies && <VerticalSeprator />}
				{!showReplies && (comment.children?.length || 0) > 0 && (
					<StackedAvatars avatars={avatars} />
				)}
			</View>
			<View style={styles.commentContainer}>
				<View style={styles.headerContainer}>
					<TouchableOpacity onPress={handleOpenProfile}>
						<ThemedText type="bodySmall">
							{comment.user.username}
						</ThemedText>
					</TouchableOpacity>
					<ThemedText type="bodySmall3" colorName="mediumText" >{formatTime(new Date(comment.createdAt))}</ThemedText>
				</View>
				<ThemedMarkdownDisplay
					content={comment.content}
					textColor="mediumText"
				/>

				{/* Comment actions */}
				<View style={styles.commentActionsContainer}>
					<ThemedButton
						onPress={handleLike}
						disabled={processing}
						style={[styles.iconButton, { backgroundColor: "transparent" }]}
					>
						<IconLike key={`liked-${isLiked}`} color={mediumTextColor} filled={isLiked} />
						<ThemedText type="bodySmall" colorName="mediumText">{likes}</ThemedText>
					</ThemedButton>
					<ThemedButton
						onPress={handleDislike}
						disabled={processing}
						style={[styles.iconButton, { backgroundColor: "transparent" }]}
					>
						<IconDislike key={`disliked-${isDisliked}`} color={mediumTextColor} filled={isDisliked} />
						<ThemedText type="bodySmall" colorName="mediumText">{dislikes}</ThemedText>
					</ThemedButton>
					{!commentDisabled && (
						<ThemedButton
							onPress={onToggleComment}
							style={[styles.iconButton, { backgroundColor: "transparent" }]}
						>
							<IconReply color={mediumTextColor} />
							<ThemedText type="bodySmall" colorName="mediumText">{commentsCount}</ThemedText>
						</ThemedButton>
					)}
				</View>
				{showReplyBox && (
					<CommentBox
						proposalIndex={comment.indexOrHash}
						proposalType={comment.proposalType}
						parentCommentId={comment.id}
						onCommentSubmitted={() => {
							setCommentsCount((prev) => prev + 1);
							setShowReplyBox(false);
						}}
					/>
				)}
				{showReplies && comment.children && comment.children.length > 0 && (
					<View style={styles.repliesContainer}>
						{comment.children.map((reply) => (
							<CommentCard comment={reply} key={reply.id} commentDisabled />
						))}
					</View>
				)}
				{comment.children && comment.children.length > 0 && (
					<ThemedButton
						onPress={() => setShowReplies((prev) => !prev)}
						text={showReplies ? "Hide Replies" : "Show Replies"}
						borderless
						style={{ alignSelf: "flex-start", marginTop: 5, padding: 0 }}
					/>
				)}
			</View>
		</View >
	);
}

const styles = StyleSheet.create({
	mainContainer: {
		flexDirection: "row",
	},
	commentContainer: {
		flex: 1,
		flexDirection: "column",
		marginLeft: 4,
	},
	headerContainer: {
		flexDirection: "row",
		alignItems: "center",
		gap: 4,
		marginVertical: 4,
	},
	commentActionsContainer: {
		flexDirection: "row",
		marginTop: 4,
	},
	iconButton: {
		height: 26,
		paddingHorizontal: 6,
		paddingVertical: 2,
		borderRadius: 6,
		justifyContent: "center",
		alignItems: "center",
		flexDirection: "row",
		marginRight: 8,
	},
	repliesContainer: {
		marginTop: 8,
		gap: 10,
	},
});

export default CommentCard;
