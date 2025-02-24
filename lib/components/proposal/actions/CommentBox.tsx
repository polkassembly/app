import { View, TextInput, StyleSheet } from "react-native";
import ThemedButton from "../../ThemedButton";
import { ThemedText } from "../../ThemedText";
import { UserAvatar } from "../../shared";
import { Post, UserProfile } from "@/lib/types";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useState } from "react";
import { useAddComment } from "@/lib/net/queries/actions";


function CommentBox({
	userInfo,
	post,
	onCommentSubmitted,
}: {
	post: Post;
	userInfo: UserProfile | undefined;
	onCommentSubmitted: ({ comment } : { comment? : string }) => void;
}) {

	const [comment, setComment] = useState<string>("")
	const { mutate: addComment } = useAddComment();

	const handleSubmitComment = () => {
			if (!comment.trim()) return;
			addComment({
				pathParams: {
					proposalType: post.proposalType,
					postIndexOrHash: post.index,
				},
				bodyParams: { content: comment },
			});
			setComment("");
			onCommentSubmitted({ comment })
		};

	const colorStroke = useThemeColor({}, "stroke")
	const colorText = useThemeColor({}, "text")
	const colorAccent = useThemeColor({}, "accent")

	return (
		<View style={[styles.commentBox, { borderColor: colorStroke, borderWidth: 1, borderRadius: 24 }]}>
			{
				userInfo && 
				<UserAvatar avatarUrl={userInfo?.profileDetails.image} width={25} height={25} />
			}
			<TextInput
				style={[styles.commentInput, { color: colorText }]}
				placeholder="Add a comment"
				placeholderTextColor="#FFFFFF"
				value={comment}
				onChangeText={setComment}
			/>
			<ThemedButton onPress={handleSubmitComment} style={[styles.submitButton, { backgroundColor: colorAccent }]}>
				<ThemedText type="bodySmall" style={{ color: colorText }}>
					Post
				</ThemedText>
			</ThemedButton>
		</View>
	);
}

const styles = StyleSheet.create({
	commentBox: {
		flexDirection: "row",
		alignItems: "center",
		marginTop: 12,
		overflow: "hidden",
	},
	commentInput: {
		flex: 1,
		paddingVertical: 4,
		paddingHorizontal: 8,
		fontSize: 14,
	},
	submitButton: {
		paddingHorizontal: 15,
		paddingVertical: 4,
		borderRadius: 0,
		height: "100%",
	},
})

export default CommentBox;