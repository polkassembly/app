import React from "react";
import { StyleSheet, View } from "react-native";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { openBrowserAsync } from "expo-web-browser";
import { router } from "expo-router";
import { Skeleton } from "moti/skeleton";

import { IconBounties, IconDelegate, IconSettings, IconVote } from "../icons/Profile";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { ActionButton } from "../shared/button";
import { useThemeColor } from "@/lib/hooks";
import { useAuthModal } from "@/lib/context/authContext";
import { getUserIdFromStorage } from "@/lib/net/queries/utils";

function Actions() {
  const strokeColor = useThemeColor({}, "stroke");
  const { openLoginModal } = useAuthModal();
  const userId = getUserIdFromStorage();

  const handleVote = () => {
    if (!userId) {
      openLoginModal("Login to access batch vote", false);
      return;
    }
    router.push("/batch-vote");
  };

  const handleSettings = () => {
    if (!userId) {
      openLoginModal("Login to access settings", false);
      return;
    }
    router.push("/settings");
  };

  return (
    <ThemedView
      type="secondaryBackground"
      style={[styles.container, { borderColor: strokeColor }]}
    >
      <Video
        source={require("@/assets/videos/actions.mp4")}
        style={[styles.video, { bottom: -200, opacity: 0.8 }]}
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />

      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "#000000"]}
        start={{ x: 0.5, y: 0.18 }}
        end={{ x: 0.5, y: 0.46 }}
        style={[styles.gradient, { bottom: -100 }]}
      />

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
          />
          <ActionButton
            Icon={IconDelegate}
            text="Delegate"
            containerSize={68}
            iconSize={30}
            bordered
            onPress={() => openBrowserAsync("https://polkadot.polkassembly.io/delegation")}
          />
          <ActionButton
            Icon={IconBounties}
            text="Bounties"
            containerSize={68}
            iconSize={30}
            bordered
            onPress={() => openBrowserAsync("https://polkadot.polkassembly.io/bounties")}
          />
          <ActionButton
            Icon={IconSettings}
            text="Settings"
            containerSize={68}
            iconSize={30}
            bordered
            onPress={handleSettings}
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
