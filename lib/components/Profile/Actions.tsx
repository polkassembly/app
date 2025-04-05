import { Ionicons } from "@expo/vector-icons";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { router } from "expo-router";
import { openBrowserAsync } from "expo-web-browser";
import { Skeleton } from "moti/skeleton";
import React from "react";
import { Dimensions, StyleSheet, TouchableOpacity, View } from "react-native";
import { IconBounties, IconDelegate, IconSettings, IconVote } from "../icons/Profile";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { ActionButton } from "../shared/button";

function Actions() {
  const screenWidth = Dimensions.get("window").width; // Get the full screen width

  return (
    <ThemedView
      type="secondaryBackground"
      style={[styles.container, { width: screenWidth }]} // Override the width
    >
      <Video
        source={require("@/assets/videos/actions.mp4")}
        style={[styles.video, { bottom: -200 }]} // Apply absolute positioning to the video
        resizeMode={ResizeMode.COVER}
        shouldPlay
        isLooping
        isMuted
      />
      {/* Apply the linear gradient */}
      <LinearGradient
        colors={["rgba(0, 0, 0, 0)", "#000000"]}
        start={{ x: 0.5, y: 0.18 }}
        end={{ x: 0.5, y: 0.46 }}
        style={[styles.gradient, { bottom: -200 }]} // Apply absolute positioning to the gradient
      />

      <View style={{ flexDirection: "column", gap: 20 }}>
        <ThemedText type="bodySmall">EXPLORE ACTIONS</ThemedText>
        <View style={styles.container2}>
          <TouchableOpacity onPress={() => router.push("/batch-vote")}>
            <ActionButton Icon={IconVote} text="Batch Vote" containerSize={68} iconSize={30} bordered />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openBrowserAsync("https://polkadot.polkassembly.io/delegation")}>
            <ActionButton Icon={IconDelegate} text="Delegate" containerSize={68} iconSize={30} bordered />
          </TouchableOpacity>

          <TouchableOpacity onPress={() => openBrowserAsync("https://polkadot.polkassembly.io/bounties")}>
            <ActionButton Icon={IconBounties} text="Bounties" containerSize={68} iconSize={30} bordered />
          </TouchableOpacity>
          <TouchableOpacity onPress={() => router.push("/settings")}>
            <ActionButton Icon={IconSettings} text="Settings" containerSize={68} iconSize={30} bordered />
          </TouchableOpacity>
        </View>
      </View>
    </ThemedView>
  );
}

const ActionsSkeleton = () => (
  <ThemedView type="secondaryBackground" style={{ padding: 10 }}>
    <View style={styles.actionsWrapper}>
      <Skeleton height={16} width={120} />
      <View style={styles.actionsRow}>
        {Array(4).fill(null).map((_, index) => (
          <SkeletonAction key={index} />
        ))}
      </View>
      <View style={styles.actionsRow}>
        {Array(4).fill(null).map((_, index) => (
          <SkeletonAction key={index} />
        ))}
      </View>
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
    marginLeft: -16,
    paddingHorizontal: 16,
    paddingVertical: 29,
    flexDirection: "column",
    position: "relative",
    overflow: "hidden",
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
  container2: {
    flexDirection: "row",
    justifyContent: "space-between",
    width: "100%",
  },
  actionsWrapper: {
    flexDirection: "column",
    gap: 20,
  },
  actionsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  iconWrapper: {
    alignItems: "center",
  },
});

export { Actions, ActionsSkeleton };
