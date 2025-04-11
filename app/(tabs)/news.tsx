import React from "react";
import {
  StyleSheet,
  ScrollView,
  Platform,
} from "react-native";
import { NewsHeader, NewsSection, TopCoinsSection, TreasurySection } from "@/lib/components/news";
import { ThemedView } from "@/lib/components/shared/View";

export default function NewsScreen() {
  return (
    <ThemedView type="secondaryBackground" style={{ flex: 1}}>
      <NewsHeader />
      <ScrollView style={styles.scrollView}>
        <TreasurySection />
        <TopCoinsSection />
        {
          Platform.OS !== "ios" && <NewsSection />
        }
      </ScrollView>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  mainContainer: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
    marginTop: 20,
    gap: 20,
  }
});