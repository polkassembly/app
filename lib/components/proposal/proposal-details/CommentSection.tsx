import { useThemeColor } from "@/lib/hooks";
import { useProposalComments } from "@/lib/net/queries/post";
import { EProposalType, ICommentResponse } from "@/lib/types";
import { ECommentSentiment } from "@/lib/types/comment";
import { useState, useEffect } from "react";
import { View, ActivityIndicator, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { IconSentiment } from "../../icons/proposals";
import { ThemedText } from "../../shared/text";
import { ThemedView } from "../../shared/View";
import { CommentList } from "../comments";

function CommentSection({ proposalIndex, proposalType }: { proposalIndex: string; proposalType: EProposalType }) {
	const { data: comments, isLoading } = useProposalComments({
		proposalType: proposalType.toString(),
		proposalId: proposalIndex.toString(),
	});
	const [sortedSentiments, setSortedSentiments] = useState<[ECommentSentiment, number][]>([]);
	const accentColor = useThemeColor({}, "accent");

	// Helper: Flatten nested comments and remove comments without sentiment
	const flattenComments = (comments: ICommentResponse[]): ICommentResponse[] => {
		return comments.reduce((acc: ICommentResponse[], comment) => {
			if (comment.aiSentiment) acc.push(comment);
			if (comment.children?.length) {
				acc.push(...flattenComments(comment.children));
			}
			return acc;
		}, []);
	};

	// Calculate sentiment percentages
	useEffect(() => {
		if (!comments) return;

		const allComments = flattenComments(comments);
		const total = allComments.length;

		const count: Record<ECommentSentiment, number> = {
			[ECommentSentiment.AGAINST]: 0,
			[ECommentSentiment.SLIGHTLY_AGAINST]: 0,
			[ECommentSentiment.NEUTRAL]: 0,
			[ECommentSentiment.SLIGHTLY_FOR]: 0,
			[ECommentSentiment.FOR]: 0,
		};

		for (const comment of allComments) {
			if (comment.aiSentiment && Object.hasOwn(count, comment.aiSentiment)) {
				count[comment.aiSentiment]++;
			}
		}

		const percentages = Object.fromEntries(
			Object.entries(count).map(([key, value]) => [key, total ? Math.round((value / total) * 100) : 0])
		) as Record<ECommentSentiment, number>;

		const sorted = (Object.entries(percentages) as [ECommentSentiment, number][])
			.sort(([, aPct], [, bPct]) => bPct - aPct);
		setSortedSentiments(sorted)
	}, [comments]);

	const getTotalLength = (arr: any[]) =>
		arr.reduce((sum, item) => {
			const childrenLength = Array.isArray(item.children) ? getTotalLength(item.children) : 0;
			return sum + 1 + childrenLength;
		}, 0);

	return (
		<ThemedView
			type="background"
			style={[
				styles.box,
				{
					alignContent: "stretch",
					gap: 16,
					marginBottom: 50,
				},
			]}
		>
			<View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
				<View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
					<ThemedText type="bodyLarge">Replies </ThemedText>
					{comments && (
						<View style={{ backgroundColor: "#E5E5FD", paddingHorizontal: 4, borderRadius: 4 }}>
							<ThemedText type="bodySmall1" style={{ color: "#79767D", lineHeight: 18 }}>
								{getTotalLength(comments)}
							</ThemedText>
						</View>
					)}
				</View>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
					{sortedSentiments.map(([sentiment, pct], index) => {
						const isFirst = index === 0;
						return (
							<View
								key={sentiment}
								style={{
									flexDirection: 'row',
									alignItems: 'center',
									gap: 2,
									backgroundColor: isFirst ? '#FEF2F8' : 'transparent',
									borderRadius: isFirst ? 4 : 0,
									padding: 4,
								}}
							>
								<IconSentiment
									sentiment={sentiment}
									iconWidth={13}
									iconHeight={13}
									color={isFirst ? accentColor : undefined}
								/>
								<ThemedText
									type="bodySmall1"
									colorName={isFirst ? "accent" : "mediumText"}
								>
									{pct}%
								</ThemedText>
							</View>
						);
					})}
				</View>
			</View>
			<View style={{ gap: 16 }}>
				{isLoading ? (
					<ActivityIndicator />
				) : (
					<CommentList comments={comments || []} />
				)}
			</View>
		</ThemedView>
	);
}


const styles = StyleSheet.create({
	box: {
		borderColor: Colors.dark.stroke,
		borderWidth: 1,
		paddingHorizontal: 12,
		paddingVertical: 12,
		borderRadius: 12,
	},
});

export default CommentSection;