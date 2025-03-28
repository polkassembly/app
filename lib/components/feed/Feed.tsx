import { useThemeColor } from "@/lib/hooks";
import { useActivityFeed } from "@/lib/net/queries/post";
import { Post } from "@/lib/types";
import { FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { ProposalCard, ProposalCardSkeleton } from "../proposal";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { EmptyViewWithTabBarHeight } from "../util";

function Feed() {
	const {
		data,
		fetchNextPage,
		hasNextPage,
		isFetchingNextPage,
		isLoading,
	} = useActivityFeed({ limit: 10 });

	const renderItem = ({ item }: { item: Post }) => <ProposalCard post={item} />;
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
		<ThemedView type="background" style={styles.container}>
			<FlatList
				contentContainerStyle={{
					gap: 8,
					paddingInline: 8,
					marginTop: 16
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
				ListFooterComponent={
					<EmptyViewWithTabBarHeight>
						{isFetchingNextPage ? <ActivityIndicator size="small" color={accentColor} style={{ marginBottom: 20 }} /> : <ThemedText></ThemedText>}
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

export default Feed;