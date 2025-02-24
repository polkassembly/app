import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import RenderHTML from "react-native-render-html";
import { ICommentResponse } from "@/lib/types";
import { UserAvatar } from "../shared";
import ThemedButton from "../ThemedButton";
import { IconLike, IconDislike, IconComment } from "../icons/shared";
import { ThemedText } from "../ThemedText";
import CommentBox from "./CommentBox";
import useAddComment from "@/lib/net/queries/actions/useAddComment";
import { Colors } from "@/lib/constants/Colors";
import VerticalSeprator from "../shared/VerticalSeprator";
import StackedAvatars from "./StackedAvatars";
import { extractUniqueChildrenAvatars } from "@/lib/util/commentUtil";

interface CommentCardProps {
	comment: ICommentResponse;
}

export default function CommentCard({ comment }: CommentCardProps) {
	const [isLiked, setIsLiked] = useState<boolean>(false);
	const [isDisliked, setIsDisliked] = useState<boolean>(false);
	const [likes, setLikes] = useState<number>(0);
	const [dislikes, setDislikes] = useState<number>(0);
	const [commentsCount, setCommentsCount] = useState<number>(comment.children?.length || 0);

	const [showReplyBox, setShowReplyBox] = useState<boolean>(false);
	const [replyText, setReplyText] = useState<string>("");
	const { mutate: addReply, isSuccess: isReplySuccess } = useAddComment();

	const [showReplies, setShowReplies] = useState<boolean>(false);
	const [avatars, setAvatars] = useState<string []>([])

	useEffect(()=>{
		setAvatars(extractUniqueChildrenAvatars(comment))
		
	}, [comment])

	const onLike = () => {
		if (isLiked) {
			setLikes(likes - 1);
			setIsLiked(false);
		} else {
			setLikes(likes + 1);
			setIsLiked(true);
			if (isDisliked) {
				setDislikes(dislikes - 1);
				setIsDisliked(false);
			}
		}
	};

	const onDislike = () => {
		if (isDisliked) {
			setDislikes(dislikes - 1);
			setIsDisliked(false);
		} else {
			setDislikes(dislikes + 1);
			setIsDisliked(true);
			if (isLiked) {
				setLikes(likes - 1);
				setIsLiked(false);
			}
		}
	};

	const onToggleComment = () => {
		setShowReplyBox(!showReplyBox);
	};

	const onSubmitReply = () => {
		if (replyText.trim() === "") return;

		addReply({
			pathParams: { proposalType: comment.proposalType, postIndexOrHash: comment.indexOrHash },
			bodyParams: { content: replyText.trim(), parentCommentId: comment.address || "" }
		})

		setReplyText("");
		setShowReplyBox(false);
		setCommentsCount(commentsCount + 1);
	};

	return (
		<View style={styles.mainContainer}>
			<View style={{flexDirection: "column", alignItems: "center", gap: 10}}>
				<UserAvatar
					avatarUrl={comment.user.profileDetails.image}
					width={35}
					height={35}
				/>
				{
					!showReplies && <VerticalSeprator />
				}
				{
					!showReplies && (comment.children?.length || 0) > 0 &&
					<StackedAvatars avatars={avatars} />
				}
			</View>
			<View style={styles.commentContainer}>
				<View style={styles.headerContainer}>
					<ThemedText style={{ marginTop: 3}} type="bodySmall">{comment.user.username.toUpperCase()}</ThemedText>
				</View>
				<RenderHTML
					source={{ html: comment.htmlContent }}
					contentWidth={300}
					baseStyle={{ color: Colors.dark.mediumText }}
				/>
				<View style={styles.commentActionsContainer}>
					<ThemedButton onPress={onLike} buttonBgColor="selectedIcon" style={styles.iconButton}>
						<IconLike color="white" filled={isLiked} />
						<ThemedText type="bodySmall">{likes}</ThemedText>
					</ThemedButton>
					<ThemedButton onPress={onDislike} buttonBgColor="selectedIcon" style={styles.iconButton}>
						<IconDislike color="white" filled={isDisliked} />
						<ThemedText type="bodySmall">{dislikes}</ThemedText>
					</ThemedButton>
					<ThemedButton onPress={onToggleComment} buttonBgColor="selectedIcon" style={styles.iconButton}>
						<IconComment color="white" filled={false} />
						<ThemedText type="bodySmall">{commentsCount}</ThemedText>
					</ThemedButton>
				</View>
				{showReplyBox && (
					<CommentBox
						commentText={replyText}
						onChangeCommentText={setReplyText}
						onSubmitComment={onSubmitReply}
						userAvatarUrl={comment.user.profileDetails.image}
						isUserInfoLoading={false}
						isUserInfoError={false}
					/>
				)}
				{showReplies && comment.children && comment.children.length > 0 && (
					<View style={styles.repliesContainer}>
						{comment.children.map((reply) => (
							<CommentCard comment={reply} key={reply.id} />
						))}
					</View>
				)}
				{comment.children && comment.children.length > 0 && (
					<ThemedButton
						onPress={() => setShowReplies(!showReplies)}
						text={showReplies ? "Hide Replies" : "Show Replies"}
						borderless
						style={{ alignSelf: "flex-start", marginTop: 5, padding: 0}}
					/>
				)}
			</View>
		</View>
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
		justifyContent: "space-between",
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
		gap: 10
	},
});
