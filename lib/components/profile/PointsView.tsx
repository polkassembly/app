import React, { memo } from "react";
import { StyleSheet, View } from "react-native";
import Svg, { Defs, LinearGradient, Rect, Stop } from "react-native-svg";
import { IconPoints } from "@/lib/components/icons/icon-points";
import { ThemedText } from "@/lib/components/shared/text/ThemedText";
import { Skeleton } from "moti/skeleton";

interface pointsViewProps {
  points?: number;
}

function PointsView({ points }: pointsViewProps) {
  return (
    <View style={styles.pointsWrapper}>
      <GradientBackground />
      {/* Points Content */}
      <View style={styles.pointsContainer}>
        <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
          <ThemedText type="bodyMedium3" >Your Points</ThemedText>
          {
            points && (
              <View
                style={{
                  flexDirection: "row",
                  alignItems: "center",
                  gap: 8,
                }}
              >
                <IconPoints iconWidth={24} iconHeight={24} />
                <ThemedText type="titleLarge" style={{ fontWeight: "700", lineHeight: 37.5 }}>
                  {points || 0}
                </ThemedText>
              </View>
            )
          }
        </View>
      </View>
    </View>
  );
}

const GradientBackground = memo(() => {
  return (
    < Svg style={styles.background} height="100%" width="100%" >
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
    </Svg >
  )
})

const styles = StyleSheet.create({
  pointsWrapper: {
    width: "100%",
  },
  pointsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "flex-start",
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

export default PointsView;