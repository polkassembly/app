import React, { useState, useCallback, useRef, useEffect } from "react";
import {
  TextInput,
  FlatList,
  StyleSheet,
  Keyboard,
  View,
  TouchableOpacity,
  Animated,
  Image,
  ScrollView,
  BackHandler
} from "react-native";
import debounce from "lodash/debounce";
import { algoliasearch } from "algoliasearch";
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
import { QuickActions } from "@/lib/components/browser";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { router } from "expo-router";
import { getSinglePostLinkFromProposalType } from "@/lib/util/algolia";
import { EProposalType } from "@/lib/types";

const ALGOLIA_APP_ID = process.env.EXPO_PUBLIC_ALGOLIA_APP_ID || "";
const ALGOLIA_SEARCH_API_KEY = process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY || "";
const algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);

export default function ChromeStyleBrowser() {
  const [isSearching, setIsSearching] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);

  // Animation values
  const searchBarAnim = useRef(new Animated.Value(100)).current;
  const contentOpacity = useRef(new Animated.Value(1)).current;

  // Ref for the search input (to autofocus when search mode is activated)
  const searchInputRef = useRef<TextInput>(null);
  const backgroundColor = useThemeColor({}, "secondaryBackground");
  const background = useThemeColor({}, "background");
  const insets = useSafeAreaInsets();

  // Listen for keyboard events to track visibility
  useEffect(() => {
    const showSub = Keyboard.addListener("keyboardDidShow", () => {
      setKeyboardVisible(true);
    });
    const hideSub = Keyboard.addListener("keyboardDidHide", () => {
      setKeyboardVisible(false);
    });
    return () => {
      showSub.remove();
      hideSub.remove();
    };
  }, []);

  // Handle hardware back button when in search mode
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (isSearching) {
        handleBackPress();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [isSearching, keyboardVisible]);

  // searchPosts function to fetch posts from Algolia
  const searchPosts = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      const { hits } = await algoliaClient.searchSingleIndex({
        indexName: "polkassembly_posts",
        searchParams: { query: searchQuery, hitsPerPage: 10 }
      });
      setResults(hits);
    } catch (error) {
      console.error("Error searching posts:", error);
    }
    setLoading(false);
  };

  // Debounce search to avoid too many API calls
  const debouncedSearch = useCallback(debounce(searchPosts, 500), []);

  const handleChangeText = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleSubmitEditing = () => {
    Keyboard.dismiss();
    searchPosts(query);
  };

  // Activate search mode: animate search bar in, focus input
  const activateSearch = () => {
    setIsSearching(true);
    Animated.parallel([
      Animated.timing(searchBarAnim, {
        toValue: 0,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      })
    ]).start(() => {
      if (searchInputRef.current) {
        searchInputRef.current.focus();
      }
    });
  };

  // Combined back press handler: if keyboard is visible, dismiss it first,
  // then after a short delay, animate back to browser mode.
  const handleBackPress = () => {
    if (keyboardVisible) {
      Keyboard.dismiss();
    } else {
      deactivateSearch();
    }
  };

  const deactivateSearch = () => {
    Animated.parallel([
      Animated.timing(searchBarAnim, {
        toValue: 100,
        duration: 300,
        useNativeDriver: true,
      }),
      Animated.timing(contentOpacity, {
        toValue: 1,
        duration: 300,
        useNativeDriver: true,
      })
    ]).start(() => {
      setIsSearching(false);
      setQuery("");
      setResults([]);
    });
  };

  const renderSearchItem = ({ item }) => (
    <TouchableOpacity
      style={[styles.searchResultItem, { backgroundColor: background }]}
      onPress={() => {
        const proposal_type = getSinglePostLinkFromProposalType(item.post_type);
        router.push(`/proposal/${item.id}?proposalType=${proposal_type as EProposalType}`);
      }}
    >
      <ThemedText type="bodySmall3">
        {item.title}
      </ThemedText>
    </TouchableOpacity>
  );

  return (
    <View style={styles.mainContainer}>
      <View style={{ flex: 1, marginTop: insets.top, marginBottom: insets.bottom, marginLeft: insets.left, marginRight: insets.right }}>

        {/* SEARCH OVERLAY (appears when active) */}
        {isSearching && (
          <View style={[styles.searchOverlay, { backgroundColor }]}>
            <ThemedView style={{
              width: "100%",
              borderRadius: 10,
              flexDirection: "row",
              alignItems: "center",
              justifyContent: "center"
            }}
              type="secondaryBackground"
            >
              <Animated.View style={{
                transform: [{ translateY: searchBarAnim }],
                width: "100%",
                borderRadius: 10,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "center"
              }}>
                <TouchableOpacity onPress={handleBackPress} style={styles.backButton}>
                  <IconBrowser color={Colors.dark.text} style={styles.backIcon} />
                </TouchableOpacity>
                <IconSearch />
                <TextInput
                  ref={searchInputRef}
                  placeholder="Search posts..."
                  placeholderTextColor={Colors.dark.mediumText}
                  style={styles.overlaySearchInput}
                  value={query}
                  onChangeText={handleChangeText}
                  returnKeyType="search"
                  onSubmitEditing={handleSubmitEditing}
                  autoCapitalize="none"
                  autoCorrect={false}
                />
              </Animated.View>
            </ThemedView>

            {/* Search results rendered below the search bar */}
            <View style={{ flex: 1, marginTop: 4, borderRadius: 10, overflow: "hidden" }}>
              {loading ? (
                <ThemedText style={styles.loadingText}>Loading...</ThemedText>
              ) : (
                <FlatList
                  data={results}
                  keyExtractor={(item) => item.objectID}
                  renderItem={renderSearchItem}
                  ListEmptyComponent={
                    query.length >= 2 ? (
                      <ThemedText style={styles.emptyText}>No results found</ThemedText>
                    ) : null
                  }
                  keyboardShouldPersistTaps="handled"
                />
              )}
            </View>
          </View>
        )}

        {/* Browser UI  */}
        <Animated.View style={[styles.browserContent, { opacity: contentOpacity, display: isSearching ? 'none' : 'flex' }]}>
          <TitleSection />
          <ScrollView
            style={styles.container}
            contentContainerStyle={{ paddingBottom: 64 }}
          >
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
              {/* Browser search input, activates search mode on click*/}
              <View style={styles.searchInputBrowser}>
                <IconSearch />
                <TextInput
                  placeholder="Search by name or enter URL"
                  placeholderTextColor={Colors.dark.mediumText}
                  style={{ color: Colors.dark.text, flex: 1 }}
                  onPress={activateSearch}
                />
              </View>

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
    </View>
  );
}

// Title section visible in both modes
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
  mainContainer: {
    flex: 1,
    backgroundColor: Colors.dark.secondaryBackground,
  },
  container: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingVertical: 16,
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
  searchBarOverlay: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexDirection: "row",
    alignItems: "center",
    zIndex: 30,
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
  itemText: {
    fontSize: 16,
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
    paddingVertical: 4,
  },
  searchPlaceholder: {
    color: Colors.dark.mediumText,
    flex: 1,
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

