import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { IconNews } from "@/lib/components/icons/Profile";
import { ThemedText } from "@/lib/components/ThemedText";
import { Colors } from "@/lib/constants/Colors";
import WebView from "react-native-webview";
import { Asset } from "expo-asset";
import * as FileSystem from "expo-file-system";

export default function NewsScreen() {
  const [htmlContent, setHtmlContent] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHtmlAsset() {
      const asset = Asset.fromModule(require("@/assets/x-timeline-embed.html"));
      await asset.downloadAsync();
      const content = await FileSystem.readAsStringAsync(asset.localUri || asset.uri);
      setHtmlContent(content);
    }
    loadHtmlAsset();
  }, []);

  if (!htmlContent) {
    return (
      <View style={[styles.root, styles.center]}>
        <ActivityIndicator size="large" color={Colors.dark.tint} />
      </View>
    );
  }

  return (
    <View style={styles.root}>
      <View style={styles.header}>
        <IconNews color={Colors.dark.text} />
        <ThemedText type="titleMedium">News</ThemedText>
      </View>
      <View style={styles.twitterContainer}>
        <TwitterEmbed htmlContent={htmlContent} loading={loading} setLoading={setLoading} />
      </View>
    </View>
  );
}

interface TwitterEmbedProps {
  htmlContent: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function TwitterEmbed({ htmlContent, loading, setLoading }: TwitterEmbedProps) {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ html: htmlContent }}
        style={styles.webview}
        scrollEnabled={true}
        onLoadStart={() => setLoading(true)}
        onLoadEnd={() => setLoading(false)}
      />
      {loading && (
        <View style={styles.loadingOverlay}>
          <ActivityIndicator size="large" color={Colors.dark.tint} />
        </View>
      )}
    </View>
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
  header: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    marginTop: 16,
    gap: 16,
  },
  twitterContainer: {
    flex: 1,
  },
  webview: {
    flex: 1,
  },
  loadingOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
});
