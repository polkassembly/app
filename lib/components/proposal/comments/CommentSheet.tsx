import { ScrollView, View, TouchableOpacity, StyleSheet, TextInput } from "react-native"
import IconClose from "../../icons/shared/icon-close"
import { ThemedText } from "../../shared/text"
import { HorizontalSeparator, ThemedView, VerticalSeprator } from "../../shared/View"
import { EPostOrigin, EProposalType, UserProfile } from "@/lib/types"
import { useProfileStore } from "@/lib/store/profileStore"
import { UserAvatar } from "../../shared"
import OriginBadge from "../card/body/OriginBadge"
import TimeDisplay from "../card/body/TimeDisplay"
import { useThemeColor } from "@/lib/hooks"
import CommentBox from "./CommentBox"
import { useAddComment } from "@/lib/net/queries/actions"
import { AddCommentBody } from "@/lib/net/queries/actions/useAddComment"
import { useState } from "react"
import { ThemedButton } from "../../shared/button"

interface CommentSheetProps {
	author: UserProfile;
	isReply?: boolean;
	proposalTitle?: string;
	proposalType: EProposalType
	proposalIndex: string;
	createdAt?: string;
	parentComment?: string;
	parentCommentId?: string;
	postOrigin?: EPostOrigin;
	onClose: () => void;
	onCommentSubmitted?: ({ comment }: { comment?: string }) => void;
}

const CommentSheet = ({ author, isReply, proposalTitle, proposalIndex, proposalType, postOrigin, createdAt, parentComment, parentCommentId, onClose }: CommentSheetProps) => {
	const user = useProfileStore((state) => state.profile)
	const textColor = useThemeColor({}, "text")
	const mediumTextColor = useThemeColor({}, "mediumText")

	const [comment, setComment] = useState<string>("")
	const { mutate: addComment } = useAddComment();
	const colorText = useThemeColor({}, "text")

	const handleSubmitComment = async () => {
		if (!comment.trim()) return;

		const bodyParam = { content: comment } as AddCommentBody
		if (parentCommentId) bodyParam["parentCommentId"] = parentCommentId
		console.log("bodyParam", bodyParam, "proposalType", proposalType, "proposalIndex", proposalIndex)
		addComment({
			pathParams: {
				proposalType: proposalType,
				postIndexOrHash: proposalIndex,
			},
			bodyParams: bodyParam,
		},
		);

		setComment("");
		onClose();
	};

	return (
		<ThemedView type="container" style={styles.sheet}>
			<ScrollView>
				<View style={styles.headerContainer}>
					<ThemedText type="titleSmall">{isReply ? "Add reply" : "Add comment"}</ThemedText>
					<TouchableOpacity onPress={onClose} style={{ padding: 5, paddingHorizontal: 10 }}>
						<IconClose iconWidth={14} iconHeight={14} color="#79767D" />
					</TouchableOpacity>
				</View>

				<HorizontalSeparator style={{ marginTop: 15, marginBottom: 25 }} />
				<View style={{ marginBottom: 20 }}>
					<View style={{ flexDirection: "row", gap: 12, marginBottom: 12 }}>
						<View style={{ alignItems: "center", gap: 12 }}>
							<UserAvatar
								avatarUrl={author?.profileDetails?.image}
								width={46}
								height={46}
							/>
							<VerticalSeprator style={{ backgroundColor: textColor }} />
						</View>
						<View style={{ gap: 6, flex: 1 }}>
							<View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
								<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
									<ThemedText type="bodySmall">{author?.username || "User"}</ThemedText>
									{postOrigin && (
										<>
											<ThemedText type="bodySmall3" colorName="mediumText">
												in
											</ThemedText>
											<OriginBadge origin={postOrigin} />
										</>
									)}
								</View>
								<View style={{ width: 1, height: 16, backgroundColor: "#383838" }} />
								{createdAt && <TimeDisplay createdAt={createdAt} />}
							</View>
							<ThemedText type="bodySmall" colorName="ctaText">
								{isReply ? "Replying to" : "Commenting on Proposal"}
							</ThemedText>
							<ThemedText
								type="bodyMedium2"
								numberOfLines={3}
								ellipsizeMode="tail"
								style={{ letterSpacing: 1.25, marginRight: 16 }}
							>
								{isReply ? parentComment : "#" + proposalIndex + " " + proposalTitle}
							</ThemedText>
						</View>
					</View>
					<View style={{ flexDirection: "row", gap: 12 }}>
						<UserAvatar
							avatarUrl={user?.profileDetails?.image || ""}
							width={46}
							height={46}
						/>
						<View style={styles.inputContainer}>
							<ThemedText type="bodySmall">{user?.username || "User"}</ThemedText>
							<TextInput
								style={[styles.commentInput, { color: colorText }]}
								placeholder={isReply ? "Add a reply" : "Add a comment"}
								placeholderTextColor={mediumTextColor}
								value={comment}
								onChangeText={setComment}
								multiline={true}
								textAlignVertical="top"
								numberOfLines={5}
							/>
						</View>
					</View>
					<View style={{ justifyContent: "flex-end", alignItems: "flex-end" }}>
						<View style={{ width: 64 }}>
							<ThemedButton text="post" style={{ paddingVertical: 2 }} onPress={handleSubmitComment} />
						</View>
					</View>
				</View>
			</ScrollView>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	sheet: {
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
	inputContainer: {
		flex: 1,
	},
	commentInput: {
		paddingVertical: 8,
		paddingHorizontal: 8,
		fontSize: 14,
		minHeight: 80,
		textAlignVertical: 'top',
		width: '100%',
		marginTop: 4,
	},
});

export default CommentSheet