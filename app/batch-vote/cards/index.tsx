import React, { useEffect, useState, useRef, useCallback } from "react";
import { View, StyleSheet, Text, ActivityIndicator, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import useAddCartItem from "@/lib/net/queries/actions/useAddCartItem";
import { useActivityFeed } from "@/lib/net/queries/post/useActivityFeed";
import { TopBar } from "@/lib/components/Topbar";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { ProposalCard } from "@/lib/components/proposal/ProposalCard";
import { Post } from "@/lib/types";
import { BottomSheet } from "@/lib/components/shared";
import CartItemsPreview from "@/lib/components/voting/CartItemsPreview";
import { BottomVotingButtons, OverlayLabel } from "@/lib/components/voting";
import ThemedButton from "@/lib/components/ThemedButton";
import Toast from "react-native-toast-message";
import IconClose from "@/lib/components/icons/shared/icon-close";
import { ThemedText } from "@/lib/components/ThemedText";
import { ProposalDetails } from "@/lib/components/proposal";
import { ThemedView } from "@/lib/components/ThemedView";
import { ProposalContentSummary } from "@/lib/components/proposal";
import { useBatchVotingStore } from "@/lib/store/batchVotingStore";

interface MemoizedProposalCardProps {
  card: Post;
  index: string;
  showDetails: () => void;
}

// Memoized proposal card component
const MemoizedProposalCard = React.memo(({ card, index, showDetails }: MemoizedProposalCardProps) => {
  const backgroundColor = useThemeColor({}, "container");
  return (
    <View style={[styles.cardContainer, { backgroundColor }]} key={index}>
      <ProposalCard
        post={card}
        descriptionLength={500}
        withoutActions
        withoutViewMore
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
        <ProposalContentSummary proposalType={card.proposalType} indexOrHash={card.index} />
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

  const feedParams = { limit: 20 };
  const { data, isLoading, isError, hasNextPage, fetchNextPage } = useActivityFeed(feedParams);
  const voteMutation = useAddCartItem();

  // Single source of proposals
  const [proposals, setProposals] = useState<Post[]>([]);
  const [proposalDetailsOpen, setProposalDetailsOpen] = useState(false);
  const swiperRef = useRef<any>(null);
  const backgroundColor = useThemeColor({}, "container");
  const [index, setIndex] = useState(0);
  const insets = useSafeAreaInsets();

  // Append new proposals as they are fetched
  useEffect(() => {
    if (data) {
      const newProposals = data.pages.flatMap((page: any) => page.items);
      setProposals(prev => [...prev, ...newProposals]);
    }
  }, [data]);

  // Handler for swipe events
  const onSwiped = useCallback(
    (direction: "aye" | "nay" | "splitAbstain", cardIndex: number) => {
      const proposal = proposals[cardIndex];
      if (!proposal) return;
      setIndex(cardIndex + 1);

      // trigger fetching more proposals
      if (cardIndex >= proposals.length - 10 && hasNextPage) {
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

      const params = {
        postIndexOrHash: String(proposal.index),
        proposalType: proposal.proposalType,
        decision: direction,
        amount,
        conviction,
      };

      voteMutation.mutate(params, {
        onError: () => {
          Toast.show({
            type: "error",
            text1: "Vote Failed",
            text2: "There was an error while submitting your vote. Please try again.",
          });
        },
      });
    },
    [
      proposals,
      ayeAmount,
      nayAmount,
      abstainAmount,
      conviction,
      hasNextPage,
      fetchNextPage,
      voteMutation,
    ]
  );

  if (isLoading || proposals.length === 0) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    );
  }

  if (isError) {
    return (
      <View style={styles.centered}>
        <Text>Error loading proposals.</Text>
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <View style={{ flex: 1, backgroundColor, marginTop: insets.top, paddingLeft: insets.left, paddingRight: insets.right }}>
        <TopBar style={{ paddingHorizontal: 16 }} />
        <View style={{ flex: 1 }}>
          <View style={{ flex: 1, paddingVertical: 20 }}>
            <View style={{ flex: 1, zIndex: 5 }}>
              <Swiper
                containerStyle={{ backgroundColor: "" }}
                infinite
                ref={swiperRef}
                cards={proposals}
                renderCard={(cardData) => <MemoizedProposalCard card={cardData} key={cardData.index} index={cardData.index} showDetails={() => setProposalDetailsOpen(true)} />}
                onSwipedLeft={(cardIndex) => onSwiped("nay", cardIndex)}
                onSwipedRight={(cardIndex) => onSwiped("aye", cardIndex)}
                onSwipedTop={(cardIndex) => onSwiped("splitAbstain", cardIndex)}
                stackSize={1}
                disableBottomSwipe
                verticalSwipe
                animateCardOpacity={false}
                overlayLabels={{
                  left: { element: <OverlayLabel type="nay" /> },
                  right: { element: <OverlayLabel type="aye" /> },
                  top: { element: <OverlayLabel type="splitAbstain" /> },
                }}
                cardVerticalMargin={20}
                cardHorizontalMargin={20}
              />
            </View>
            {/* FIXME: Bottom card for stack effect, workaround for vote card flashing */}
            {
              index + 1 < proposals.length &&
              <View style={{ position: "absolute", left: 0, right: 0, bottom: 0, zIndex: 0, top: 20, padding: 30 }}>
                <MemoizedProposalCard card={proposals[index + 1]} index={proposals[index + 1].index} showDetails={() => setProposalDetailsOpen(true)} />
              </View>
            }
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
            />
          )}
        </ThemedView>
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    borderRadius: 10,
    padding: 10,
    borderWidth: 1,
    flex: 1,
    maxHeight: "85%",
    overflow: "hidden",
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