import React from "react";
import { View, StyleSheet, Image } from "react-native";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "../ThemedView";
import { badgeDetails as badgeData, BadgeDetails } from "../util/badgeInfo";
import { UserBadgeDetails } from "@/net/queries/profile/types";
import { Skeleton } from "moti/skeleton";

// Predefined Mapping of Images (Static Require)
const badgeImages: Record<string, any> = {
  "Decentralised Voice": require("@/assets/images/profile/badges/decentralised_voice.png"),
  "Decentralised Voice Locked": require("@/assets/images/profile/badges/decentralised_voice_locked.png"),
  "Fellow": require("@/assets/images/profile/badges/fellow.png"),
  "Fellow Locked": require("@/assets/images/profile/badges/fellow_locked.png"),
  "Council Member": require("@/assets/images/profile/badges/council.png"),
  "Council Member Locked": require("@/assets/images/profile/badges/council_locked.png"),
  "Active Voter": require("@/assets/images/profile/badges/active_voter.png"),
  "Active Voter Locked": require("@/assets/images/profile/badges/active_voter_locked.png"),
  "Whale": require("@/assets/images/profile/badges/whale.png"),
  "Whale Locked": require("@/assets/images/profile/badges/whale_locked.png"),
};

interface BadgesProps {
  badges?: UserBadgeDetails[];
}

function Badges({ badges }: BadgesProps): JSX.Element {
  const badgesToShow: (BadgeDetails & { isUnlocked: boolean })[] = badgeData.map((badge) => {
    const unlocked = badges?.find((b) => b.name === badge.name && b.check);
    return {
      ...badge,
      isUnlocked: !!unlocked,
    };
  });

  // Get unlocked badges
  const unlockedBadges = badgesToShow.filter((badge) => badge.isUnlocked);

  // Ensure we have 3 badges, filling the rest with locked ones if needed
  let displayedBadges = unlockedBadges.slice(0, 4);

  while (displayedBadges.length < 4) {
    const lockedBadge = badgesToShow.find(
      (badge) => !badge.isUnlocked && !displayedBadges.some(b => b.name === badge.name)
    );

    if (!lockedBadge) break; // No more unique locked badges available

    displayedBadges.push(lockedBadge);
  }


  const earnedCount = unlockedBadges.length;

  return (
    <ThemedView type="container" style={styles.container}>
      <View>
        <ThemedText type="bodyMedium1" style={styles.title}>Badges</ThemedText>
        {
          earnedCount > 0 && (
            <ThemedText type="bodySmall" style={styles.subtitle}>
              {earnedCount} Badges Earned
            </ThemedText>
          )
        }
      </View>

      <View style={styles.badgesRow}>
        {displayedBadges.map((badge) => (
          <ThemedView type="background" key={badge.name} style={styles.badgeIconContainer}>
            <Image
              source={badge.isUnlocked ? badgeImages[badge.name] : badgeImages[`${badge.name} Locked`]}
              style={styles.badgeImage}
              resizeMode="contain"
            />
          </ThemedView>
        ))}
      </View>
    </ThemedView>
  );
}

const BadgesSkeleton = () => (
  <ThemedView type="container" style={styles.container}>
    <View>
      <Skeleton height={12} width={80} />
    </View>

    <View style={styles.badgesRow}>
      {Array(4)
        .fill(null)
        .map((_, index) => (
          <SkeletonBadge key={index}/>
        ))}
    </View>
  </ThemedView>
);

const SkeletonBadge = () => (
  <ThemedView type="background" style={styles.badgeIconContainer}>
    <Skeleton height={45} width={45} radius={25} />
  </ThemedView>
);

const styles = StyleSheet.create({
  container: {
    padding: 20,
    borderRadius: 15,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: 20,
  },
  title: {
    fontSize: 18,
  },
  subtitle: {
    fontSize: 10,
    lineHeight: 15,
  },
  badgesRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  badgeIconContainer: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
    marginHorizontal: 10,
    width: 52,
    height: 52,
  },
  badgeImage: {
    width: 50,
    height: 50,
  },
});

export { Badges, BadgesSkeleton };