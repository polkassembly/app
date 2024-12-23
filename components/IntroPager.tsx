import { Colors } from "@/constants/Colors";
import React, { ReactNode, useState } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import PagerView from "react-native-pager-view";

export interface IntroPagerProps {
  style: StyleProp<ViewStyle>;
  children: ReactNode[];
}

export default function IntroPager({ style, children }: IntroPagerProps) {
  const [currentPage, setCurrentPage] = useState(0);

  return (
    <View style={[styles.container, style]}>
      <PagerView
        style={styles.pager}
        initialPage={0}
        onPageScroll={(e) => setCurrentPage(e.nativeEvent.position)}
      >
        {children}
      </PagerView>

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
      {new Array(count).fill(null).map((_, i) => (
        <View
          key={i}
          style={
            currentPage == i
              ? styles.indicatorItemSelected
              : styles.indicatorItem
          }
        />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    display: "flex",
    flexDirection: "column",
    gap: 32,
  },

  pager: {
    flex: 1,

    borderColor: "pink",
    borderWidth: 1,
  },

  indicator: {

    display: "flex",
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
    backgroundColor: Colors.dark.accent,
  },
});
