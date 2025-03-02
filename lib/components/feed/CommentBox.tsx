import { View, TextInput, StyleSheet } from "react-native";
import { EProposalType, Post, UserProfile } from "@/lib/types";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useState } from "react";
import { useAddComment } from "@/lib/net/queries/actions";
import { UserAvatar } from "../shared";
import ThemedButton from "../ThemedButton";
import { ThemedText } from "../ThemedText";
import { useProfileStore } from "@/lib/store/profileStore";


function CommentBox({
  proposalType,
  proposalIndex,
	onCommentSubmitted,
	parentCommentId
}: {
  proposalType: EProposalType;
  proposalIndex: string;
	onCommentSubmitted: ({ comment }: { comment?: string }) => void;
	parentCommentId?: string;
}) {

	const [comment, setComment] = useState<string>("")
	const userInfo = useProfileStore((state) => state.profile)
	const { mutate: addComment } = useAddComment();

	const handleSubmitComment = async () => {
		if (!comment.trim()) return;
		addComment({
			pathParams: {
				proposalType: proposalType,
				postIndexOrHash: proposalIndex,
			},
			bodyParams: { 
				content: comment,
				parentCommentId: parentCommentId,
			},
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
				<View style={{ paddingVertical: 4, paddingLeft: 4 }}>
					<UserAvatar avatarUrl={userInfo?.profileDetails.image} width={24} height={24} />
				</View>
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