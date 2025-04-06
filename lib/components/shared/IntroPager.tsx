import { Colors } from "@/lib/constants/Colors";
import { LinearGradient } from "expo-linear-gradient";
import React, { ReactNode, useState } from "react";
import {
  Dimensions,
  ScrollView,
  StyleProp,
  StyleSheet,
  View,
  ViewStyle,
} from "react-native";

export interface IntroPagerProps {
  style: StyleProp<ViewStyle>;
  children: ReactNode[];
}

export default function IntroPager({ style, children }: IntroPagerProps) {
  const [currentPage, setCurrentPage] = useState(0);
  const windowWidth = Dimensions.get("window").width;

  const handleScroll = (event: any) => {
    const page = Math.round(event.nativeEvent.contentOffset.x / windowWidth);
    setCurrentPage(page);
  };

  return (
    <View style={[styles.container, style]}>
      <ScrollView
        horizontal
        pagingEnabled
        snapToInterval={windowWidth}
        decelerationRate="fast"
        onScroll={handleScroll}
        scrollEventThrottle={16}
        showsHorizontalScrollIndicator={false}
        // Ensure content container width exactly fits all slides
        contentContainerStyle={{ width: windowWidth * children.length }}
      >
        {children.map((child, index) => (
          <View key={index} style={{ width: windowWidth }}>
            {child}
          </View>
        ))}
      </ScrollView>
      <Indicator count={children.length} currentPage={currentPage} />
    </View>
  );
}

interface IndicatorProps {
  count: number;
  currentPage: number;
}

function Indicator({ count, currentPage }: IndicatorProps) {
  return (
    <View style={styles.indicator}>
      {new Array(count).fill(null).map((_, i) =>
        currentPage === i ? (
          <LinearGradient
          key={i}
          colors={["#E5007A", "#ECA5C7"]}
          start={{ x: 0.9, y: 0.2 }}
          end={{ x: 0.1, y: 0.8 }}
          style={styles.indicatorItemSelected}
        />
        ) : (
          <View key={i} style={styles.indicatorItem} />
        )
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    flexDirection: "column",
    gap: 32,
  },
  indicator: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  indicatorItem: {
    borderRadius: 5,
    width: 10,
    height: 10,
    backgroundColor: Colors.dark.text,
  },
  indicatorItemSelected: {
    borderRadius: 5,
    width: 42,
    height: 10,
  },
});
