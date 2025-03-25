import React, { useEffect, useState } from "react";
import { StyleSheet, View } from "react-native";
import { ContainerType, ThemedView } from "../ThemedView";
import HorizontalSeparator from "../shared/HorizontalSeparator";

import { useGetUserByAddress, useGetUserById } from "@/lib/net/queries/profile";
import { EAllowedCommentor, ENetwork, Post } from "@/lib/types/post";
import { ProposalActions } from "./actions";
import { ProposalHeader, ProposalHeaderSkeleton } from "./header/ProposalHeader";
import { ProposalBody, ProposalBodySkeleton } from "./body";
import ViewMoreButton from "./ViewMoreButton";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useProfileStore } from "@/lib/store/profileStore";
import { useQueryClient } from "@tanstack/react-query";
import { buildProposalCommentsQueryKey, getProposalComments } from "@/lib/net/queries/post";

type ProposalCardProps = {
	post: Post;
	withoutViewMore?: boolean;
	withoutActions?: boolean;
	withoutIndex?: boolean;
	containerType?: ContainerType;
	descriptionLength?: number;
	children?: React.ReactNode;
	withoutReadMore?: boolean
};

function ProposalCard({
	post,
	withoutViewMore = false,
	withoutActions = false,
	withoutIndex = false,
	withoutReadMore = false,
	containerType = "container",
	descriptionLength = 300,
	children,
}: ProposalCardProps) {

	const userProfile = useProfileStore((state) => state.profile);
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
				/>
			)}

			{!withoutViewMore && (
				<ViewMoreButton post={post} />
			)}
		</ThemedView>
	);
}

function ProposalCardSkeleton() {
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

export { ProposalCard, ProposalCardSkeleton };
