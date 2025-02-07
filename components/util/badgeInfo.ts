import { EUserBadge } from "@/net/queries/profile/types";

export interface BadgeDetails {
	img: string;
	name: EUserBadge;
	lockImg?: string;
	requirements: {
		locked: string | ((network: string) => string);
		unlocked: string | ((network: string) => string);
	};
}

export const EUserBadges = ['Decentralised Voice', 'Fellow', 'Council Member', 'Active Voter', 'Whale', 'Steadfast Commentor', 'GM Voter', 'Popular Delegate'];

export const badgeDetails: BadgeDetails[] = [
	{
		img: '@/assets/images/profile/badges/decentralised_voice.png',
		lockImg: '@/assets/images/profile/badges/decentralised_voice_locked.png',
		name: EUserBadge.DECENTRALISED_VOICE,
		requirements: {
			locked: (network: string) => `You must become a delegate on the ${network} network and aim to receive 1,000,000 tokens with a 6x conviction.`,
			unlocked: (network: string) => `Congratulations! You’ve received a delegation of 1,000,000 tokens at 6x conviction from the Web3 Foundation on the ${network} network.`
		}
	},
	{
		img: '@/assets/images/profile/badges/fellow.png',
		lockImg: '@/assets/images/profile/badges/fellow_locked.png',
		name: EUserBadge.FELLOW,
		requirements: {
			locked: 'You must achieve a minimum rank of 1 to unlock the Fellow badge.',
			unlocked: 'Well done! You’ve achieved Rank 1 or higher and unlocked the Fellow badge.'
		}
	},
	{
		img: '@/assets/images/profile/badges/council.png',
		lockImg: '@/assets/images/profile/badges/council_locked.png',
		name: EUserBadge.COUNCIL,
		requirements: {
			locked: 'You must be elected as a member of the governance council to unlock this badge.',
			unlocked: 'You are recognized as a member of the governance council. Badge unlocked!'
		}
	},
	{
		img: '@/assets/images/profile/badges/active_voter.png',
		lockImg: '@/assets/images/profile/badges/active_voter_locked.png',
		name: EUserBadge.ACTIVE_VOTER,
		requirements: {
			locked: 'To unlock, vote on at least 15% of proposals, with a minimum participation in 5 proposals.',
			unlocked: 'You have actively voted on at least 15% of key proposals and unlocked the Active Voter badge.'
		}
	},
	{
		img: '@/assets/images/profile/badges/whale.png',
		lockImg: '@/assets/images/profile/badges/whalelocked.png',
		name: EUserBadge.WHALE,
		requirements: {
			locked: 'You must accumulate voting power equal to or greater than 0.05% of the total network supply.',
			unlocked: 'You hold significant voting power, equal to or greater than 0.05% of the total supply, and have unlocked the Whale badge.'
		}
	}
];
