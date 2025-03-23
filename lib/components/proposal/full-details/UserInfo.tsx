import { NETWORKS_DETAILS } from "@/lib/constants/networks";
import { useGetUserByAddress } from "@/lib/net/queries/profile";
import { ENetwork, IBeneficiary } from "@/lib/types/post";
import { formatBnBalance } from "@/lib/util";
import { Skeleton } from "moti/skeleton";
import { StyleSheet, View } from "react-native";
import { UserAvatar } from "../../shared";
import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";

function UserInfo({ address, amount, assetId }: { address: string | undefined, amount?: string, assetId?: string | null }) {
	if (!address) return null;

	const { data: user, isLoading, isError } = useGetUserByAddress(address)

	if (isError) return (
		<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
			<View style={{ width: 24, height: 24, backgroundColor: "grey", borderRadius: 12 }} />
			<ThemedText type="bodySmall">User</ThemedText>
		</View>
	)
	if (isLoading || !user) return <Skeleton width={116} />

	return (
		<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
			<View style={{ width: 24, height: 24, borderRadius: 12 }}>
				{
					user.profileDetails.image ? (
						<UserAvatar avatarUrl={user.profileDetails.image} width={24} height={24} />
					) : (
						// Implement Identicon
						<UserAvatar avatarUrl="" width={24} height={24} />
					)
				}
			</View>
			<ThemedText type="bodySmall">{user?.username}</ThemedText>
			{
				amount && assetId && (
					<ThemedText>{"(" + formatBnBalance(amount, { withUnit: true, numberAfterComma: 2, compactNotation: true }, ENetwork.POLKADOT, assetId === NETWORKS_DETAILS[`${ENetwork.POLKADOT}`].tokenSymbol ? null : assetId) + ")"}</ThemedText>
				)
			}
		</View>
	)
}

function ProposerInfo({ address, amount }: { address: string | undefined; amount: number }) {
	return (
		<ThemedView type="background" style={styles.proposerInfo}>
			<View style={styles.flexRowJustifySpaceBetween}>
				<ThemedText type="bodyLarge">Proposer</ThemedText>
				<UserInfo address={address} />
			</View>
			{/* <View style={styles.flexRowJustifySpaceBetween}>
				<ThemedText type="bodyLarge">Deposit</ThemedText>
				<ThemedText type="bodySmall">{coins}</ThemedText>
			</View> */}
		</ThemedView>
	);
}

function BenificiariesInfo({ benificiaries }: { benificiaries: IBeneficiary[] }) {
	return (
		<ThemedView type="background" style={[styles.proposerInfo, styles.flexRowJustifySpaceBetween]}>
			<ThemedText type="bodyLarge">Benificiaries</ThemedText>
			<View style={{ flexDirection: "column", gap: 8 }}>
				{benificiaries.map((benificary) => (
					<View style={{ flexDirection: "row", gap: 8, alignItems: "center" }} key={benificary.address}>
						<UserInfo key={benificary.address} address={benificary.address} amount={benificary.amount} assetId={benificary.assetId} />
					</View>
				))}
			</View>
		</ThemedView>
	);
}

const styles = StyleSheet.create({
	proposerInfo: {
		padding: 12,
		borderRadius: 12,
		borderColor: "#383838",
		borderWidth: 1,
		gap: 20,
	},
	flexRowJustifySpaceBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
	}
});

export { ProposerInfo, BenificiariesInfo };
