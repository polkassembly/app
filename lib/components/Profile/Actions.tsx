import React from "react";
import { StyleSheet, Dimensions, View } from "react-native";
import { ThemedView } from "../ThemedView";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { IconBounties, IconDelegate, IconVote, IconCalendar, IconNews, IconSettings } from "../icons/Profile";
import { ThemedText } from "../ThemedText";
import { Ionicons } from "@expo/vector-icons";
import { Skeleton } from "moti/skeleton";

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
          <IconView Icon={IconVote} text="Batch Vote" />
          <IconView Icon={IconDelegate} text="Delegate" />

          <ThemedView type="container" style = {styles.referContainer}>
            <ThemedText type="titleMedium">RDJ68</ThemedText>
            <Ionicons name="copy" size={24} color="white" />
          </ThemedView>
        </View>

        <View style={styles.container2}>
          <IconView Icon={IconBounties} text="Bounties" />
          <IconView Icon={IconCalendar} text="Calendar" />
          <IconView Icon={IconNews} text="News" />
          <IconView Icon={IconSettings} text="Settings" />
        </View>
      </View>
    </ThemedView>
  );
}

const ActionsSkeleton = () => (
  <ThemedView type="secondaryBackground" style={{padding: 10}}>
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
  icon: {
    width: 26,
    height: 26,
  },
  iconContainer: {
    width: 68,
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#383838",
  },
  referContainer: {
    width: "46%",
    height: 68,
    borderRadius: 34,
    justifyContent: "center",
    alignItems: "center",
    borderWidth: 2,
    borderColor: "#383838",
    flexDirection: "row",
    gap: 10,
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

function IconView({
  Icon,
  text,
}: {
  Icon: (props: { color: string; size: number }) => JSX.Element;
  text: string;
}) {
  return (
    <View style={{ alignItems: "center" }}>
      <ThemedView type="container" style={styles.iconContainer}>
        <Icon color="#FFF" size={30} />
      </ThemedView>
      <ThemedText type="bodySmall">{text}</ThemedText>
    </View>
  );
}

export { Actions, ActionsSkeleton };