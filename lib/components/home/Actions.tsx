import React, { useState } from "react";
import { StyleSheet, View } from "react-native";
import { openBrowserAsync } from "expo-web-browser";
import { router } from "expo-router";
import { Skeleton } from "moti/skeleton";

import { IconBounties, IconDelegate, IconSettings, IconVote } from "../icons/Profile";
import { ThemedText } from "../shared/text/ThemedText";
import { ThemedView } from "../shared/View/ThemedView";
import { ActionButton } from "../shared/button";
import { useThemeColor } from "@/lib/hooks";
import { useAuthModal } from "@/lib/context/authContext";
import { useProfileStore } from "@/lib/store/profileStore";

function Actions() {
  const strokeColor = useThemeColor({}, "stroke");
  const { openLoginModal } = useAuthModal();
  const user = useProfileStore((state) => state.profile);
  const [isNavigating, setIsNavigating] = useState(false);

  const navigateOnce = async (path: string) => {
    if (isNavigating) return; // Prevent navigation if already navigating
    
    setIsNavigating(true);
    
    try {
      await router.push(path as any);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      // Reset navigation state after a delay
      setTimeout(() => {
        setIsNavigating(false);
      }, 800);
    }
  };

  const handleExternalLink = async (url: string) => {
    if (isNavigating) return;
    
    setIsNavigating(true);
    
    try {
      await openBrowserAsync(url);
    } catch (error) {
      console.error("Failed to open external link:", error);
    } finally {
      setTimeout(() => {
        setIsNavigating(false);
      }, 800);
    }
  };

  const handleVote = () => {
    if (!user) {
      openLoginModal("Login to access batch vote", false);
      return;
    }
    navigateOnce("/batch-vote");
  };

  const handleSettings = () => {
    if (!user) {
      openLoginModal("Login to access settings", false);
      return;
    }
    navigateOnce("/settings");
  };

  return (
    <ThemedView
      type="secondaryBackground"
      style={[styles.container, { borderColor: strokeColor }]}
    >
      <View style={styles.content}>
        <ThemedText type="bodySmall">EXPLORE ACTIONS</ThemedText>
        <View style={styles.actionsRow}>
          <ActionButton
            Icon={IconVote}
            text="Batch Vote"
            containerSize={68}
            iconSize={30}
            bordered
            onPress={handleVote}
            disabled={isNavigating}
          />
          <ActionButton
            Icon={IconDelegate}
            text="Delegate"
            containerSize={68}
            iconSize={30}
            bordered
            onPress={() => handleExternalLink("https://polkadot.polkassembly.io/delegation")}
            disabled={isNavigating}
          />
          <ActionButton
            Icon={IconBounties}
            text="Bounties"
            containerSize={68}
            iconSize={30}
            bordered
            onPress={() => handleExternalLink("https://polkadot.polkassembly.io/bounties")}
            disabled={isNavigating}
          />
          <ActionButton
            Icon={IconSettings}
            text="Settings"
            containerSize={68}
            iconSize={30}
            bordered
            onPress={handleSettings}
            disabled={isNavigating}
          />
        </View>
      </View>
    </ThemedView>
  );
}

const ActionsSkeleton = () => (
  <ThemedView type="secondaryBackground" style={styles.skeletonWrapper}>
    <View style={styles.actionsWrapper}>
      <Skeleton height={16} width={120} />
      {[...Array(2)].map((_, rowIndex) => (
        <View style={styles.actionsRow} key={rowIndex}>
          {[...Array(4)].map((_, i) => (
            <SkeletonAction key={i} />
          ))}
        </View>
      ))}
    </View>
  </ThemedView>
);

const SkeletonAction = () => (
  <View style={styles.iconWrapper}>
    <Skeleton height={50} width={50} radius={25} />
    <Skeleton height={12} width={60} />
  </View>
);

const styles = StyleSheet.create({
  container: {
    paddingVertical: 29,
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
    borderTopWidth: 1,
    borderBottomWidth: 1,
  },
  video: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    left: 0,
  },
  gradient: {
    ...StyleSheet.absoluteFillObject,
    top: 0,
    left: 0,
  },
  content: {
    flexDirection: "column",
    gap: 20,
    paddingHorizontal: 16,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  actionsWrapper: {
    flexDirection: "column",
    gap: 20,
  },
  iconWrapper: {
    alignItems: "center",
  },
  skeletonWrapper: {
    padding: 10,
  },
});

export { Actions, ActionsSkeleton };