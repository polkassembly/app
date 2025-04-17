import React from "react";
import { View } from "react-native";
import { ThemedText } from "../components/shared/text";
import { IUserActivity, EActivityName, EVoteDecision } from "../types/user";
import { toSentenceCase } from "../util/stringUtil";
import IconAye from "../components/icons/shared/icon-aye";
import IconNay from "../components/icons/shared/icon-nay";
import IconAbstain from "../components/icons/shared/icon-abstain";
import { EReaction } from "../types";
import IconLike from "../components/icons/shared/icon-like";
import IconDislike from "../components/icons/shared/icon-dislike";

export const ACTIVITY_MAP: Record<EActivityName, (item: IUserActivity) => React.ReactNode> = {
	[EActivityName.VOTED_ON_PROPOSAL]: (item) => (
		<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
			<ThemedText type="bodySmall1" >
				{item.metadata?.decision ? "Voted" : "Voted on"}
			</ThemedText>
			{
				item.metadata?.decision && (
					<>
						{
							item.metadata.decision === EVoteDecision.AYE ?
								<IconAye iconHeight={14} iconWidth={14} color="#2ED47A" filled /> :
								item.metadata.decision === EVoteDecision.NAY ?
									<IconNay iconHeight={14} iconWidth={14} color="#F53C3C" filled /> :
									<IconAbstain iconHeight={14} iconWidth={14} color="#FFBF60" filled />
						}
						<ThemedText type="bodySmall">{toSentenceCase(item.metadata?.decision || "")}</ThemedText>
					</>
				)
			}
		</View>
	),

	[EActivityName.CREATED_PROPOSAL]: (item) => (
		<ThemedText type="bodySmall1">
			Created a {item.proposalType?.toLowerCase() ?? "proposal"}
		</ThemedText>
	),

	[EActivityName.COMMENTED_ON_POST]: () => (
		<ThemedText type="bodySmall1">
			Added comment on
		</ThemedText>
	),

	[EActivityName.REPLIED_TO_COMMENT]: () => (
		<ThemedText type="bodySmall1">
			Replied to a comment
		</ThemedText>
	),

	[EActivityName.REACTED_TO_POST]: (item: IUserActivity) => (
		<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
			{
				item.metadata?.reaction && item.metadata.reaction === EReaction.like ? (
					<>
						<IconLike iconHeight={14} iconWidth={14} color="#E5007A" />
						<ThemedText type="bodySmall1" colorName="accent">Liked</ThemedText>
					</>
				) : (
					<>
						<IconDislike iconHeight={14} iconWidth={14} color="#E5007A" />
						<ThemedText type="bodySmall1" colorName="accent">Disliked</ThemedText>
					</>
				)

			}
			<ThemedText type="bodySmall1">
				{item.metadata?.reaction ? "proposal" : "Reacted on"}
			</ThemedText>
		</View>
	),

	[EActivityName.REACTED_TO_COMMENT]: () => (
		<ThemedText type="bodySmall1">
			Reacted to a comment
		</ThemedText>
	),

	[EActivityName.ADDED_CONTEXT_TO_PROPOSAL]: () => (
		<ThemedText type="bodySmall1">
			Added context to a proposal
		</ThemedText>
	),

	[EActivityName.LINKED_DISCUSSION]: () => (
		<ThemedText type="bodySmall1">
			Linked a discussion
		</ThemedText>
	),

	[EActivityName.QUIZ_ANSWERED_CORRECTLY]: () => (
		<ThemedText type="bodySmall1">
			Answered a quiz correctly
		</ThemedText>
	),

	[EActivityName.TOOK_QUIZ]: () => (
		<ThemedText type="bodySmall1">
			Took a quiz
		</ThemedText>
	),

	[EActivityName.UPDATED_PROFILE]: () => (
		<ThemedText type="bodySmall1">
			Updated profile
		</ThemedText>
	),

	[EActivityName.LINKED_ADDRESS]: () => (
		<ThemedText type="bodySmall1">
			Linked a wallet address
		</ThemedText>
	),

	[EActivityName.REPORTED_CONTENT]: () => (
		<ThemedText type="bodySmall1">
			Reported content
		</ThemedText>
	),

	[EActivityName.CREATED_TIP]: () => (
		<ThemedText type="bodySmall1">
			Created a tip
		</ThemedText>
	),

	[EActivityName.GAVE_TIP]: () => (
		<ThemedText type="bodySmall1">
			Gave a tip
		</ThemedText>
	),

	[EActivityName.CREATED_BOUNTY]: () => (
		<ThemedText type="bodySmall1">
			Created a bounty
		</ThemedText>
	),

	[EActivityName.CLAIMED_BOUNTY]: () => (
		<ThemedText type="bodySmall1">
			Claimed a bounty
		</ThemedText>
	),

	[EActivityName.SIGNED_UP_FOR_IDENTITY_VERIFICATION]: () => (
		<ThemedText type="bodySmall1">
			Signed up for identity verification
		</ThemedText>
	),

	[EActivityName.VERIFIED_IDENTITY]: () => (
		<ThemedText type="bodySmall1">
			Verified identity
		</ThemedText>
	),

	// The rest return undefined or no specific logic yet
	[EActivityName.CREATED_CHILD_BOUNTY]: () => null,
	[EActivityName.APPROVED_BOUNTY]: () => null,
	[EActivityName.COMPLETED_IDENTITY_JUDGEMENT]: () => null,
	[EActivityName.DELEGATED_VOTE]: () => null,
	[EActivityName.RECEIVED_DELEGATION]: () => null,
	[EActivityName.PLACED_DECISION_DEPOSIT]: () => null,
	[EActivityName.REMOVED_VOTE]: () => null,
	[EActivityName.REDUCED_CONVICTION]: () => null,
	[EActivityName.REDUCED_CONVICTION_AFTER_SIX_HOURS_OF_FIRST_VOTE]: () => null,
	[EActivityName.REMOVED_VOTE_AFTER_SIX_HOURS_OF_FIRST_VOTE]: () => null,
	[EActivityName.LOST_DUE_TO_SLASHING_TIP_OR_PROPOSAL]: () => null,
	[EActivityName.PROPOSAL_FAILED]: () => null,
	[EActivityName.PROPOSAL_PASSED]: () => null,
	[EActivityName.VOTE_PASSED]: () => null,
	[EActivityName.VOTE_FAILED]: () => null,
	[EActivityName.DELETED_COMMENT]: () => null,
	[EActivityName.CREATED_OFFCHAIN_POST]: () => null,
	[EActivityName.RECEIVED_REPORT]: () => null,
	[EActivityName.RECEIVED_SPAM_REPORT]: () => null,
	[EActivityName.REMOVED_CONTENT]: () => null,
	[EActivityName.RECEIVED_LIKE_ON_DISCUSSION]: () => null,
	[EActivityName.RECEIVED_LIKE_ON_COMMENT]: () => null,
	[EActivityName.DELETED_REACTION]: () => null,
	[EActivityName.ADDED_PROFILE_PICTURE]: () => null,
	[EActivityName.ADDED_BIO]: () => null,
	[EActivityName.ADDED_PROFILE_TITLE]: () => null,
	[EActivityName.ADDED_PROFILE_TAGS]: () => null,
	[EActivityName.COMMENT_TAKEN_DOWN]: () => null,
	[EActivityName.POST_TAKEN_DOWN]: () => null,
	[EActivityName.POST_MARKED_AS_SPAM]: () => null,
	[EActivityName.LINKED_MULTIPLE_ADDRESSES]: () => null,
	[EActivityName.UNLINKED_ADDRESS]: () => null,
	[EActivityName.UNLINKED_MULTIPLE_ADDRESSES]: () => null,
};
