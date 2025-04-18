import { useThemeColor } from "@/lib/hooks/useThemeColor";
import useUpdateCartItem, { UpdateCartItemParams } from "@/lib/net/queries/actions/useUpdateCartItem";
import useDeleteCartItem from "@/lib/net/queries/actions/useDeleteCardItem";
import { CartItem, useGetCartItems } from "@/lib/net/queries/actions/useGetCartItem";
import { Link, router } from "expo-router";
import { Skeleton } from "moti/skeleton";
import React, { useState } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Toast from "react-native-toast-message";
import { Note, TopBar } from "@/lib/components/shared";
import { ThemedButton } from "@/lib/components/shared/button";
import { ThemedText } from "@/lib/components/shared/text";
import { ThemedView, TopGlow } from "@/lib/components/shared/View";
import { CartItemCard, CartItemCardSkeleton, EditCartItem } from "@/lib/components/voting/cart";
import { useBottomSheet } from "@/lib/context/bottomSheetContext";

export default function VotedProposals() {
	const colorStroke = useThemeColor({}, "stroke");
	const { mutate: deleteCartItem } = useDeleteCartItem();

	const { data: cart, isLoading: isCartLoading } = useGetCartItems();
	const { openBottomSheet, closeBottomSheet } = useBottomSheet();
	const { mutate: editCartItem } = useUpdateCartItem();

	const showEditSheet = (item: CartItem) => {
		openBottomSheet(
			<EditCartItem
				cartItem={item}
				onClose={closeBottomSheet}
				onUpdate={handleEdit}
			/>
		)
	}

	const handleEdit = (updatedCartItem: UpdateCartItemParams) => {
		editCartItem(updatedCartItem, {
			onSuccess: () => {
				Toast.show({
					type: "success",
					text1: "Vote Edited"
				})
			},
			onError: () => {
				Toast.show({
					type: "error",
					text1: "Vote edit failed"
				})
			},
			onSettled: () => {
				closeBottomSheet()
			}
		});
	};

	const handleDelete = (id: string) => {
		deleteCartItem({ id },
			{
				onError: () => {
					Toast.show({
						type: "error",
						text1: "Error",
						text2: "Failed to delete item",
					});
				}
			}
		);
	}

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
					<ThemedText type="bodyLarge">Voted Proposals{`(${cart?.length || 0})`}</ThemedText>
					{
						isCartLoading ? (
							<View
								style={{
									gap: 20,
									padding: 10,
									borderRadius: 10,
									borderWidth: 1,
									borderColor: colorStroke,
								}}
							>
								<Skeleton width={150} height={20} />

								{/* Skeleton for cart items */}
								{[1, 2, 3].map((item) => (
									<CartItemCardSkeleton key={item} />
								))}
							</View>
						) : cart?.length === 0 ? (
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
									source={require("@/assets/images/vote_empty.png")}
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
						) :
							cart?.map((item) => (
								<CartItemCard
									key={item.id}
									cartItem={item}
									onEdit={showEditSheet}
									onDelete={handleDelete}
								/>
							))}
				</ThemedView>
			</ScrollView>
			<BottomView totalProposal={String(cart?.length || 0)} onClearCart={() => { console.log("clear cart") }} />
		</ThemedView>
	);
}

function BottomView({ totalProposal, onClearCart }: { totalProposal: string, onClearCart: () => void }) {
	return (
		<View>
			<TopGlow />
			<ThemedView type="container" style={styles.container}>
				<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
					<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
						<ThemedText type="bodyMedium3">Total Proposals</ThemedText>
						<ThemedText type="bodyMedium3">{totalProposal}</ThemedText>
					</View>
					<ThemedButton
						bordered
						text="Clear"
						style={{ paddingVertical: 2 }}
						onPress={onClearCart}
					/>
				</View>
				<Note content="NOTE: Login Via web view to confirm your vote" />
			</ThemedView>
		</View>
	)
}


const styles = StyleSheet.create({
	container: {
		gap: 20,
		padding: 20,
		borderTopLeftRadius: 24,
		borderTopRightRadius: 24,
	},
})
