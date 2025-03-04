import React, { useState, useEffect, useRef, useMemo } from "react";
import {
  StyleSheet,
  View,
  ActivityIndicator,
  Animated,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { IconNews } from "@/lib/components/icons/Profile";
import { ThemedText } from "@/lib/components/ThemedText";
import { Colors } from "@/lib/constants/Colors";
import WebView from "react-native-webview";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { IconPoints } from "@/lib/components/icons/icon-points";
import { NewsHeader, TopCoinsSection, TreasurySection, TwitterEmbed } from "@/lib/components/news";

// Cache to store the HTML content
let cachedHtmlContent: string | null = null;

export default function NewsScreen() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Load HTML asset and coin data on mount
  useEffect(() => {
    async function loadHtmlAsset() {
      try {
        if (cachedHtmlContent) {
          setHtmlContent(cachedHtmlContent);
          return;
        }
        const asset = Asset.fromModule(require("@/assets/x-timeline-embed.html"));
        await asset.downloadAsync();
        const content = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
        cachedHtmlContent = content;
        setHtmlContent(content);
      } catch (err) {
        console.error("Failed to load HTML asset:", err);
        setError("Failed to load news content. Please try again later.");
      }
    }

    loadHtmlAsset();
  }, []);

  if (error) {
    return (
      <View style={[styles.root, styles.center]}>
        <ThemedText type="bodyMedium1">{error}</ThemedText>
        <TouchableOpacity
          style={styles.retryButton}
          onPress={() => {
            setError(null);
            // Clear cache to force reload
            cachedHtmlContent = null;
            // Reload content
            async function loadHtmlAsset() {
              try {
                const asset = Asset.fromModule(require("@/assets/x-timeline-embed.html"));
                await asset.downloadAsync();
                const content = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
                cachedHtmlContent = content;
                setHtmlContent(content);
              } catch (err) {
                console.error("Failed to load HTML asset:", err);
                setError("Failed to load news content. Please try again later.");
              }
            }
            loadHtmlAsset();
          }}
        >
          <ThemedText type="bodyMedium1">Retry</ThemedText>
        </TouchableOpacity>
      </View>
    );
  }

  if (!htmlContent) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={Colors.dark.tint} />
      </View>
    );
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: Colors.dark.secondaryBackground, paddingTop: 10 }}>
      <NewsHeader />
      <ScrollView style={{ flex: 1, marginTop: 20, gap: 20 }}>

        <TreasurySection/>
        <TopCoinsSection />
        <TwitterEmbed
          htmlContent={htmlContent}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.secondaryBackground,
  },
  center: {
    justifyContent: "center",
    alignItems: "center",
  },
  retryButton: {
    marginTop: 16,
    paddingHorizontal: 20,
    paddingVertical: 10,
    backgroundColor: Colors.dark.tint,
    borderRadius: 4,
  },
});