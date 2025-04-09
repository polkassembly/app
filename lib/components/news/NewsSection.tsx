import React, { useMemo, useState } from "react";
import { View, Dimensions, StyleSheet } from "react-native";
import { ThemedText } from "@/lib/components/shared/text/ThemedText";
import WebView from "react-native-webview";
import { twitterEmbedHTML } from "@/lib/util/twitterEmbedHTML";

function NewsSection() {
  const htmlContent = useMemo(() => twitterEmbedHTML, []);
  const webViewRef = React.useRef<WebView>(null);
  const screenWidth = Dimensions.get('window').width;
  const [height, setHeight] = useState(800);

  const handleWebViewMessage = (event: any) => {
    try {
      const message = JSON.parse(event.nativeEvent.data);
      if (message.action === 'resize' && message.height) {
        const newHeight = Math.round(message.height);
          setHeight(newHeight);
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
      >
        Latest Updates
      </ThemedText>
      <View style={{ width: screenWidth, height: height }}>
        <WebView
          ref={webViewRef}
          originWhitelist={["*"]}
          source={{ html: htmlContent }}
          scrollEnabled={false}
          onMessage={handleWebViewMessage}
          cacheEnabled={true}
          domStorageEnabled={true}
          javaScriptEnabled={true}
          startInLoadingState={false}
          scalesPageToFit={false}
          accessible={true}
          accessibilityLabel="Latest updates from the Polkadot Twitter account"
          style={styles.webView}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  webView: {
    backgroundColor: "transparent",
  },
});

export default NewsSection;