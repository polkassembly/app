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
import { Skeleton } from "moti/skeleton";
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
  "Whale": require("@/assets/images/profile/badges/whale.png"),
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

  // Calculate responsive size based on device width (15% of width)
  const { width } = Dimensions.get("window");
  const responsiveSize = Math.round(width * 0.12);

  return (
    <ThemedView type="container" style={[
      styles.container,
      { borderColor: strokeColor },
      styles.border,
      
    ]}>
      <View>
        <ThemedText type="bodyMedium1" style={styles.title}>
          Badges
        </ThemedText>
        {earnedCount > 0 && (
          <ThemedText type="bodySmall" style={styles.subtitle}>
            {earnedCount} Badges Earned
          </ThemedText>
        )}
      </View>

      <View
        style={{
          flexDirection: "row",
          alignItems: "center",
          justifyContent: "space-between",
          flex: 1,
        }}
      >
        <View
          style={[
            styles.carouselRow,
            { flex: 1, overflow: "hidden", gap: width * 0.05, width: 200 },
          ]}
        >
          <AnimatePresence>
            {visibleBadges.map((badge) => (
              <MotiView
                key={`${badge.name}-${currentIndex}`}
                from={{ translateX: 30, opacity: 0, scale: 0.8 }}
                animate={{ translateX: 0, opacity: 1, scale: 1 }}
                exit={{ translateX: -30, opacity: 0, scale: 0.8 }}
                transition={{ type: "timing", duration: 300 }}
                style={[
                  styles.badgeIconContainer,
                  {
                    width: responsiveSize,
                    height: responsiveSize,
                    backgroundColor,
                  },
                ]}
              >
                <Image
                  source={
                    badge.isUnlocked
                      ? badgeImages[badge.name]
                      : badgeImages[`${badge.name} Locked`]
                  }
                  style={{ width: responsiveSize - 2, height: responsiveSize - 2 }}
                  resizeMode="contain"
                />
              </MotiView>
            ))}
          </AnimatePresence>
        </View>
        {fullBadgeList.length > 3 && (
          <TouchableOpacity onPress={handleSlide} style={styles.chevronContainer}>
            <IconArrowRightEnclosed color="#FFF" iconHeight={40} iconWidth={40} />
          </TouchableOpacity>
        )}
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 20,
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
  carouselRow: {
    flexDirection: "row",
    alignItems: "center",
  },
  badgeIconContainer: {
    borderRadius: 25,
    justifyContent: "center",
    alignItems: "center",
  },
  chevronContainer: {
    marginLeft: 10,
  },
  border: {
    borderWidth: 1,
    borderRadius: 15,
  }
});

export default Badges;
