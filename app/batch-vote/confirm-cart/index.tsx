import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Link, router } from "expo-router";
import React, { useEffect, useState, useCallback } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import { Note, TopBar } from "@/lib/components/shared";
import { ThemedButton } from "@/lib/components/shared/button";
import { ThemedText } from "@/lib/components/shared/text";
import { ThemedView, TopGlow } from "@/lib/components/shared/View";
import { CartItemCard, EditCartItem } from "@/lib/components/voting/cart";
import { useLocalCartStore } from "@/lib/store/localCartStore";
import { CartItem } from "@/lib/net/queries/actions/useGetCartItem";
import { UpdateCartItemParams } from "@/lib/net/queries/actions/useUpdateCartItem";
import { useBottomSheet } from "@/lib/context/bottomSheetContext";
import { useAddCartItem } from "@/lib/net/queries/actions";
import Toast from "react-native-toast-message";
import { EVoteDecision } from "@/lib/types/post";

export default function VotedProposals() {
	const [totalDotSpent, setTotalDotSpent] = useState<number>(0)
	const colorStroke = useThemeColor({}, "stroke");

	const items = useLocalCartStore((state) => state.items);
	const removeCartItem = useLocalCartStore((state) => state.removeCartItem);
	const updateCartItem = useLocalCartStore((state) => state.updateCartItem);
	const clearCartItems = useLocalCartStore((state) => state.clearCartItems);
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { mutateAsync: addCartItem } = useAddCartItem();

	useEffect(() => {
		if (!items) return;

		const total = items.reduce((acc, item) => {
			if (item.decision === EVoteDecision.AYE) {
				return acc + Number(item.amount.aye);
			} else if (item.decision === EVoteDecision.NAY) {
				return acc + Number(item.amount.nay);
			} else if (item.decision === EVoteDecision.SPLIT_ABSTAIN) {
				return acc + Number(item.amount.aye) + Number(item.amount.nay) + Number(item.amount.abstain);
			} else {
				return acc;
			}
		}, 0);
		setTotalDotSpent(total);
	}, [items]);

	// Calculate DOT spent for a single vote item
	const calculateItemDotSpent = useCallback((item: CartItem): number => {
		if (item.decision === EVoteDecision.AYE) {
			return Number(item.amount.aye);
		} else if (item.decision === EVoteDecision.NAY) {
			return Number(item.amount.nay);
		} else if (item.decision === EVoteDecision.SPLIT_ABSTAIN) {
			return Number(item.amount.aye) + Number(item.amount.nay) + Number(item.amount.abstain);
		}
		return 0;
	}, []);

	// Process vote results and handle successes/failures
	const processVoteResults = useCallback((results: any, items: CartItem[]) => {
		const successfulItemIds: string[] = [];
		const failedItemIds: string[] = [];
		let successfulDotSpent = 0;

		results.forEach((result: any, index: number) => {
			const item = items[index];
			if (result.status === 'fulfilled') {
				successfulItemIds.push(item.id);
				successfulDotSpent += calculateItemDotSpent(item);
			} else {
				failedItemIds.push(item.id);
				Toast.show({
					type: "error",
					text1: `Failed to add vote for ${item.title || item.postIndexOrHash}`,
				});
			}
		});

		return { successfulItemIds, failedItemIds, successfulDotSpent };
	}, [calculateItemDotSpent]);

	// Show appropriate toast messages based on results
	const showResultToasts = useCallback((successCount: number, failCount: number) => {
		if (failCount === 0) {
			Toast.show({
				type: "success",
				text1: "All votes added to cart successfully",
				text2: "You can now confirm your votes in the cart"
			});
		} else if (successCount > 0) {
			Toast.show({
				type: "info",
				text1: `${successCount} votes added successfully`,
				text2: `${failCount} votes failed and remain in your cart`
			});
		} else {
			Toast.show({
				type: "error",
				text1: "Failed to add votes to cart",
				text2: "Please try again later"
			});
		}
	}, []);

	const handleConfirmCart = useCallback(async () => {
		if (items.length === 0) return;

		const results = await Promise.allSettled(
			items.map((item) =>
				addCartItem({
					postIndexOrHash: item.postIndexOrHash,
					proposalType: item.proposalType,
					decision: item.decision,
					amount: item.amount,
					conviction: item.conviction,
					proposalTitle: item.title
				})
			)
		);

		// Process the results
		const { successfulItemIds, failedItemIds, successfulDotSpent } = processVoteResults(results, items);
		successfulItemIds.forEach(id => removeCartItem(id));

		showResultToasts(successfulItemIds.length, failedItemIds.length);

		if (successfulItemIds.length > 0) {
			router.replace(`/batch-vote/success?proposalCount=${successfulItemIds.length}&totalDotSpent=${successfulDotSpent}&failedCount=${failedItemIds.length}`);
		}
	}, [items, addCartItem, processVoteResults, removeCartItem, showResultToasts]);

	const handleEdit = useCallback((updatedCartItem: UpdateCartItemParams) => {
		updateCartItem(updatedCartItem);
	}, [updateCartItem]);

	const handleDelete = useCallback((id: string) => {
		removeCartItem(id);
	}, [removeCartItem]);

	const showEditSheet = useCallback((item: CartItem) => {
		if (!item) return null;

		openBottomSheet(
			<EditCartItem
				cartItem={item}
				onClose={closeBottomSheet}
				onUpdate={handleEdit}
			/>,
			["90%", "100%"]
		);
	}, [openBottomSheet, closeBottomSheet, handleEdit]);

	return (
		<ThemedView type="secondaryBackground" style={{ flex: 1 }}>
			<TopBar style={{ paddingHorizontal: 16 }} />
			<ScrollView style={{ marginTop: 20, paddingHorizontal: 16 }}>
				<ThemedView
					type="container"
					style={{
						gap: 20,
						padding: 10,
						borderRadius: 10,
						borderWidth: 1,
						borderColor: colorStroke,
					}}
				>
					<ThemedText type="bodyLarge">Voted Proposals{`(${items.length})`}</ThemedText>

					{items.length === 0 ? (
						<View
							style={{
								gap: 20,
								padding: 10,
								flex: 1,
								flexGrow: 1,
								alignItems: "center"
							}}
						>
							<Image
								style={{
									width: 170,
									height: 170,
								}}
								resizeMode="contain"
								source={require("@/assets/images/empty-state.png")}
							/>
							<View style={{
								flexDirection: "row",
								alignItems: "center",
								gap: 5,
							}}>
								<ThemedText>No Votes Yet.</ThemedText>
								<Link href="/batch-vote/cards" replace>
									<ThemedText colorName="accent">Vote Now!</ThemedText>
								</Link>
							</View>
						</View>
					) : (
						items.map((item) => (
							<CartItemCard
								key={item.id}
								cartItem={item}
								onEdit={showEditSheet}
								onDelete={handleDelete}
							/>
						))
					)}
				</ThemedView>
			</ScrollView>
			<BottomView
				totalProposal={String(items.length)}
				totalDotSpent={totalDotSpent}
				onConfirm={handleConfirmCart}
				onClearCart={clearCartItems}
			/>
		</ThemedView>
	);
}

interface BottomViewProps {
	totalProposal: string,
	totalDotSpent: number,
	onConfirm: () => Promise<void>
	onClearCart: () => void
}

function BottomView({ totalProposal, totalDotSpent, onConfirm, onClearCart }: BottomViewProps) {
	const [isLoading, setIsLoading] = useState(false);

	const handleConfirmCart = useCallback(async () => {
		setIsLoading(true);
		try {
			await onConfirm();
		} catch (error) {
			console.error("Error confirming cart:", error);
		} finally {
			setIsLoading(false);
		}
	}, [onConfirm]);

	return (
		<View>
			<TopGlow />
			<ThemedView type="secondaryBackground" style={[styles.container]}>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
						<ThemedText type="bodyMedium3">Total Proposals</ThemedText>
						<ThemedText type="bodyMedium3">{totalProposal}</ThemedText>
					</View>
					<ThemedButton
						text="Clear"
						style={{ paddingVertical: 2 }}
						onPress={onClearCart}
					/>
				</View>
				<ThemedView style={{ borderRadius: 6, paddingHorizontal: 12, paddingVertical: 8, flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
					<ThemedText type="bodyMedium2" colorName="mediumText">Gas Fees</ThemedText>
					<ThemedText type="bodyMedium1" >{totalDotSpent} DOT</ThemedText>
				</ThemedView>
				<ThemedButton
					text="Confirm Cart"
					onPress={handleConfirmCart}
					loading={isLoading}
				/>
			</ThemedView>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		gap: 20,
		padding: 20,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
})