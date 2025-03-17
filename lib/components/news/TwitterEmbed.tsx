import React, { useState, useRef, useMemo } from "react";
import { View, Dimensions, ActivityIndicator, StyleSheet } from "react-native";
import { ThemedText } from "@/lib/components/ThemedText";
import { Colors } from "@/lib/constants/Colors";
import WebView from "react-native-webview";

interface TwitterEmbedProps {
  htmlContent: string;
}

function TwitterEmbed({
  htmlContent,
}: TwitterEmbedProps) {
  const webViewRef = useRef<WebView>(null);
  const screenWidth = Dimensions.get('window').width;
  const lastResizeHeight = useRef<number>(0);
  const [height, setHeight] = useState(1200)
  const [loading, setLoading] = useState(false)

  // Memoize the source object so its reference doesn't change on re-render
  const webViewSource = useMemo(() => ({ html: htmlContent }), [htmlContent]);

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.action === 'resize' && message.height) {
        const newHeight = Math.round(message.height);
        if (Math.abs(newHeight - lastResizeHeight.current) > 5) {
          lastResizeHeight.current = newHeight;
          setHeight(newHeight);
        }
      } else if (message.action === 'tweetsLoaded') {
        setLoading(false);
      }
    } catch (error) {
      console.error("Error parsing WebView message:", error);
    }
  };

  return (
    <View>
      <ThemedText
        type="titleSmall"
        style={{ marginInline: 16 }}
        accessible={true}
        accessibilityRole="header"
        accessibilityLabel="Latest Updates"
      >Latest Updates
      </ThemedText>
      {/* FIXME: The height-500 is to trim extra empty space below the body, find the root cause and solve it */}
      <View style={{ width: screenWidth, height: height - 500 }}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={webViewSource}
          scrollEnabled={false}
          onLoadStart={() => {
            if (!webViewRef.current) {
              setLoading(true);
            }
          }}
          onMessage={handleWebViewMessage}
          cacheEnabled={true}
          cacheMode="LOAD_CACHE_ELSE_NETWORK"
          domStorageEnabled={true}
          javaScriptEnabled={true}
          startInLoadingState={false}
          onError={() => setLoading(false)}
          renderLoading={() => <ActivityIndicator />}
          scalesPageToFit={false}
          accessible={true}
          accessibilityLabel="Latest updates from the XRP Ledger Twitter account"
          style={styles.webView}
        />
        {loading && !webViewRef.current && (
          <View style={styles.skeletonOverlay}>
            <TwitterEmbedSkeleton />
          </View>
        )}
      </View>
    </View>
  );
}

const TwitterEmbedSkeleton = () => {
  return (
    <View style={styles.skeletonContainer}>
      {/* A simple placeholder skeleton. Customize as needed */}
      <View style={styles.skeletonTitle} />
      <View style={styles.skeletonBody}>
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLine} />
        <View style={styles.skeletonLine} />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  twitterContainer: {
    padding: 16,
    marginBottom: 16,
  },
  twitterTitle: {
    marginBottom: 8,
  },
  webView: {
    backgroundColor: "transparent",
  },
  skeletonOverlay: {
    ...StyleSheet.absoluteFillObject,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: Colors.dark.secondaryBackground,
  },
  skeletonContainer: {
    width: "100%",
    height: "100%",
    padding: 16,
    justifyContent: "center",
  },
  skeletonTitle: {
    height: 20,
    backgroundColor: "#ccc",
    marginBottom: 8,
    borderRadius: 4,
  },
  skeletonBody: {
    flex: 1,
    justifyContent: "space-around",
  },
  skeletonLine: {
    height: 10,
    backgroundColor: "#ddd",
    marginBottom: 4,
    borderRadius: 4,
  },
});

export { TwitterEmbed, TwitterEmbedSkeleton};