import React, { useState, useEffect } from "react";
import { StyleSheet, View, ActivityIndicator } from "react-native";
import { IconNews } from "@/lib/components/icons/Profile";
import { ThemedText } from "@/lib/components/ThemedText";
import { Colors } from "@/lib/constants/Colors";
import WebView from "react-native-webview";
import { Asset } from "expo-asset";

export default function NewsScreen() {
  const [htmlUri, setHtmlUri] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadHtmlAsset() {
      const asset = Asset.fromModule(require("@/assets/x-timeline-embed.html"));
      await asset.downloadAsync();
      setHtmlUri(asset.uri);
    }
    loadHtmlAsset();
  }, []);

  if (!htmlUri) {
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
        <TwitterEmbed htmlUri={htmlUri} loading={loading} setLoading={setLoading} />
      </View>
    </View>
  );
}

interface TwitterEmbedProps {
  htmlUri: string;
  loading: boolean;
  setLoading: (loading: boolean) => void;
}

function TwitterEmbed({ htmlUri, loading, setLoading }: TwitterEmbedProps) {
  return (
    <View style={{ flex: 1 }}>
      <WebView
        originWhitelist={["*"]}
        source={{ uri: htmlUri }}
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
