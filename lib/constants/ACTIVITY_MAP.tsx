import { EActivityName } from "@/lib/net/queries/actions/type";
import { Ionicons, Feather, MaterialIcons, FontAwesome5 } from "@expo/vector-icons";
import { View, Text } from "react-native";
import React from "react";
import { ThemedText } from "../components/shared/text";

export const ACTIVITY_MAP: Record<EActivityName, React.ReactNode> = {
	[EActivityName.VOTED_ON_PROPOSAL]: (
		<ThemedText type="bodySmall1">Voted on a proposal</ThemedText>
	),
	[EActivityName.CREATED_PROPOSAL]: (
		<ThemedText type="bodySmall1">Created a proposal</ThemedText>
	),
	[EActivityName.COMMENTED_ON_POST]: (
		<ThemedText type="bodySmall1">Commented on a post</ThemedText>
	),
	[EActivityName.REPLIED_TO_COMMENT]: (
		<ThemedText type="bodySmall1">Replied to a comment</ThemedText>
	),
	[EActivityName.REACTED_TO_POST]: (
		<ThemedText type="bodySmall1">Reacted to a post</ThemedText>
	),
	[EActivityName.REACTED_TO_COMMENT]: (
		<ThemedText type="bodySmall1">Reacted to a comment</ThemedText>
	),
	[EActivityName.ADDED_CONTEXT_TO_PROPOSAL]: (
		<ThemedText type="bodySmall1">Added context to a proposal</ThemedText>
	),
	[EActivityName.LINKED_DISCUSSION]: (
		<ThemedText type="bodySmall1">Linked a discussion</ThemedText>
	),
	[EActivityName.QUIZ_ANSWERED_CORRECTLY]: (
		<ThemedText type="bodySmall1">Answered a quiz correctly</ThemedText>
	),
	[EActivityName.TOOK_QUIZ]: (
		<ThemedText type="bodySmall1">Took a quiz</ThemedText>
	),
	[EActivityName.UPDATED_PROFILE]: (
		<ThemedText type="bodySmall1">Updated profile</ThemedText>
	),
	[EActivityName.LINKED_ADDRESS]: (
		<ThemedText type="bodySmall1">Linked a wallet address</ThemedText>
	),
	[EActivityName.REPORTED_CONTENT]: (
		<ThemedText type="bodySmall1">Reported content</ThemedText>
	),
	[EActivityName.CREATED_TIP]: (
		<ThemedText type="bodySmall1">Created a tip</ThemedText>
	),
	[EActivityName.GAVE_TIP]: (
		<ThemedText type="bodySmall1">Gave a tip</ThemedText>
	),
	[EActivityName.CREATED_BOUNTY]: (
		<ThemedText type="bodySmall1">Created a bounty</ThemedText>
	),
	[EActivityName.CLAIMED_BOUNTY]: (
		<ThemedText type="bodySmall1">Claimed a bounty</ThemedText>
	),
	[EActivityName.SIGNED_UP_FOR_IDENTITY_VERIFICATION]: (
		<ThemedText type="bodySmall1">Signed up for identity verification</ThemedText>
	),
	[EActivityName.VERIFIED_IDENTITY]: (
		<ThemedText type="bodySmall1">Verified identity</ThemedText>
	),
	[EActivityName.CREATED_CHILD_BOUNTY]: undefined,
	[EActivityName.APPROVED_BOUNTY]: undefined,
	[EActivityName.COMPLETED_IDENTITY_JUDGEMENT]: undefined,
	[EActivityName.DELEGATED_VOTE]: undefined,
	[EActivityName.RECEIVED_DELEGATION]: undefined,
	[EActivityName.PLACED_DECISION_DEPOSIT]: undefined,
	[EActivityName.REMOVED_VOTE]: undefined,
	[EActivityName.REDUCED_CONVICTION]: undefined,
	[EActivityName.REDUCED_CONVICTION_AFTER_SIX_HOURS_OF_FIRST_VOTE]: undefined,
	[EActivityName.REMOVED_VOTE_AFTER_SIX_HOURS_OF_FIRST_VOTE]: undefined,
	[EActivityName.LOST_DUE_TO_SLASHING_TIP_OR_PROPOSAL]: undefined,
	[EActivityName.PROPOSAL_FAILED]: undefined,
	[EActivityName.PROPOSAL_PASSED]: undefined,
	[EActivityName.VOTE_PASSED]: undefined,
	[EActivityName.VOTE_FAILED]: undefined,
	[EActivityName.DELETED_COMMENT]: undefined,
	[EActivityName.CREATED_OFFCHAIN_POST]: undefined,
	[EActivityName.RECEIVED_REPORT]: undefined,
	[EActivityName.RECEIVED_SPAM_REPORT]: undefined,
	[EActivityName.REMOVED_CONTENT]: undefined,
	[EActivityName.RECEIVED_LIKE_ON_DISCUSSION]: undefined,
	[EActivityName.RECEIVED_LIKE_ON_COMMENT]: undefined,
	[EActivityName.DELETED_REACTION]: undefined,
	[EActivityName.ADDED_PROFILE_PICTURE]: undefined,
	[EActivityName.ADDED_BIO]: undefined,
	[EActivityName.ADDED_PROFILE_TITLE]: undefined,
	[EActivityName.ADDED_PROFILE_TAGS]: undefined,
	[EActivityName.COMMENT_TAKEN_DOWN]: undefined,
	[EActivityName.POST_TAKEN_DOWN]: undefined,
	[EActivityName.POST_MARKED_AS_SPAM]: undefined,
	[EActivityName.LINKED_MULTIPLE_ADDRESSES]: undefined,
	[EActivityName.UNLINKED_ADDRESS]: undefined,
	[EActivityName.UNLINKED_MULTIPLE_ADDRESSES]: undefined
};
