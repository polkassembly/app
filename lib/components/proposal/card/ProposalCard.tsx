import React, { memo, useEffect } from "react";
import { StyleSheet, View } from "react-native";

import { useGetUserByAddress } from "@/lib/net/queries/profile";
import { EAllowedCommentor, ENetwork, EPostOrigin, Post } from "@/lib/types/post";
import { ProposalActions } from "./actions";
import { ProposalHeader, ProposalHeaderSkeleton } from "./header/ProposalHeader";
import { ProposalBody, ProposalBodySkeleton } from "./body";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useQueryClient } from "@tanstack/react-query";
import { buildProposalCommentsQueryKey, getProposalComments } from "@/lib/net/queries/post";
import HorizontalSeparator from "../../shared/View/HorizontalSeparator";
import { ContainerType, ThemedView } from "../../shared/View/ThemedView";
import ViewMoreButton from "./ViewMoreButton";

type ProposalCardProps = {
	post: Post;
	withoutViewMore?: boolean;
	withoutActions?: boolean;
	withoutIndex?: boolean;
	containerType?: ContainerType;
	descriptionLength?: number;
	/**
	 * Renders components after ProposalBody but before ProposalActions.
	 */
	children?: React.ReactNode;
	/**
	 * Renders components after ViewMoreButton or ProposalActions (at the very end).
	 */
	childrenEnd?: React.ReactNode;
	withoutReadMore?: boolean
};

const ProposalCard = ({
	post,
	withoutViewMore = false,
	withoutActions = false,
	withoutIndex = false,
	withoutReadMore = false,
	containerType = "container",
	descriptionLength = 300,
	children,
	childrenEnd,
}: ProposalCardProps) => {

	const colorStroke = useThemeColor({}, "stroke")
	const queryClient = useQueryClient()

	const { data: proposerInfo } = useGetUserByAddress(
		post.onChainInfo?.proposer || ""
	);

	useEffect(() => {
		queryClient.prefetchQuery({
			queryKey: buildProposalCommentsQueryKey({ proposalType: post.proposalType, proposalId: post.index }),
			queryFn: () => getProposalComments({ proposalType: post.proposalType, proposalId: post.index })
		})
	}, [post.proposalType, post.index, queryClient])

	return (
		<ThemedView style={[styles.container, { borderColor: colorStroke }]} type={containerType}>
			<ProposalHeader
				index={post.index}
				status={post.onChainInfo?.status}
				beneficiaries={post.onChainInfo?.beneficiaries || []}
				proposalNetwork={post.network as ENetwork}
				withoutIndex={withoutIndex}
			/>
			<HorizontalSeparator />
			<ProposalBody
				title={post.title}
				content={post.content}
				createdAt={post.onChainInfo?.createdAt}
				proposerAddress={post.onChainInfo?.proposer || ""}
				proposerInfo={proposerInfo}
				descriptionLength={descriptionLength}
				origin={post.onChainInfo?.origin}
				withoutReadMore={withoutReadMore}
			/>
			{/* Render children between read-more and actions */}
			{children}
			{(!withoutActions || !withoutViewMore) && <HorizontalSeparator />}
			{!withoutActions && (
				<ProposalActions
					index={post.index}
					title={post.title}
					proposalType={post.proposalType}
					metrics={post.metrics}
					reactions={post.reactions || []}
					allowedCommentor={post.allowedCommentor || EAllowedCommentor.ALL}
					userSubscriptionId={post.userSubscriptionId}
					createdAt={post.createdAt}
					authorAddress={post.onChainInfo?.proposer || ""}
					origin={post.onChainInfo?.origin as EPostOrigin}
				/>
			)}

			{!withoutViewMore && (
				<ViewMoreButton post={post} />
			)}
			{childrenEnd}
		</ThemedView>
	);
}

const ProposalCardSkeleton = () => {
	return (
		<View style={styles.container}>
			<ProposalHeaderSkeleton />
			<ProposalBodySkeleton />
		</View>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		padding: 12,
		gap: 12,
		borderRadius: 12,
		borderWidth: 1,
		overflow: "hidden",
		flexDirection: "column",
	}
});

const MemoizedProposalCard = memo(ProposalCard);
const MemoizedProposalCardSkeleton = memo(ProposalCardSkeleton);

export { MemoizedProposalCard as ProposalCard, MemoizedProposalCardSkeleton as ProposalCardSkeleton };
