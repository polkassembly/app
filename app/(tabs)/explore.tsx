import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  View,
  TouchableOpacity,
  Animated,
  ScrollView,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

import { ThemedText } from "@/lib/components/shared/text/ThemedText";
import { IconSearch } from "@/lib/components/icons/shared";
import { Colors } from "@/lib/constants/Colors";
import { BrowserHeader, BrowserHeroSection, FeaturedWebsites, QuickActions, SearchOverlay } from "@/lib/components/browser";
import { useThemeColor } from "@/lib/hooks/useThemeColor";

export default function ChromeStyleBrowser() {
  const [isSearching, setIsSearching] = useState(false);
  const [isSearchOverlayVisible, setIsSearchOverlayVisible] = useState(false);
  const contentOpacity = useRef(new Animated.Value(1)).current;

  const backgroundColor = useThemeColor({}, "secondaryBackground");
  const mediumTextColor = useThemeColor({}, "mediumText")

  const activateSearch = () => {
    // First make overlay visible, but the animation will start with transform and opacity
    setIsSearchOverlayVisible(true);
    setIsSearching(true);

    // Fade out browser content
    Animated.timing(contentOpacity, {
      toValue: 0,
      duration: 200,
      useNativeDriver: true,
    }).start();
  };

  const deactivateSearch = () => {
    // Start fading in browser content
    Animated.timing(contentOpacity, {
      toValue: 1,
      duration: 500,
      useNativeDriver: true,
    }).start();

    // SearchOverlay will animate out by itself
    setIsSearching(false);

    // Wait for animation to complete before removing from DOM
    setTimeout(() => {
      setIsSearchOverlayVisible(false);
    }, 300);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor}}>
      <View style={{ flex: 1 }}>

        {/* Always render SearchOverlay but control visibility with props */}
        {isSearchOverlayVisible && (
          <SearchOverlay
            onDeactivate={deactivateSearch}
            backgroundColor={backgroundColor}
            visible={isSearching}
          />
        )}

        {/* Browser UI */}
        <Animated.View style={[
          styles.browserContent,
          {
            opacity: contentOpacity,
            position: isSearching ? 'absolute' : 'relative',
            zIndex: isSearching ? -1 : 1
          }
        ]}>
          <BrowserHeader />
          <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 64 }}>
            <BrowserHeroSection />

            <View style={styles.browserInnerContent}>
              {/* Browser search input, activates search mode on focus */}
              <TouchableOpacity
                style={styles.searchInputBrowser}
                activeOpacity={0.7}
                onPress={activateSearch}
              >
                <IconSearch />
                <ThemedText
                  type="bodySmall"
                  style={{ color: mediumTextColor }}
                >
                  Search by name or enter URL
                </ThemedText>
              </TouchableOpacity>
              <FeaturedWebsites />
              
            </View>
            <QuickActions />
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  browserContent: {
    flex: 1,
  },
  browserInnerContent: {
    paddingHorizontal: 16,
    marginVertical: 24,
    gap: 24,
  },
  searchInputBrowser: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderColor: Colors.dark.stroke,
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 15,
    paddingVertical: 10,
  },
});