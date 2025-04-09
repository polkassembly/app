import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";
import { ThemedText } from "@/lib/components/shared/text/ThemedText";
import { ThemedView } from "../shared/View/ThemedView";
import { badgeDetails as badgeData, BadgeDetails } from "../util/badgeInfo";
import { UserBadgeDetails } from "@/lib/types/user";
import { MotiView, AnimatePresence } from "moti";
import IconArrowRightEnclosed from "../icons/icon-arrow-right-enclosed";
import { useThemeColor } from "@/lib/hooks/useThemeColor";

// Predefined Mapping of Images
const badgeImages: Record<string, any> = {
  "Decentralised Voice": require("@/assets/images/profile/badges/decentralised_voice.png"),
  "Decentralised Voice Locked": require("@/assets/images/profile/badges/decentralised_voice_locked.png"),
  "Fellow": require("@/assets/images/profile/badges/fellow.png"),
  "Fellow Locked": require("@/assets/images/profile/badges/fellow_locked.png"),
  "Council Member": require("@/assets/images/profile/badges/council.png"),
  "Council Member Locked": require("@/assets/images/profile/badges/council_locked.png"),
  "Active Voter": require("@/assets/images/profile/badges/active_voter.png"),
  "Active Voter Locked": require("@/assets/images/profile/badges/active_voter_locked.png"),
  "Whale": require("@/assets/images/profile/badges/whale-badge.png"),
  "Whale Locked": require("@/assets/images/profile/badges/whale_locked.png"),
};

interface BadgesProps {
  badges?: UserBadgeDetails[];
}

function Badges({ badges }: BadgesProps): JSX.Element {
  // Map badgeData and mark unlocked badges
  const badgesToShow: (BadgeDetails & { isUnlocked: boolean })[] = badgeData.map(
    (badge) => {
      const unlocked = badges?.find((b) => b.name === badge.name && b.check);
      return {
        ...badge,
        isUnlocked: !!unlocked,
      };
    }
  );

  const fullBadgeList = badgesToShow;
  const [currentIndex, setCurrentIndex] = useState(0);

  // Compute 3 visible badges (wrap-around if needed)
  const visibleBadges = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % fullBadgeList.length;
    visibleBadges.push(fullBadgeList[index]);
  }

  // Count of earned badges
  const earnedCount = fullBadgeList.filter((badge) => badge.isUnlocked).length;

  // Handler to slide to the next badge
  const handleSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % fullBadgeList.length);
  };

  const backgroundColor = useThemeColor({}, "background");
  const strokeColor = useThemeColor({}, "stroke");

  return (
    <ThemedView
      type="container"
      style={[
        styles.container,
        { borderColor: strokeColor },
        styles.border,
      ]}
    >
      <View>
        <ThemedText type="titleMedium1">
          Badges
        </ThemedText>
        {earnedCount > 0 && (
          <ThemedText type="bodySmall3">
            {earnedCount} Badges Earned
          </ThemedText>
        )}
      </View>
      <AnimatePresence exitBeforeEnter>
        <MotiView
          style={styles.carouselRow}
          from={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ type: 'timing', duration: 300 }}
          key={currentIndex}
        >
          {visibleBadges.map((badge) => (
            <View
              key={`${badge.name}`}
              style={[
                styles.badgeContainer,
                { backgroundColor }
              ]}
            >
              <Image
                source={
                  badge.isUnlocked
                    ? badgeImages[badge.name]
                    : badgeImages[`${badge.name} Locked`]
                }
                style={styles.badgeImage}
                key={badge.name}
                resizeMode="contain"
              />
            </View>
          ))}
        </MotiView>
      </AnimatePresence>
      <TouchableOpacity
        onPress={handleSlide}
      >
        <IconArrowRightEnclosed color="#FFF" iconHeight={40} iconWidth={40} />
      </TouchableOpacity>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
    paddingVertical: 16,
    flexDirection: "row",
    alignItems: "center",
    gap: 16
  },
  carouselRow: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",

  },
  badgeContainer: {
    borderRadius: 50,
    padding: 2,
    margin: 4,
    aspectRatio: 1,
    justifyContent: "center",
    alignItems: "center",
    flexShrink: 1
  },
  badgeImage: {
    width: "100%",
    height: "100%",
    aspectRatio: 1,
    maxWidth: 50,
    maxHeight: 50,
  },
  border: {
    borderWidth: 1,
    borderRadius: 15,
  }
});

export default Badges;