import React, { useMemo } from 'react';
import { NETWORKS_DETAILS } from "@/lib/constants/networks";
import { useGetUserByAddress } from "@/lib/net/queries/profile";
import { ENetwork, IBeneficiary } from "@/lib/types/post";
import { formatBnBalance } from "@/lib/util";
import { Skeleton } from "moti/skeleton";
import { StyleSheet, View } from "react-native";
import { UserAvatar } from "../../shared";
import { ThemedText } from "../../ThemedText";
import { ThemedView } from "../../ThemedView";

interface UserInfoProps {
	address?: string;
	amount?: string;
	assetId?: string | null;
}

const UserInfo: React.FC<UserInfoProps> = React.memo(({ address, amount, assetId }) => {
	if (!address) return null;

	const { data: user, isLoading, isError } = useGetUserByAddress(address);

	const formattedAmount = useMemo(() => {
		if (amount && assetId) {
			return formatBnBalance(
				amount,
				{
					withUnit: true,
					numberAfterComma: 2,
					compactNotation: true
				},
				ENetwork.POLKADOT,
				assetId === NETWORKS_DETAILS[`${ENetwork.POLKADOT}`].tokenSymbol ? null : assetId
			);
		}
		return null;
	}, [amount, assetId]);

	if (isError) return (
		<View style={styles.userInfoContainer}>
			<View style={styles.avatarPlaceholder} />
			<ThemedText type="bodySmall">Unknown User</ThemedText>
		</View>
	);

	if (isLoading || !user) return <Skeleton width={116} />;

	return (
		<View style={styles.userInfoContainer}>
			<View style={styles.avatarContainer}>
				<UserAvatar
					avatarUrl={user.profileDetails.image}
					width={24}
					height={24}
				/>
			</View>
			<ThemedText type="bodySmall">
				{user?.username || 'Anonymous'}
			</ThemedText>
			{formattedAmount && (
				<ThemedText type="bodySmall" style={{ opacity: 0.5 }}>
					{`(${formattedAmount})`}
				</ThemedText>
			)}
		</View>
	);
});

interface ProposerInfoProps {
	address?: string;
	amount: number;
}

const ProposerInfo: React.FC<ProposerInfoProps> = ({ address, amount }) => (
	<ThemedView type="background" style={styles.proposerInfo}>
		<View style={styles.flexRowJustifySpaceBetween}>
			<ThemedText type="bodyLarge">Proposer</ThemedText>
			<UserInfo address={address} />
		</View>
	</ThemedView>
);

interface BeneficiariesInfoProps {
	beneficiaries: IBeneficiary[];
}

const BeneficiariesInfo: React.FC<BeneficiariesInfoProps> = ({ beneficiaries }) => (
	<ThemedView type="background" style={[styles.proposerInfo, styles.flexRowJustifySpaceBetween]}>
		<ThemedText type="bodyLarge">{beneficiaries.length > 1 ? "Beneficiaries" : "Beneficiary"}</ThemedText>
		<View style={styles.beneficiariesContainer}>
			{beneficiaries.map((beneficiary) => (
				<View
					style={styles.beneficiaryRow}
					key={beneficiary.address}
				>
					<UserInfo
						address={beneficiary.address}
						amount={beneficiary.amount}
						assetId={beneficiary.assetId}
					/>
				</View>
			))}
		</View>
	</ThemedView>
);

const styles = StyleSheet.create({
	proposerInfo: {
		padding: 12,
		borderRadius: 12,
		borderColor: "#383838",
		borderWidth: 1,
		gap: 20,
		flexWrap: "wrap"
	},
	flexRowJustifySpaceBetween: {
		flexDirection: "row",
		justifyContent: "space-between",
	},
	userInfoContainer: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center"
	},
	avatarContainer: {
		width: 24,
		height: 24,
		borderRadius: 12
	},
	avatarPlaceholder: {
		width: 24,
		height: 24,
		backgroundColor: "grey",
		borderRadius: 12
	},
	beneficiariesContainer: {
		flexDirection: "column",
		gap: 8
	},
	beneficiaryRow: {
		flexDirection: "row",
		gap: 8,
		alignItems: "center"
	}
});

export { ProposerInfo, BeneficiariesInfo };