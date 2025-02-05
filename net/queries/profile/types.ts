interface ProfileDetails {
    achievementBadges: any[]; //FIXME: type this
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

export default UserProfile;