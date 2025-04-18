import { View, TouchableOpacity } from "react-native";
import { Ionicons } from "@expo/vector-icons";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import IconPencil from "@/lib/components/icons/shared/icon-pencil";
import { toSentenceCase, trimText } from "@/lib/util/stringUtil";
import { HorizontalSeparator } from "@/lib/components/shared/View";
import { ThemedView } from "@/lib/components/shared/View";
import { ThemedText } from "@/lib/components/shared/text";
import { Skeleton } from "moti/skeleton";
import { useState } from "react";
import { CartItem } from "@/lib/net/queries/actions/useGetCartItem";
import { EVoteDecision } from "@/lib/types/post";
import IconAye from "../../icons/shared/icon-aye";
import IconNay from "../../icons/shared/icon-nay";
import IconAbstain from "../../icons/shared/icon-abstain";

const CartItemCard = ({
	cartItem,
	onEdit,
	onDelete,
}: {
	cartItem: CartItem;
	onEdit: (item: any) => void;
	onDelete: (id: string) => void;
}) => {
	const colorStroke = useThemeColor({}, "stroke");
	const [isDeleting, setIsDeleting] = useState(false);

	const handleDelete = () => {
		setIsDeleting(true);
		onDelete(cartItem.id);
	};

	const voteAmount = cartItem.decision === EVoteDecision.AYE ? cartItem.amount.aye
	: cartItem.decision === EVoteDecision.NAY ? cartItem.amount.nay
		: cartItem.amount.abstain;

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
			<View style={{ flexDirection: "row", gap: 10 }}>
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
				<ThemedText type="bodySmall">{trimText(cartItem.title, 30)}</ThemedText>
			</View>

			<HorizontalSeparator />

			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<View style={{ flexDirection: "row", alignItems: "center", gap: 5 }}>
					<DecisionIconAndText decision={cartItem.decision as EVoteDecision} />
				</View>

				<ThemedText type="bodySmall">{voteAmount} Dot</ThemedText>

				<ThemedText type="bodySmall">{cartItem.conviction}x</ThemedText>

				<View style={{ flexDirection: "row", gap: 12, alignItems: "center" }}>
					<TouchableOpacity onPress={() => onEdit(cartItem)}>
						<IconPencil color="#79767D" iconHeight={20} iconWidth={20} />
					</TouchableOpacity>
					<TouchableOpacity onPress={handleDelete}>
						{isDeleting ? (
							<Skeleton width={20} height={20} radius={10} />
						) : (
							<Ionicons name="trash" size={20} color="#79767D" />
						)}
					</TouchableOpacity>
				</View>
			</View>
		</ThemedView>
	);
}

const DecisionIconAndText = ({ decision }: { decision: EVoteDecision }) => {
	const decisionColor = decision === EVoteDecision.AYE ? "#2ED47A"
		: decision === EVoteDecision.NAY ? "#F53C3C"
			: "#FFBF60";

	return (
		<View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
			{
				decision === EVoteDecision.AYE ? (
					<IconAye iconWidth={14.4} iconHeight={13.7} color={decisionColor} />
				) : decision === EVoteDecision.NAY ? (
					<IconNay iconWidth={14.4} iconHeight={13.7} color={decisionColor} />
				) : (
					<IconAbstain iconWidth={14.4} iconHeight={13.7} color={decisionColor} />
				)
			}<ThemedText type="bodySmall" style={{ color: decisionColor }}>{toSentenceCase(decision)}</ThemedText>
		</View>
	)
}

const CartItemCardSkeleton = () => {
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
				<Skeleton width={30} height={15} />
				<Skeleton width={120} height={15} />
			</View>
			<HorizontalSeparator />
			<View
				style={{
					flexDirection: "row",
					justifyContent: "space-between",
					alignItems: "center",
				}}
			>
				<View style={{ flexDirection: "row", gap: 5, alignItems: "center", minWidth: 70 }}>
					<Skeleton width={20} height={20} radius={10} />
					<Skeleton width={40} height={15} />
				</View>
				<Skeleton width={20} height={15} />
				<View style={{ flexDirection: "row", gap: 20, alignItems: "center" }}>
					<Skeleton width={20} height={20} radius={5} />
					<Skeleton width={20} height={20} radius={5} />
				</View>
			</View>
		</ThemedView>
	);
}

export { CartItemCard, CartItemCardSkeleton }