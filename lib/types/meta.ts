import { ENetwork } from "./post";

export interface ITreasuryStats {
	network: ENetwork;
	createdAt: Date;
	updatedAt: Date;
	relayChain: {
		dot?: string;
		myth?: string;
		[key: string]: string | undefined;
	};
	ambassador?: {
		usdt?: string;
		[key: string]: string | undefined;
	};
	assetHub?: {
		dot?: string;
		usdc?: string;
		usdt?: string;
		[key: string]: string | undefined;
	};
	hydration?: {
		dot?: string;
		usdc?: string;
		usdt?: string;
		[key: string]: string | undefined;
	};
	bounties?: {
		dot?: string;
		[key: string]: string | undefined;
	};
	fellowship?: {
		dot?: string;
		usdt?: string;
		[key: string]: string | undefined;
	};
	total?: {
		totalDot?: string;
		totalUsdc?: string;
		totalUsdt?: string;
		totalMyth?: string;
		[key: string]: string | undefined;
	};
	loans?: {
		dot?: string;
		usdc?: string;
		[key: string]: string | undefined;
	};
	nativeTokenUsdPrice?: string;
	nativeTokenUsdPrice24hChange?: string;
	[key: string]: unknown;
}