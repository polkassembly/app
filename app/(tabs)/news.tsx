import React from "react";
import {
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { NewsHeader, NewsSection, TopCoinsSection, TreasurySection } from "@/lib/components/news";
import { useThemeColor } from "@/lib/hooks";

export default function NewsScreen() {
  const backgroundColor = useThemeColor({}, "secondaryBackground")

  return (
    <SafeAreaView style={[styles.mainContainer, { backgroundColor }]}>
      <NewsHeader />
      <ScrollView style={styles.scrollView}>
        <TreasurySection />
        <TopCoinsSection />
        {
          Platform.OS !== "ios" && <NewsSection />
        }
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
    paddingTop: 10
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
    gap: 20,
  }
});