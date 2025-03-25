import React, { useState, useRef, useEffect } from "react";
import {
  StyleSheet,
  Keyboard,
  View,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
} from "react-native";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { SafeAreaView, useSafeAreaInsets } from "react-native-safe-area-context";
import { openBrowserAsync } from "expo-web-browser";

import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import IconPolkasafe from "@/lib/components/icons/browser/icon-polkasafe";
import { IconBrowser } from "@/lib/components/icons/icon-browser";
import { IconPoints } from "@/lib/components/icons/icon-points";
import { IconSearch } from "@/lib/components/icons/shared";
import { Colors } from "@/lib/constants/Colors";
import { useProfileStore } from "@/lib/store/profileStore";
import { QuickActions, SearchOverlay } from "@/lib/components/browser";
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
            // Hide but keep in DOM for smooth transition
            position: isSearching ? 'absolute' : 'relative',
            zIndex: isSearching ? -1 : 1
          }
        ]}>
          <TitleSection />
          <ScrollView style={styles.container} contentContainerStyle={{ paddingBottom: 64 }}>
            <View style={styles.videoContainer}>
              <Video
                source={require("@/assets/videos/browser/bg.mp4")}
                style={styles.videoStyle}
                shouldPlay
                isLooping
                isMuted
                resizeMode={ResizeMode.COVER}
              />
              <View style={styles.bannerContainer}>
                <LinearGradient
                  colors={["#000000", "#01017F"]}
                  start={{ x: 0.5, y: 0 }}
                  end={{ x: 0.5, y: 1 }}
                  style={styles.gradientOverlay}
                />
                <View style={styles.bannerContent}>
                  <ThemedText type="titleMedium" style={styles.bannerTitle}>
                    Welcome to{"\n"} Polkassembly Browser!
                  </ThemedText>
                  <ThemedText type="bodyMedium3" style={styles.bannerSubtitle}>
                    Polkadot anything, everything!
                  </ThemedText>
                  <Image
                    style={styles.bannerLogo}
                    source={require("@/assets/images/browser/polkaassembly.png")}
                  />
                </View>
              </View>
              <View style={styles.videoFade} />
            </View>

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

              <View style={styles.quickActionsContainer}>
                <ThemedText type="bodyMedium2">FEATURED WEBSITES</ThemedText>
                <View style={styles.featuredCardsWrapper}>
                  <TouchableOpacity
                    style={styles.featuredCard}
                    onPress={() => openBrowserAsync("https://polkassembly.io/")}
                  >
                    <Image
                      source={require("@/assets/images/browser/feature-polka.png")}
                      style={styles.featuredImage}
                    />
                    <View>
                      <ThemedText type="bodySmall3">Polkassembly</ThemedText>
                      <ThemedText type="bodySmall4" style={styles.featuredSubtext}>Governance</ThemedText>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.featuredCard}
                    onPress={() => openBrowserAsync("https://townhallgov.com/")}
                  >
                    <Image
                      source={require("@/assets/images/browser/feature-townhall.png")}
                      style={styles.featuredImage}
                    />
                    <View>
                      <ThemedText type="bodySmall3">Townhall</ThemedText>
                      <ThemedText type="bodySmall4" style={styles.featuredSubtext}>Governance</ThemedText>
                    </View>
                  </TouchableOpacity>

                  <TouchableOpacity
                    style={styles.featuredCard}
                    onPress={() => openBrowserAsync("https://polkasafe.xyz/")}
                  >
                    <IconPolkasafe />
                    <View>
                      <ThemedText type="bodySmall3">Polkasafe</ThemedText>
                      <ThemedText type="bodySmall4" style={styles.featuredSubtext}>Governance</ThemedText>
                    </View>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
            <QuickActions />
          </ScrollView>
        </Animated.View>
      </View>
    </SafeAreaView>
  );
}

// Title section (unchanged)
function TitleSection() {
  const userProfile = useProfileStore((state) => state.profile);
  return (
    <ThemedView type="container" style={styles.titleContainer}>
      <View style={styles.titleLeft}>
        <IconBrowser color={Colors.dark.text} style={{ width: 24, height: 24 }} />
        <ThemedText type="titleMedium" style={{ fontWeight: "500" }}>
          Browser
        </ThemedText>
      </View>
      <View style={styles.titleRight}>
        <IconPoints iconHeight={24} iconWidth={24} />
        <ThemedText type="titleMedium" style={{ fontWeight: "700" }}>
          {userProfile?.profileScore}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 10,
    zIndex: 10,
  },
  titleLeft: {
    flexDirection: "row",
    gap: 8,
    alignItems: "center",
  },
  titleRight: {
    flexDirection: "row",
    gap: 6,
    alignItems: "center",
  },
  searchOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    paddingHorizontal: 12
  },
  backButton: {
    padding: 8,
    marginRight: 8,
  },
  backIcon: {
    width: 20,
    height: 20,
  },
  overlaySearchInput: {
    flex: 1,
    marginLeft: 8,
    height: 40,
    color: Colors.dark.text,
  },
  searchResultItem: {
    paddingVertical: 12,
    paddingHorizontal: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.dark.stroke,
  },
  emptyText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  loadingText: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
  },
  browserContent: {
    flex: 1,
  },
  videoContainer: {
    position: "relative",
    height: 250,
  },
  videoStyle: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
    opacity: 0.3,
  },
  bannerContainer: {
    alignItems: "center",
    backgroundColor: "#01017F",
    marginHorizontal: 50,
    marginVertical: 35,
    overflow: "hidden",
  },
  gradientOverlay: {
    position: "absolute",
    top: 0,
    height: "100%",
    width: "100%",
  },
  bannerContent: {
    padding: 20,
    alignItems: "center",
  },
  bannerTitle: {
    textAlign: "center",
    marginBottom: 10,
  },
  bannerSubtitle: {
    textAlign: "center",
    color: "#737373",
    marginBottom: 20,
  },
  bannerLogo: {
    height: 36,
    width: 102,
  },
  videoFade: {
    position: "absolute",
    left: 0,
    right: 0,
    top: 0,
    bottom: 0,
    backgroundColor: "#000",
    opacity: 0.3,
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
  quickActionsContainer: {
    gap: 16,
  },
  featuredCardsWrapper: {
    flexDirection: "row",
    gap: 16,
  },
  featuredCard: {
    flex: 1,
    borderWidth: 1,
    borderColor: Colors.dark.stroke,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 8,
    alignItems: "flex-start",
    justifyContent: "flex-end",
    gap: 16,
  },
  featuredImage: {
    height: 32,
    width: 32,
    resizeMode: "contain",
  },
  featuredSubtext: {
    color: "#9B9B9B",
  },
});