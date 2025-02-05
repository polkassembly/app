import React from "react";
import { Pressable, StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { IconPoints } from "@/components/icons/icon-points";
import { IconQR } from "@/components/icons/icon-qr";
import { ThemedText } from "@/components/ThemedText";

const styles = StyleSheet.create({
  pointsWrapper: {
    width: "100%",
  },
  pointsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  background: {
    position: "absolute",
    top: 0,
    left: 0,
    height: "100%",
    width: "100%",
  },
});

interface pointsViewProps {
  points: number;
}

export function PointsView( { points }: pointsViewProps ) {
  return (
    <View style={styles.pointsWrapper}>
      {/* Background SVG */}
      <Svg style={styles.background} viewBox="0 0 100% 100%">
        <Defs>
          <LinearGradient id="grad" gradientTransform="rotate(45)">
            <Stop offset="0" stopColor="#df6a7d" stopOpacity={1} />
            <Stop offset="33.3%" stopColor="#c941a2" stopOpacity={1} />
            <Stop offset="66.6%" stopColor="#fe3761" stopOpacity={1} />
            <Stop offset="100%" stopColor="#781d2c" stopOpacity={1} />
          </LinearGradient>
        </Defs>
        <Rect
          rx="20px"
          x="0"
          y="0"
          width="100%"
          height="100%"
          fill="url(#grad)"
        />
      </Svg>

      {/* Points Content */}
      <View style={styles.pointsContainer}>
        <View style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <ThemedText type="bodyMedium3" style={{ fontWeight: "400"}}>Your Points</ThemedText>
          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: 8,
            }}
          >
            <IconPoints style={{ width: 24 }} />
            <ThemedText type="titleLarge" style={{ fontWeight: "700", lineHeight: 37.5 }}>
              {points}
            </ThemedText>
          </View>
        </View>
        <Pressable
          style={{
            backgroundColor: "#FFFFFF12",
            padding: 8,
            borderRadius: 8,
          }}
        >
          <IconQR iconHeight={28} iconWidth={28} />
        </Pressable>
      </View>
    </View>
  );
}
