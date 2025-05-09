import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity, Platform, useWindowDimensions } from "react-native";
import Swiper from "react-native-deck-swiper";
import { ACTIVITY_FEED_LIMIT, useActivityFeed } from "@/lib/net/queries/post/useActivityFeed";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Post } from "@/lib/types";
import { BottomSheet, TopBar } from "@/lib/components/shared";
import CartItemsPreview from "@/lib/components/voting/CartItemsPreview";
import { BottomVotingButtons, OverlayLabel } from "@/lib/components/voting";
import { ThemedButton } from "@/lib/components/shared/button";
import IconClose from "@/lib/components/icons/shared/icon-close";
import { ThemedText } from "@/lib/components/shared/text";
import { ProposalDetails } from "@/lib/components/proposal";
import { ThemedView } from "@/lib/components/shared/View";
import { ProposalContentSummary } from "@/lib/components/proposal";
import { useBatchVotingStore } from "@/lib/store/batchVotingStore";
import { ProposalCard } from "@/lib/components/proposal";
import { useLocalCartStore } from "@/lib/store/localCartStore";
import { CartItem } from "@/lib/net/queries/actions/useGetCartItem";
import { useProfileStore } from "@/lib/store/profileStore";
import { DEFAULT_NETWORK } from "@/lib/constants/networks";
import { Ionicons } from "@expo/vector-icons";

interface MemoizedProposalCardProps {
  card: Post;
  showDetails: () => void;
}

// Memoized proposal card component
const MemoizedProposalCard = React.memo(({ card, showDetails }: MemoizedProposalCardProps) => {
  const backgroundColor = useThemeColor({}, "container");
  return (
    <View
      style={[styles.cardContainer, { backgroundColor }]}
      key={card.index}
      renderToHardwareTextureAndroid={true}
    >
      <ProposalCard
        post={card}
        descriptionLength={300}
        withoutActions
        withoutReadMore={true}
      >
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", width: "100%", }}>
          <ThemedButton
            text="Read Full Proposal"
            onPress={showDetails}
            style={{
              flexWrap: "wrap",
              paddingVertical: 4
            }}
          />
        </View>
        <ProposalContentSummary
          proposalType={card.proposalType}
          indexOrHash={card.index}
          withEmptyLoadingScreen={true}
          summaryLength={400}
        />
      </ProposalCard>
    </View>
  );
});

const ProposalVotingScreen: React.FC = () => {
  const {
    conviction,
    ayeAmount,
    nayAmount,
    abstainAmount
  } = useBatchVotingStore();

  const feedParams = { limit: ACTIVITY_FEED_LIMIT };
  const { data, isLoading, isError, hasNextPage, fetchNextPage } = useActivityFeed(feedParams);
  const addCartItem = useLocalCartStore((state) => state.addCartItem)
  const user = useProfileStore((state) => state.profile)

  // Single source of proposals
  const [proposals, setProposals] = useState<Post[]>([]);
  const [proposalDetailsOpen, setProposalDetailsOpen] = useState(false);
  const [isChevronDisabled, setIsChevronDisabled] = useState(false);
  const [index, setIndex] = useState(0);
  const swiperRef = useRef<any>(null);

  const backgroundColor = useThemeColor({}, "container");
  const accentColor = useThemeColor({}, "accent");
  const { width, height } = useWindowDimensions();

  // Append new proposals as they are fetched
  useEffect(() => {
    if (data) {
      const newProposals = data.pages.flatMap((page: any) => page.items);
      setProposals(prev => [...prev, ...newProposals]);
    }
  }, [data]);

  const showDetails = useCallback(() => setProposalDetailsOpen(true), []);

  const handleBackPress = () => {
    if (isChevronDisabled || index === 0) return;
    setIsChevronDisabled(true);

    const prevIndex = index - 1;
    swiperRef.current?.jumpToCardIndex(prevIndex);
    setIndex(prevIndex);

    setTimeout(() => setIsChevronDisabled(false), 500); // adjust delay if needed
  };

  const handleNextPress = () => {
    if (isChevronDisabled || index === proposals.length - 1) return;
    setIsChevronDisabled(true);

    const nextIndex = index + 1;
    swiperRef.current?.jumpToCardIndex(nextIndex);
    setIndex(nextIndex);

    setTimeout(() => setIsChevronDisabled(false), 500); // adjust delay if needed
  };

  // Handler for swipe events
  const onSwiped = useCallback(
    (direction: "aye" | "nay" | "splitAbstain", cardIndex: number) => {
      const proposal = proposals[cardIndex];
      if (!proposal) return;
      setIndex(cardIndex + 1);

      // trigger fetching more proposals
      if (cardIndex >= proposals.length - 5 && hasNextPage) {
        fetchNextPage();
      }

      let amount = {};
      if (direction === "aye") {
        amount = { aye: String(ayeAmount) };
      } else if (direction === "nay") {
        amount = { nay: String(nayAmount) };
      } else if (direction === "splitAbstain") {
        // Use all values from the abstainAmount object
        amount = {
          abstain: String(abstainAmount.abstain),
          aye: String(abstainAmount.aye),
          nay: String(abstainAmount.nay)
        };
      }

      const params: CartItem = {
        id: proposal.index,
        postIndexOrHash: String(proposal.index),
        proposalType: proposal.proposalType,
        decision: direction,
        amount,
        conviction,
        title: proposal.title,
        createdAt: String(Date.now()),
        updatedAt: String(Date.now()),
        userId: user?.id || 0,
        network: DEFAULT_NETWORK
      };

      addCartItem(params)
    },
    [proposals, hasNextPage, fetchNextPage, ayeAmount, nayAmount, abstainAmount, conviction]
  );


  if (isLoading || proposals.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color={accentColor} />
      </View>
    );
  }

  if (isError && proposals.length === 0) {
    return (
      <View style={styles.centered}>
        <ThemedText type="titleLarge">Error loading proposals.</ThemedText>
      </View>
    );
  }

  return (
    <View style={[styles.flex1, { backgroundColor }]}>
      <View style={styles.flex1}>
        <TopBar style={{ paddingHorizontal: 16 }} />
        <View style={{ paddingHorizontal: 16, flexDirection: "row", justifyContent: "space-between", alignItems: "center", paddingVertical: 20 }}>
          <TouchableOpacity
            onPress={handleBackPress}
            style={{ opacity: index === 0 ? 0.5 : 1 }}
            disabled={index === 0 || isChevronDisabled}
          >
            <Ionicons name="chevron-back-circle" size={24} color="white" />
          </TouchableOpacity>
          <TouchableOpacity
            onPress={handleNextPress}
            style={{ opacity: index === proposals.length - 1 ? 0.5 : 1 }}
            disabled={index === proposals.length - 1 || isChevronDisabled}
          >
            <Ionicons name="chevron-forward-circle" size={24} color="white" />
          </TouchableOpacity>
        </View>
        <View style={styles.flex1}>
          <View style={styles.flex1}>
            <View style={styles.swiperWrapper}>
              <Swiper
                containerStyle={styles.swiperStyle}
                ref={swiperRef}
                cards={proposals}
                renderCard={(cardData) => (
                  <MemoizedProposalCard
                    card={cardData}
                    showDetails={showDetails}
                  />
                )}

                // swipe events
                onSwipedLeft={(cardIndex) => onSwiped("nay", cardIndex)}
                onSwipedRight={(cardIndex) => onSwiped("aye", cardIndex)}
                onSwipedTop={(cardIndex) => onSwiped("splitAbstain", cardIndex)}
                disableBottomSwipe
                verticalSwipe
                horizontalThreshold={100}

                stackSize={Platform.OS === "ios" ? 2 : 1}

                // overlay labels and opacity
                animateOverlayLabelsOpacity
                overlayOpacityHorizontalThreshold={5}
                overlayOpacityVerticalThreshold={5}
                inputOverlayLabelsOpacityRangeX={[-width * 0.5, -width * 0.2, 0, width * 0.2, width * 0.5]}
                outputOverlayLabelsOpacityRangeX={[1, 1, 0.5, 1, 1]}
                inputOverlayLabelsOpacityRangeY={[-height * 0.5, -height * 0.2, 0, height * 0.2, height * 0.5]}
                outputOverlayLabelsOpacityRangeY={[1, 1, 0.5, 1, 1]}
                overlayLabels={{
                  left: { element: <OverlayLabel type="nay" /> },
                  right: { element: <OverlayLabel type="aye" /> },
                  top: { element: <OverlayLabel type="splitAbstain" /> },
                }}

                // card stack styling
                cardVerticalMargin={0}
                cardHorizontalMargin={20}
                backgroundColor="transparent"
                useViewOverflow={Platform.OS === 'ios'}
                useNativeDriver={true}
              />
            </View>
            {Platform.OS !== "ios" && index + 1 < proposals.length && (
              <View style={styles.bottomCard}>
                <MemoizedProposalCard
                  card={proposals[index + 1]}
                  showDetails={() => setProposalDetailsOpen(true)}
                />
              </View>
            )}
          </View>
          <CartItemsPreview />
        </View>
        <BottomVotingButtons swiperRef={swiperRef} />
      </View>

      {/* Post full details */}
      <BottomSheet
        open={proposalDetailsOpen}
        onClose={() => setProposalDetailsOpen(false)}
        style={{ zIndex: 200 }}
      >
        <ThemedView type="container" style={styles.sheet}>
          <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", marginBottom: 12 }}>
            <ThemedText type="titleSmall">Proposal Details</ThemedText>
            <TouchableOpacity onPress={() => setProposalDetailsOpen(false)} style={{ padding: 5, paddingHorizontal: 10 }}>
              <IconClose iconWidth={14} iconHeight={14} color="#79767D" />
            </TouchableOpacity>
          </View>
          {proposals && proposals.length > index && (
            <ProposalDetails
              post={proposals[index]}
              withoutFullDetails
              withoutHeaderText
              withoutProposalCardIndex={false}
              withVotingButton={false}
            />
          )}
        </ThemedView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  flex1: {
    flex: 1
  },
  swiperWrapper: {
    flex: 1,
    zIndex: 5,
  },
  swiperStyle: {
    backgroundColor: 'transparent',
  },
  bottomCard: {
    position: "absolute",
    left: 0,
    right: 0,
    bottom: 0,
    top: 0,
    zIndex: 0,
    paddingHorizontal: 20,
  },
  cardContainer: {
    borderRadius: 10,
    padding: 10,
    borderWidth: Platform.OS === 'ios' ? StyleSheet.hairlineWidth : 1,
    flex: 1,
    maxHeight: Platform.OS === 'ios' ? "80%" : "85%",
    overflow: "hidden",
    ...Platform.select({
      ios: {
        shadowColor: "#000",
        shadowOffset: { width: 0, height: 2 },
        shadowOpacity: 0.1,
        shadowRadius: 4,
      },
      android: {
        elevation: 2,
      },
    }),
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  sheet: {
    width: "100%",
    height: "90%",
    borderTopLeftRadius: 16,
    borderTopRightRadius: 16,
    paddingTop: 16,
    paddingHorizontal: 16
  },
});

export default ProposalVotingScreen;