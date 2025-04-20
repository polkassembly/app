import React from "react";
import { ScrollView, View } from "react-native";
import { ThemedView } from "../../shared/View";
import { Skeleton } from "moti/skeleton";

export default function ProposalDetailsSkeleton() {
	return (
		<ScrollView style={{ flex: 1 }}>
			<View style={{ padding: 16, gap: 8 }}>
				{/* Title Skeleton */}
				<Skeleton height={24} width={180} radius={4} />

				{/* Proposal Card Skeleton */}
				<ThemedView type="background" style={{ borderRadius: 12, padding: 16, gap: 16 }}>
					<Skeleton height={20} width={120} radius={4} />
					<Skeleton height={80} width="100%" radius={8} />
					<Skeleton height={40} width="100%" radius={8} />
				</ThemedView>

				{/* Summary Section Skeleton */}
				<ThemedView type="background" style={{ borderRadius: 12, padding: 16, gap: 16 }}>
					<Skeleton height={20} width={140} radius={4} />
					<Skeleton height={12} width="100%" radius={4} />
					<Skeleton height={12} width="100%" radius={4} />
				</ThemedView>

				{/* See Details Button Skeleton */}
				<Skeleton height={50} width="100%" radius={12} />

				{/* Comment Section Skeleton */}
				<ThemedView type="background" style={{ borderRadius: 12, padding: 16, gap: 16 }}>
					<Skeleton height={20} width={100} radius={4} />
					<Skeleton height={60} width="100%" radius={8} />
					<Skeleton height={60} width="100%" radius={8} />
				</ThemedView>
			</View>
		</ScrollView>
	);
}
