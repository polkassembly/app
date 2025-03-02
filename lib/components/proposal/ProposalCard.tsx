import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { ContainerType, ThemedView } from "../ThemedView";
import HorizontalSeparator from "../shared/HorizontalSeparator";

import { useGetUserByAddress, useGetUserById } from "@/lib/net/queries/profile";
import { ENetwork, Post } from "@/lib/types/post";
import { ProposalActions } from "./actions";
import { ProposalHeader, ProposalHeaderSkeleton } from "./header/ProposalHeader";
import { ProposalBody, ProposalBodySkeleton } from "./body";
import ViewMoreButton from "./ViewMoreButton";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useProfileStore } from "@/lib/store/profileStore";

type ProposalCardProps = {
	post: Post;
	withoutViewMore?: boolean;
	withoutActions?: boolean;
	withoutIndex?: boolean;
	containerType?: ContainerType;
	descriptionLength?: number;
	children?: React.ReactNode;
};

function ProposalCard({
	post,
	withoutViewMore = false,
	withoutActions = false,
	withoutIndex = false,
	containerType = "container",
	descriptionLength = 300,
	children,
}: ProposalCardProps) {

	const userProfile = useProfileStore((state) => state.profile);

	const { data: proposerInfo } = useGetUserByAddress(
		post.onChainInfo?.proposer || ""
	);

	const colorStroke = useThemeColor({}, "stroke")

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
				htmlContent={post.htmlContent}
				createdAt={post.onChainInfo?.createdAt}
				proposerInfo={proposerInfo}
				descriptionLength={descriptionLength}
				origin={post.onChainInfo?.origin}
			/>
			{/* Render children between read-more and actions */}
			{children}
			{ (!withoutActions || !withoutViewMore) && <HorizontalSeparator /> }
			{!withoutActions && (
				<ProposalActions post={post} userInfo={userProfile || undefined} />
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
