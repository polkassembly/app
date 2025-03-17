import React, { useEffect, useState, useRef, useCallback, useMemo } from "react";
import { View, StyleSheet, Text, ActivityIndicator, Touchable, TouchableOpacity } from "react-native";
import Swiper from "react-native-deck-swiper";
import { useLocalSearchParams } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useAddCartItem from "@/lib/net/queries/actions/useAddCartItem";
import { useActivityFeed } from "@/lib/net/queries/post/useActivityFeed";
import { TopBar } from "@/lib/components/Topbar";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { ProposalCard } from "@/lib/components/proposal/ProposalCard";
import { Post } from "@/lib/types";
import { BottomSheet } from "@/lib/components/shared";
import { PostFullDetails } from "@/lib/components/feed";
import CartItemsPreview from "@/lib/components/voting/CartItemsPreview";
import { BottomVotingButtons, OverlayLabel } from "@/lib/components/voting";
import ThemedButton from "@/lib/components/ThemedButton";
import { ProposalContentSummary } from "@/lib/components/proposal";

interface MemoizedProposalCardProps {
  card: Post;
  index: string;
  showDetails: () => void;
}

// Memoized proposal card component
const MemoizedProposalCard = React.memo(({ card, index, showDetails }: MemoizedProposalCardProps) => {
  const backgroundColor = useThemeColor({}, "container");
  const colorStroke = useThemeColor({}, "stroke");

  return (
    <View style={[styles.cardContainer, { backgroundColor}]} key={index}>
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
  const searchParams = useLocalSearchParams();
  const defaultConviction = Number(searchParams?.defaultConviction) || 0;
  const defaultAyeAmount = String(searchParams?.defaultAyeAmount) || "1";
  const defaultNayAmount = String(searchParams?.defaultNayAmount) || "1";
  const defaultAbstainAmount = String(searchParams?.defaultAbstainAmount) || "1";

  const feedParams = { limit: 20 };
  const { data, isLoading, isError, hasNextPage, fetchNextPage } = useActivityFeed(feedParams);
  const voteMutation = useAddCartItem();

  // Single source of proposals
  const [proposals, setProposals] = useState<Post[]>([]);
  const [proposalDetailsOpen, setProposalDetailsOpen] = useState(false);
  const swiperRef = useRef<any>(null);
  const backgroundColor = useThemeColor({}, "container");
  const [index, setIndex] = useState(0)

  // Append new proposals as they are fetched
  useEffect(() => {
    if (data) {
      const newProposals = data.pages.flatMap((page: any) => page.items);
      setProposals(prev => [...prev, ...newProposals]);
    }
  }, [data]);

  // Handler for swipe events
  const onSwiped = useCallback(
    (direction: "aye" | "nay" | "abstain", cardIndex: number) => {
      const proposal = proposals[cardIndex];
      if (!proposal) return;
      setIndex(cardIndex + 1)

      // trigger fetching more proposals
      if (cardIndex >= proposals.length - 10 && hasNextPage) {
        fetchNextPage();
      }

      let amountValue = "0";
      if (direction === "aye") amountValue = defaultAyeAmount;
      else if (direction === "nay") amountValue = defaultNayAmount;
      else if (direction === "abstain") amountValue = defaultAbstainAmount;

      const params = {
        postIndexOrHash: String(proposal.index),
        proposalType: proposal.proposalType,
        decision: direction,
        amount: { [direction]: amountValue },
        conviction: defaultConviction,
      };

      if (direction === "abstain") {
        params.amount["aye"] = defaultAyeAmount;
        params.amount["nay"] = defaultNayAmount;
      }

      voteMutation.mutate(params, {
        onSuccess: () => { /* TODO: toast notification */ },
        onError: (error) => { /* TODO: error handling */ },
      });
    },
    [
      proposals,
      defaultAyeAmount,
      defaultNayAmount,
      defaultAbstainAmount,
      defaultConviction,
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
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <TopBar style={{ paddingHorizontal: 16 }} />
        <View style={styles.container}>
          <Swiper
            infinite
            ref={swiperRef}
            cards={proposals}
            renderCard={(cardData, index) => <MemoizedProposalCard card={cardData} key={cardData.index} index={cardData.index} showDetails={() => setProposalDetailsOpen(true)}/>}
            onSwipedLeft={(cardIndex) => onSwiped("nay", cardIndex)}
            onSwipedRight={(cardIndex) => onSwiped("aye", cardIndex)}
            onSwipedTop={(cardIndex) => onSwiped("abstain", cardIndex)}
            backgroundColor="transparent"
            stackSize={1}
            disableBottomSwipe
            verticalSwipe
            animateCardOpacity={false}
            overlayLabels={{
              left: { element: <OverlayLabel type="nay" /> },
              right: { element: <OverlayLabel type="aye" /> },
              top: { element: <OverlayLabel type="abstain" /> },
            }}
          />
          {/* FIXME: Bottom card for stack effect, workaround for vote card flashing */}
          {
            index + 1 < proposals.length &&
            <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, zIndex: -10, marginTop: 40, padding: 30 }}>
              <MemoizedProposalCard card={proposals[index + 1]} index={proposals[index + 1].index} showDetails={() => setProposalDetailsOpen(true)}/>
            </View>
          }
          <CartItemsPreview />
        </View>
        <BottomVotingButtons swiperRef={swiperRef} />
      </SafeAreaView>

      {/* Post full details */}
      <BottomSheet
        open={proposalDetailsOpen}
        onClose={() => setProposalDetailsOpen(false)}
      >
        {proposals && proposals.length > index && (
          <PostFullDetails
            onClose={() => setProposalDetailsOpen(false)}
            post={proposals[index]}
          />
        )}
      </BottomSheet>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
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
});

export default ProposalVotingScreen;
