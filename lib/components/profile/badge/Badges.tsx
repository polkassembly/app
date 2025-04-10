import React, { useState } from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { ThemedText } from "@/lib/components/shared/text/ThemedText";
import { badgeDetails as badgeData, BadgeDetails, BADGEIMAGES } from "../../util/badgeInfo";
import { UserBadgeDetails } from "@/lib/types/user";
import { MotiView, AnimatePresence } from "moti";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useBottomSheet } from "@/lib/context/bottomSheetContext";
import BadgeInfo from "./BadgeInfo";
import IconArrowRightEnclosed from "../../icons/icon-arrow-right-enclosed";
import { ThemedView } from "../../shared/View";

interface BadgesProps {
  badges?: UserBadgeDetails[];
}

function Badges({ badges }: BadgesProps): JSX.Element {

  const [currentIndex, setCurrentIndex] = useState(0);

  const backgroundColor = useThemeColor({}, "background");
  const strokeColor = useThemeColor({}, "stroke");

  const { openBottomSheet } = useBottomSheet();

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
  const earnedCount = fullBadgeList.filter((badge) => badge.isUnlocked).length;

  // Compute 3 visible badges
  const visibleBadges = [];
  for (let i = 0; i < 3; i++) {
    const index = (currentIndex + i) % fullBadgeList.length;
    visibleBadges.push(fullBadgeList[index]);
  }

  // Handler to slide to the next badge
  const handleSlide = () => {
    setCurrentIndex((prev) => (prev + 1) % fullBadgeList.length);
  };

  const handleBadgeClick = (badge: BadgeDetails & { isUnlocked: boolean }) => {
    openBottomSheet(<BadgeInfo badge={badge} />)
  }

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
            <TouchableOpacity
              key={`${badge.name}`}
              style={[
                styles.badgeContainer,
                { backgroundColor }
              ]}
              onPress={() => handleBadgeClick(badge)}
            >
              <Image
                source={
                  badge.isUnlocked
                    ? BADGEIMAGES[badge.name]
                    : BADGEIMAGES[`${badge.name} Locked`]
                }
                style={styles.badgeImage}
                key={badge.name}
                resizeMode="contain"
              />
            </TouchableOpacity>
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