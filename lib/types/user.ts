export enum EUserBadge {
	DECENTRALISED_VOICE = 'Decentralised Voice',
	FELLOW = 'Fellow',
	COUNCIL = 'Council Member',
	ACTIVE_VOTER = 'Active Voter',
	WHALE = 'Whale'
	// STEADFAST_COMMENTOR = 'Steadfast Commentor',
	// GM_VOTER = 'GM Voter',
	// POPULAR_DELEGATE = 'Popular Delegate'
}

export interface UserBadgeDetails {
	name: EUserBadge;
	check: boolean;
	unlockedAt: string;
}

interface ProfileDetails {
    achievementBadges: UserBadgeDetails[];
    badges: string[];
    socialLinks: any[]; //FIXME: type this
    bio: string;
    image: string;
    title: string;
    coverImage: string;
};

interface UserProfile {
    id: number;
    username: string;
    profileScore: number;
    addresses: string[];
    rank: number;
    createdAt: string;
    profileDetails: ProfileDetails;
};

export { UserProfile };