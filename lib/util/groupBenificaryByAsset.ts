import { NETWORKS_DETAILS } from "../constants/networks";
import { IBeneficiary, ENetwork } from "../types/post";
import BN from "bn.js";

export const groupBeneficiariesByAsset = (beneficiaries: IBeneficiary[] | undefined | null, network: ENetwork): Record<string, BN> => {
	if (!beneficiaries || !Array.isArray(beneficiaries) || !network || !NETWORKS_DETAILS[network as ENetwork]) {
		return {};
	}

	return beneficiaries.reduce((acc: Record<string, BN>, curr: IBeneficiary) => {
		if (!curr) return acc;

		const assetId = curr.assetId || NETWORKS_DETAILS[network as ENetwork].tokenSymbol;

		if (!assetId) return acc;

		if (!acc[assetId as string]) {
			acc[assetId as string] = new BN(0);
		}

		try {
			const amount = new BN(curr.amount || '0');
			acc[assetId as string] = acc[assetId as string].add(amount);
		} catch (error) {
			console.error(`Error processing beneficiary amount: ${error}`);
		}

		return acc;
	}, {});
};
