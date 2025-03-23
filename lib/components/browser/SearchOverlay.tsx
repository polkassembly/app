import { EProposalType } from "@/lib/types";
import { getSinglePostLinkFromProposalType, ProposalType } from "@/lib/util/algolia";
import { algoliasearch } from "algoliasearch";
import { router } from "expo-router";
import { debounce } from "lodash";
import React, { useState, useRef, useEffect, useCallback } from "react";
import { TextInput, Animated, Keyboard, BackHandler, TouchableOpacity, View, FlatList, StyleSheet } from "react-native";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { IconBrowser } from "../icons/icon-browser";
import { IconSearch } from "../icons/shared";
import { ThemedText } from "../ThemedText";
import { ThemedView } from "../ThemedView";
import { useThemeColor } from "@/lib/hooks";
import HorizontalSeparator from "../shared/HorizontalSeparator";
import { NETWORKS_DETAILS } from "@/lib/constants/networks";
import { ENetwork } from "@/lib/types/post";

interface SearchOverlayProps {
  onDeactivate: () => void;
  backgroundColor: string;
  visible: boolean; // New prop to control visibility
}

interface SearchResult {
  objectID: string;
  id: string;
  title: string;
  post_type: string;
}

const getFacetFilter = () => {
  return [
    [`post_type:${ProposalType.REFERENDUMS}`, `post_type:${ProposalType.REFERENDUM_V2}`, `post_type:${ProposalType.TREASURY_PROPOSALS}`],
    [`network:${ENetwork.POLKADOT}`]
  ];
}

// The segregated search overlay component
function SearchOverlay({ onDeactivate, backgroundColor, visible }: SearchOverlayProps) {
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<SearchResult[]>([]);
  const [loading, setLoading] = useState(false);
  const [keyboardVisible, setKeyboardVisible] = useState(false);
  const searchInputRef = useRef<TextInput>(null);
  const searchBarAnim = useRef(new Animated.Value(visible ? 0 : 100)).current;
  const opacityAnim = useRef(new Animated.Value(visible ? 1 : 0)).current;

  const textColor = useThemeColor({}, "text");
  const secondaryBackground = useThemeColor({}, "background");
  const strokeColor = useThemeColor({}, "stroke")

  // Initialize Algolia client inside this component
  let algoliaClient: any;
  try {
    const ALGOLIA_APP_ID = process.env.EXPO_PUBLIC_ALGOLIA_APP_ID || "";
    const ALGOLIA_SEARCH_API_KEY = process.env.EXPO_PUBLIC_ALGOLIA_SEARCH_API_KEY || "";
    algoliaClient = algoliasearch(ALGOLIA_APP_ID, ALGOLIA_SEARCH_API_KEY);
  } catch (error) {
    console.error("Algolia initialization failed:", error);
  }

  // Track visibility changes to animate properly
  useEffect(() => {
    if (visible) {
      Animated.parallel([
        Animated.timing(searchBarAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 1,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start(() => {
        if (searchInputRef.current) {
          searchInputRef.current.focus();
        }
      });
    } else {
      Animated.parallel([
        Animated.timing(searchBarAnim, {
          toValue: 100,
          duration: 500,
          useNativeDriver: true,
        }),
        Animated.timing(opacityAnim, {
          toValue: 0,
          duration: 500,
          useNativeDriver: true,
        })
      ]).start();
    }
  }, [visible]);

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

  // Handle hardware back button for search overlay
  useEffect(() => {
    const backHandler = BackHandler.addEventListener("hardwareBackPress", () => {
      if (keyboardVisible) {
        Keyboard.dismiss();
        return true;
      } else if (visible) {
        handleBackPress();
        return true;
      }
      return false;
    });
    return () => backHandler.remove();
  }, [keyboardVisible, visible]);

  const searchPosts = async (searchQuery: string) => {
    if (!searchQuery || searchQuery.length < 1) {
      setResults([]);
      return;
    }
    setLoading(true);
    try {
      if (algoliaClient) {
        const { hits } = await algoliaClient.searchSingleIndex({
          indexName: "polkassembly_posts",
          searchParams: {
            query: searchQuery,
            hitsPerPage: 10,
            facetFilters: getFacetFilter(),
          }
        });
        setResults(hits);
      }
    } catch (error) {
      console.error("Error searching posts:", error);
    }
    setLoading(false);
  };

  const debouncedSearch = useCallback(debounce(searchPosts, 500), []);

  const handleChangeText = (text: string) => {
    setQuery(text);
    debouncedSearch(text);
  };

  const handleSubmitEditing = () => {
    Keyboard.dismiss();
    searchPosts(query);
  };

  const handleBackPress = () => {
    if (keyboardVisible) {
      Keyboard.dismiss();
    } else {
      deactivateSearchOverlay();
    }
  };

  const deactivateSearchOverlay = () => {
    // First dismiss keyboard to prevent flashing
    Keyboard.dismiss();
    
    // Wait a bit for keyboard to start dismissing before animation
    setTimeout(() => {
      onDeactivate();
    }, 50);
  };

  const renderSearchItem = ({ item }: { item: SearchResult }) => (
    <TouchableOpacity
      style={[localStyles.searchResultItem, { backgroundColor: secondaryBackground }]}
      onPress={() => {
        const proposal_type = getSinglePostLinkFromProposalType(item.post_type as ProposalType);
        router.push(`/proposal/${item.id}?proposalType=${proposal_type as EProposalType}`);
      }}
    >
      <ThemedText type="bodySmall">{item.title}</ThemedText>
    </TouchableOpacity>
  );

  return (
    <Animated.View 
      style={[
        localStyles.searchOverlay, 
        { 
          backgroundColor,
          opacity: opacityAnim,
          pointerEvents: visible ? 'auto' : 'none'
        }
      ]}
    >
      <ThemedView
        style={[localStyles.searchBarContainer, { borderWidth: 1, borderColor: strokeColor}]}
        type="secondaryBackground"
      >
        <Animated.View style={[
          localStyles.animatedSearchBar, 
          { transform: [{ translateY: searchBarAnim }] }
        ]}>
          <TouchableOpacity onPress={handleBackPress} style={localStyles.backButton}>
            <IconBrowser color={"white"} iconHeight={25} iconWidth={25}/>
          </TouchableOpacity>
          <TextInput
            ref={searchInputRef}
            placeholder="Search posts..."
            placeholderTextColor={textColor}
            style={[localStyles.overlaySearchInput, { color: "white" }]}
            value={query}
            onChangeText={handleChangeText}
            returnKeyType="search"
            onSubmitEditing={handleSubmitEditing}
            autoCapitalize="none"
            autoCorrect={false}
          />
        </Animated.View>
      </ThemedView>
      <View style={localStyles.resultsContainer}>
        {loading ? (
          <ThemedText style={localStyles.loadingText}>Loading...</ThemedText>
        ) : (
          <FlatList
            data={results}
            keyExtractor={(item) => item.objectID}
            renderItem={renderSearchItem}
            ListEmptyComponent={
              query.length >= 2 ? (
                <ThemedText style={localStyles.emptyText}>No results found</ThemedText>
              ) : null
            }
            keyboardShouldPersistTaps="handled"
            style={{ backgroundColor }}
          />
        )}
      </View>
    </Animated.View>
  );
}

const localStyles = StyleSheet.create({
  searchOverlay: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 200,
    paddingHorizontal: 12,
  },
  searchBarContainer: {
    width: "100%",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    marginTop: 8
  },
  animatedSearchBar: {
    width: "100%",
    borderRadius: 50,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  backButton: {
    padding: 8,
  },
  overlaySearchInput: {
    flex: 1,
    marginLeft: 8,
    height: 40,
  },
  searchResultItem: {
    paddingVertical: 8,
    paddingHorizontal: 10,
    borderBottomWidth: 2,
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
  resultsContainer: {
    flex: 1,
    marginTop: 4,
    borderRadius: 10,
    overflow: "hidden",
  },
});

export default SearchOverlay;