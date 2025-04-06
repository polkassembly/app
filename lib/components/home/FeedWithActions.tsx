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

function FeedWithActions() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
		refetch,
		isRefetching,
	} = useActivityFeed({ limit: 10 });

	const renderItem = ({ item }: { item: Post }) => {
		return (
			<TouchableOpacity
				onPress={() => {
					useProposalStore.getState().setProposal(item);
					router.push(`/proposal/${item.index}?proposalType=${item.proposalType}`);
				}}
			>
				<ProposalCard post={item} />
			</TouchableOpacity>
		)
	};
	const accentColor = useThemeColor({}, "accent");

	if (isLoading || !data) {
		return (
			<ThemedView type="background" style={[styles.container, { justifyContent: "center" }]}>
				<ProposalCardSkeleton />
				<ProposalCardSkeleton />
				<ProposalCardSkeleton />
			</ThemedView>
		);
	}

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
				data={data?.pages.flatMap((page) => page.items)}
				renderItem={renderItem}
				keyExtractor={(item) => item.index.toString()}
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