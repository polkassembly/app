import { useThemeColor } from "@/lib/hooks";
import { useActivityFeed } from "@/lib/net/queries/post";
import { Post } from "@/lib/types";
import { FlatList, ActivityIndicator, StyleSheet, RefreshControl, TouchableOpacity } from "react-native";
import { ProposalCard, ProposalCardSkeleton } from "../proposal";
import { ThemedView } from "../shared/View/ThemedView";
import { EmptyViewWithTabBarHeight } from "../shared/util";
import { router } from "expo-router";
import { useProposalStore } from "@/lib/store/proposalStore";
import { Actions } from "./Actions";
import { useCallback } from "react";

function FeedWithActions() {
	
	const setProposal = useProposalStore((state) => state.setProposal);
	const handleCardPress = useCallback((item: Post) => {
		setProposal(item);
		router.push(`/proposal/${item.index}?proposalType=${item.proposalType}`);
	}, [setProposal]);

	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		refetch,
		isRefetching,
	} = useActivityFeed({ limit: 10 });

	const accentColor = useThemeColor({}, "accent");

	// Generate skeleton items for loading state
	const skeletonItems = isLoading ? [1, 2, 3] : [];

	const renderItem = ({ item }: { item: Post | number }) => {
		// Render skeleton if item is a number
		if (typeof item === 'number') {
			return <ProposalCardSkeleton />;
		}

		// Render proposal card
		return (
			<TouchableOpacity onPress={() => handleCardPress(item)} >
				<ProposalCard post={item} descriptionLength={200} />
			</TouchableOpacity>
		);
	};

	// Use real data if available, otherwise use skeleton placeholders
	const listData = isLoading ?
		skeletonItems :
		data?.pages.flatMap((page) => page.items) || [];

	return (
		<ThemedView type="secondaryBackground" style={styles.container}>
			<FlatList
				contentContainerStyle={{
					gap: 20,
					marginInline: 16,
				}}
				ListHeaderComponent={
					<Actions />
				}
				ListHeaderComponentStyle={{
					marginInline: -16,
				}}
				data={listData}
				renderItem={renderItem}
				keyExtractor={(item) => typeof item === 'number' ? `skeleton-${item}` : item.index.toString()}
				onEndReached={() => {
					if (hasNextPage && !isFetchingNextPage) {
						fetchNextPage();
					}
				}}
				onEndReachedThreshold={0.5}
				refreshControl={
					<RefreshControl
						refreshing={isRefetching}
						onRefresh={refetch}
						colors={[accentColor]}
						tintColor={accentColor}
						progressBackgroundColor={"transparent"}
					/>
				}
				ListFooterComponent={
					<EmptyViewWithTabBarHeight>
						{isFetchingNextPage ? <ActivityIndicator size="small" color={accentColor} style={{ marginBottom: 20 }} /> : null}
					</EmptyViewWithTabBarHeight>
				}
				ListEmptyComponent={<EmptyViewWithTabBarHeight />}
			/>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	container: {
		flex: 1
	},
	scrollView: {
		paddingHorizontal: 16,
		marginTop: 16,
	},
});

export default FeedWithActions;