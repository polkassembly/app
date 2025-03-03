import React, { useState } from "react";
import { View, useWindowDimensions } from "react-native";
import Carousel from "react-native-reanimated-carousel";
import GlitterBackground from "@/lib/components/icons/browser/glitter-background";
import { ThemedText } from "@/lib/components/ThemedText";
import { Colors } from "@/lib/constants/Colors";
import QuickActionCard, { QuickActionCardProps } from "./QuickActionCard"; // adjust the path as needed
import { StyleSheet } from "react-native";

const quickActions: QuickActionCardProps[] = [
  {
    title: "Bounties",
    subtitle: "See The Latest Hot\nBounties",
    button: "Go To Bounties",
    url: "https://polkadot.polkassembly.io/bounty-dashboard",
    imageSource: require("@/assets/images/browser/quick-action-bounties.png"),
  },
  {
    title: "Delegation",
    subtitle: "Delegate on\nPolkassembly",
    button: "Delegate Now",
    url: "https://polkadot.polkassembly.io/delegation",
    imageSource: require("@/assets/images/browser/quick-action-delegate.png"),
  },
  {
    title: "Calendar",
    subtitle: "Checkout Calendar\nOn Polkassembly",
    button: "See Calendar",
    url: "https://polkadot.polkassembly.io/calendar",
    imageSource: require("@/assets/images/browser/quick-action-calendar.png"),
  },
];

export default function QuickActions() {
  const size = useWindowDimensions();
  const [activeIndex, setActiveIndex] = useState(1);

  return (
    <View style={{ paddingTop: 16, backgroundColor: "#121216" }}>
      <GlitterBackground
        style={{
          zIndex: 5,
          top: 0,
          left: 0,
          position: "absolute",
          width: "100%",
        }}
      />
      <View style={{ justifyContent: "center", alignItems: "center" }}>
        <ThemedText
          type="bodySmall"
          style={[
            styles.quickActionHeading,
            {
              textShadowColor: Colors.dark.accent,
              fontWeight: 400,
            },
          ]}
        >
          POLKASSEMBLY
        </ThemedText>
        <ThemedText
          type="titleLarge"
          style={[
            styles.quickActionHeading,
            {
              textShadowColor: "#4766F9",
              fontWeight: 400,
              color: "#F0B44F",
            },
          ]}
        >
          QUICK ACTIONS
        </ThemedText>
      </View>

      <Carousel
        defaultIndex={1}
        width={size.width}
        height={300}
        windowSize={size.width / 3}
        data={quickActions}
        mode="parallax"
        snapEnabled={true}
        loop={false}
        onSnapToItem={(index) => setActiveIndex(index)}
        renderItem={(info) => (
          <View style={{ opacity: activeIndex === info.index ? 1 : 0.5 }}>
            <QuickActionCard {...info.item} />
          </View>
        )}
        modeConfig={{
          parallaxScrollingOffset: 240,
        }}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  quickActionHeading: {
    textAlign: "center",
    textShadowRadius: 0.1,
    textShadowOffset: {
      height: 2,
      width: -2,
    },
    padding: 1
  },
})