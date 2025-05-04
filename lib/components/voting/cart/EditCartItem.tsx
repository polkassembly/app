import { useState } from "react";
import { ScrollView, View, TouchableOpacity } from "react-native";
import { trimText } from "@/lib/util/stringUtil";
import IconClose from "@/lib/components/icons/shared/icon-close";
import { HorizontalSeparator, ThemedView } from "@/lib/components/shared/View";
import { ThemedText } from "@/lib/components/shared/text";
import { BatchVoteForm } from "@/lib/components/voting";
import { UpdateCartItemParams } from "@/lib/net/queries/actions/useUpdateCartItem";
import { BottomSheetScrollView } from "@gorhom/bottom-sheet";
import { CartItem } from "@/lib/net/queries/actions/useGetCartItem";

export default function EditCartItem({
	cartItem,
	onClose,
	onUpdate,
}: {
	cartItem: CartItem;
	onClose: () => void;
	onUpdate: (updatedCartItem: UpdateCartItemParams) => void;
}) {
	const [vote, setVote] = useState(cartItem.decision);
	const [ayeAmount, setAyeAmount] = useState(parseFloat(cartItem.amount.aye || "1"));
	const [nayAmount, setNayAmount] = useState(parseFloat(cartItem.amount.nay || "1"));
	const [abstainAmount, setAbstainAmount] = useState({
		abstain: parseFloat(cartItem.amount.abstain || "1"),
		aye: parseFloat(cartItem.amount.aye || "1"),
		nay: parseFloat(cartItem.amount.nay || "1"),
	});
	const [conviction, setConviction] = useState(cartItem.conviction);

	const handleConfirm = () => {
		const amount = {
			aye: vote === "aye" || vote === "splitAbstain" ? ayeAmount.toString() : undefined,
			nay: vote === "nay" || vote === "splitAbstain" ? nayAmount.toString() : undefined,
			abstain: vote === "splitAbstain" ? abstainAmount.abstain.toString() : undefined,
		};
		onUpdate({ id: cartItem.id, decision: vote, amount, conviction });
		onClose();
	};

	return (
		<ThemedView
			type="container"
			style={{
				width: "100%",
				borderTopLeftRadius: 16,
				borderTopRightRadius: 16,
				paddingTop: 16,
				flex: 1
			}}
		>
			<BottomSheetScrollView style={{ paddingHorizontal: 16 }}>
				<View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
					<ThemedText type="titleMedium">Edit Vote Details</ThemedText>
					<TouchableOpacity onPress={onClose}>
						<IconClose iconWidth={14} iconHeight={14} color="#79767D" />
					</TouchableOpacity>
				</View>
				<HorizontalSeparator style={{ marginVertical: 20 }} />
				<ThemedText type="bodyMedium2">Editing Vote Details for Proposal:</ThemedText>
				<View style={{ flexDirection: "row", gap: 10, marginBottom: 16 }}>
					<ThemedText
						type="bodySmall"
						colorName="mediumText"
						style={{
							backgroundColor: "#EAEDF0",
							borderRadius: 4,
							paddingHorizontal: 4,
							fontSize: 10,
						}}
					>
						#{cartItem.postIndexOrHash}
					</ThemedText>
					<ThemedText
						type="bodyMedium2"
						style={{ fontFamily: "Poppins-SemiBold" }}
						numberOfLines={2}
						ellipsizeMode="tail"
					>
						{cartItem.title}
					</ThemedText>
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
					singleButtonMode={false}
					onConfirm={handleConfirm}
					onCancel={onClose}
				/>
			</BottomSheetScrollView>
		</ThemedView>
	);
}
