import { BatchVoteForm } from "@/lib/components/voting";
import IconAbstain from "@/lib/components/icons/shared/icon-abstain";
import IconAye from "@/lib/components/icons/shared/icon-aye";
import IconClose from "@/lib/components/icons/shared/icon-close";
import IconNay from "@/lib/components/icons/shared/icon-nay";
import HorizontalSeparator from "@/lib/components/shared/HorizontalSeparator";
import ThemedButton from "@/lib/components/ThemedButton";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { TopBar } from "@/lib/components/Topbar";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import useUpdateCartItem from "@/lib/net/queries/actions/useUpdateCartItem";
import useDeleteCartItem from "@/lib/net/queries/actions/useDeleteCardItem";
import { CartItem, useGetCartItems } from "@/lib/net/queries/actions/useGetCartItem";
import { useProposalByIndex } from "@/lib/net/queries/post/useProposalByIndex";
import { trimText } from "@/lib/util/stringUtil";
import { Ionicons } from "@expo/vector-icons";
import { router } from "expo-router";
import { Skeleton } from "moti/skeleton";
import { useState } from "react";
import { ActivityIndicator, ScrollView, TouchableOpacity, View } from "react-native";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import IconPencil from "@/lib/components/icons/shared/icon-pencil";
import Toast from "react-native-toast-message";
import { Note } from "@/lib/components/shared";
import { Vote, Abstain } from "@/lib/types/voting";

export default function VotedProposals() {
	const { data: cart, isLoading: isCartLoading } = useGetCartItems();
	const [showEdit, setShowEdit] = useState(false);
	const [cartItem, setCartItem] = useState<CartItem | null>(null);
	const colorStroke = useThemeColor({}, "stroke");
	const background = useThemeColor({}, "secondaryBackground");
	const insets = useSafeAreaInsets()

	if (isCartLoading) {
		return <ActivityIndicator />;
	}

	return (
		<ThemedView type="secondaryBackground" style={{ flex: 1 }}>
			<TopBar style={{ paddingHorizontal: 16 }} />
			<ScrollView style={{ marginTop: 20}}>
				<View style={{ paddingHorizontal: 16}}>
					<TouchableOpacity style={{ flexDirection: "row", alignItems: "center", marginBottom: 20, gap: 6 }} onPress={() => router.dismiss()}>
						<Ionicons name="chevron-back" size={15} color="white" />
						<ThemedText type="bodySmall">Back To Swiping</ThemedText>
					</TouchableOpacity>
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
						{cart?.map((item) => (
							<CartItemCard
								key={item.id}
								cartItem={item}
								onEdit={(item: CartItem) => {
									setCartItem(item);
									setShowEdit(true);
								}}
							/>
						))}
					</ThemedView>
				</View>
			</ScrollView>
			<BottomView totalProposal={String(cart?.length || 0)} />
			{showEdit && cartItem && (
				<EditCartItem cartItem={cartItem} onClose={() => setShowEdit(false)} />
			)}
		</ThemedView>
	);
}

interface CartItemCardProps {
	cartItem: CartItem;
	onEdit: (cartItem: CartItem) => void;
}

function CartItemCard({ cartItem, onEdit }: CartItemCardProps) {
	const { data: post, isLoading: isPostLoading } = useProposalByIndex({
		proposalType: cartItem.proposalType,
		indexOrHash: cartItem.postIndexOrHash,
	});
	const { mutate: deleteCartItem, isPending: isDeletePending } = useDeleteCartItem();
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = () => {
		setIsDeleting(true);
		deleteCartItem({ id: cartItem.id },
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

	const colorStroke = useThemeColor({}, "stroke");
	return (
		<ThemedView
			type="container"
			style={{
				padding: 20,
				borderRadius: 10,
				gap: 10,
				borderWidth: 1,
				borderColor: colorStroke,
			}}
		>
			<View style={{ flexDirection: "row", gap: 10, alignContent: "center" }}>
				<ThemedText
					type="bodySmall"
					colorName="mediumText"
					style={{
						backgroundColor: "#EAEDF0",
						borderRadius: 4,
						paddingHorizontal: 4,
						fontSize: 10,
						minWidth: 30
					}}>
					#{cartItem.postIndexOrHash}
				</ThemedText>
				{isPostLoading ? (
					<Skeleton width={50} height={15} />
				) : (
					<ThemedText type="bodySmall">{trimText(post?.title || "", 30)}</ThemedText>
				)}
			</View>
			<HorizontalSeparator />
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<VoteType decision={cartItem.decision} />
				<ThemedText type="bodySmall">{cartItem.conviction}x</ThemedText>
				<View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
					<TouchableOpacity onPress={() => onEdit(cartItem)}>
						<IconPencil color="#79767D" iconHeight={20} iconWidth={20} />
					</TouchableOpacity>
					<TouchableOpacity onPress={handleDelete}>
						{
							isDeleting ? <ActivityIndicator color="#79767D" /> : <Ionicons name="trash" size={20} color="#79767D" />
						}
					</TouchableOpacity>
				</View>
			</View>
		</ThemedView>
	);
}

interface EditCartItemProps {
	cartItem: CartItem;
	onClose: () => void;
}

function EditCartItem({ cartItem, onClose }: EditCartItemProps) {
	const { data: post, isLoading: isPostLoading } = useProposalByIndex({
		proposalType: cartItem.proposalType,
		indexOrHash: cartItem.postIndexOrHash,
	});
	const colorStroke = useThemeColor({}, "stroke");

	const [vote, setVote] = useState<Vote>(cartItem.decision as Vote);

	// Initialize with proper values for aye amount
	const [ayeAmount, setAyeAmount] = useState<number>(
		cartItem.decision === "aye" && cartItem.amount.aye
			? parseFloat(cartItem.amount.aye)
			: 1
	);

	// Initialize with proper values for nay amount
	const [nayAmount, setNayAmount] = useState<number>(
		cartItem.decision === "nay" && cartItem.amount.nay
			? parseFloat(cartItem.amount.nay)
			: 1
	);

	// Initialize abstain as an object
	const [abstainAmount, setAbstainAmount] = useState<Abstain>({
		abstain: cartItem.decision === "splitAbstain" && cartItem.amount.abstain
			? parseFloat(cartItem.amount.abstain)
			: 1,
		aye: cartItem.decision === "splitAbstain" && cartItem.amount.aye
			? parseFloat(cartItem.amount.aye)
			: 1,
		nay: cartItem.decision === "splitAbstain" && cartItem.amount.nay
			? parseFloat(cartItem.amount.nay)
			: 1
	});

	const [conviction, setConviction] = useState(cartItem.conviction);

	const { mutate: editCartItem } = useUpdateCartItem();
	const handleConfirm = () => {
		const amount: { aye?: string; nay?: string; abstain?: string } = {};

		// Update amount object based on vote type
		if (vote === "aye") {
			amount.aye = ayeAmount.toString();
		} else if (vote === "nay") {
			amount.nay = nayAmount.toString();
		} else if (vote === "splitAbstain") {
			amount.abstain = abstainAmount.abstain.toString();
			amount.aye = abstainAmount.aye.toString();
			amount.nay = abstainAmount.nay.toString();
		}

		editCartItem({
			id: cartItem.id,
			decision: vote,
			amount,
			conviction: conviction,
		}, {
			onSuccess: () => {
				Toast.show({
					type: "success",
					text1: "Vote Edited"
				})
				onClose();
			},
			onError: () => {
				Toast.show({
					type: "error",
					text1: "Vote edit failed"
				})
				onClose();
			}
		});
	};

	return (
		<ThemedView
			type="container"
			style={{
				width: "100%",
				height: "81%",
				borderTopLeftRadius: 16,
				borderTopRightRadius: 16,
				paddingTop: 16,
			}}
		>
			<ScrollView style={{ paddingHorizontal: 16 }}>
				<View
					style={{
						flexDirection: "row",
						justifyContent: "space-between",
						alignItems: "center",
					}}
				>
					<ThemedText type="titleMedium">Edit Vote Details</ThemedText>
					<TouchableOpacity onPress={onClose} style={{ padding: 5 }}>
						<IconClose iconWidth={14} iconHeight={14} color="#79767D" />
					</TouchableOpacity>
				</View>
				<HorizontalSeparator style={{ marginTop: 15, marginBottom: 25 }} />
				<View style={{ flexDirection: "row", gap: 10, alignContent: "center", marginBottom: 16 }}>
					<ThemedText
						type="bodySmall"
						colorName="mediumText"
						style={{
							backgroundColor: "#EAEDF0",
							borderRadius: 4,
							paddingHorizontal: 4,
							fontSize: 10,
						}}>
						#{cartItem.postIndexOrHash}
					</ThemedText>
					{isPostLoading ? (
						<Skeleton width={50} />
					) : (
						<ThemedText type="bodySmall">{trimText(post?.title || "", 30)}</ThemedText>
					)}
				</View>
				<BatchVoteForm
					vote={vote}
					onVoteChange={setVote}
					ayeAmount={ayeAmount}
					setAyeAmount={setAyeAmount}
					nayAmount={nayAmount}
					setNayAmount={setNayAmount}
					abstainAmount={abstainAmount}
					setAbstainAmount={setAbstainAmount}
					conviction={conviction}
					setConviction={setConviction}
					singleVoteMode={true}
					onConfirm={handleConfirm}
					onCancel={onClose}
				/>
			</ScrollView>
		</ThemedView>
	);
}

function VoteType({ decision }: { decision: Vote }) {
	return (
		<View style={{ flexDirection: "row", gap: 5, alignItems: "center", minWidth: 70 }}>
			{decision === "aye" && (
				<>
					<IconAye filled color="#2ED47A" />
					<ThemedText type="bodySmall">Aye</ThemedText>
				</>
			)}
			{decision === "nay" && (
				<>
					<IconNay filled color="#F53C3C" />
					<ThemedText type="bodySmall">Nay</ThemedText>
				</>
			)}
			{decision === "splitAbstain" && (
				<>
					<IconAbstain filled color="#FFBF60" />
					<ThemedText type="bodySmall">Abstain</ThemedText>
				</>
			)}
		</View>
	);
}

function BottomView({ totalProposal }: { totalProposal: string }) {
	return (
		<ThemedView type="container" style={{ gap: 20, padding: 20 }}>
			<View style={{ flexDirection: "row", justifyContent: "space-between" }}>
				<ThemedText type="bodyMedium3">Total Proposals</ThemedText>
				<ThemedText type="bodyLarge">{totalProposal}</ThemedText>
			</View>
			<Note content="NOTE: Login Via web view to confirm your vote" />
			<ThemedButton text="Explore Feed" onPress={() => {
				router.dismissAll()
				router.push("/(tabs)")
			}} />
		</ThemedView>
	)
}