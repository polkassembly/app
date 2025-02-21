import { bgColors } from "@/lib/constants/Colors";
import { useColorScheme } from "@/lib/hooks/useColorScheme";

export function getOriginBadgeStyle(origin: string) {
  const theme = useColorScheme() || "dark";
  const originBadges = bgColors[theme].originBadges;

  const auctionOrigins = [
    'Auction',
    'BigTipper',
    'BigSpender',
    'Bounties',
    'ChildBounties',
    'SmallSpender',
    'SmallTipper',
    'Treasurer',
    'Treasury',
    'Governance',
  ];
  const communityOrigins = [
    'Community',
    'Democracy',
    'GeneralAdmin',
    'ReferendumCanceller',
    'ReferendumKiller',
    'LeaseAdmin',
    'Staking',
  ];
  const councilOrigins = ['Council', 'Root', 'Whitelist', 'WishForChange', 'StakingAdmin'];
  const technicalOrigins = [
    'Technical',
    'Tech',
    'AuctionAdmin',
    'WhitelistedCaller',
    'FellowshipAdmin',
    'Members',
  ];
  const generalOrigins = ['General', 'Upgrade'];

  if (auctionOrigins.includes(origin)) {
    return { backgroundColor: originBadges.auction, color: "#AC6A30" };
  }
  if (communityOrigins.includes(origin)) {
    return {
      backgroundColor: originBadges.community,
      color: theme === "light" ? "#003366" : "#FFFFFF",
    };
  }
  if (councilOrigins.includes(origin)) {
    return { backgroundColor: originBadges.council, color: "#407AFC" };
  }
  if (technicalOrigins.includes(origin)) {
    return {
      backgroundColor: originBadges.technical,
      color: theme === "light" ? "#8B5E3C" : "#FFFFFF",
    };
  }
  if (generalOrigins.includes(origin)) {
    return {
      backgroundColor: originBadges.general,
      color: theme === "light" ? "#7A2B1D" : "#FFFFFF",
    };
  }
  return { backgroundColor: originBadges.default };
}
