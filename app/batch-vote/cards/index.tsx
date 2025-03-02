import React, { useEffect, useState, useRef } from "react";
import {
  View,
  StyleSheet,
  TouchableOpacity,
  Text,
  ActivityIndicator,
} from "react-native";
import Swiper from "react-native-deck-swiper";
import { useLocalSearchParams, useRouter } from "expo-router";
import { SafeAreaView } from "react-native-safe-area-context";
import useAddCartItem from "@/lib/net/queries/actions/useAddCartItem";
import { useActivityFeed } from "@/lib/net/queries/post/useActivityFeed";
import { TopBar } from "@/lib/components/Topbar";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import IconAye from "@/lib/components/icons/shared/icon-aye";
import IconNay from "@/lib/components/icons/shared/icon-nay";
import IconAbstain from "@/lib/components/icons/shared/icon-abstain";
import { useGetCartItems } from "@/lib/net/queries/actions/useGetCartItem";
import { Ionicons } from "@expo/vector-icons";
import { ThemedText } from "@/lib/components/ThemedText";
import IconVotedProposal from "@/lib/components/icons/proposals/icon-voted-proposal";
import { ProposalCard } from "@/lib/components/proposal/ProposalCard";
import Svg, { Ellipse } from "react-native-svg";
import { bgColors } from "@/lib/constants/Colors";
import { ProposalContentSummary } from "@/lib/components/proposal";

const BATCH_SIZE = 10;

const ProposalVotingScreen: React.FC = () => {
  const searchParams = useLocalSearchParams();
  const defaultConviction = Number(searchParams?.defaultConviction) || 0;
  const defaultAyeAmount = String(searchParams?.defaultAyeAmount) || "0";
  const defaultNayAmount = String(searchParams?.defaultNayAmount) || "0";
  const defaultAbstainAmount = String(searchParams?.defaultAbstainAmount) || "0";

  const feedParams = { limit: 10 };
  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    useActivityFeed(feedParams);
  const voteMutation = useAddCartItem();

  // This state holds all fetched proposals
  const [proposals, setProposals] = useState<any[]>([]);
  // This pointer marks how many proposals we’ve already handed off to the swiper
  const [batchStartIndex, setBatchStartIndex] = useState(0);
  // This state holds the current batch of cards given to the swiper
  const [cardsBatch, setCardsBatch] = useState<any[]>([]);
  const swiperRef = useRef<any>(null);

  const backgroundColor = useThemeColor({}, "container");
  const colorStroke = useThemeColor({}, "stroke");
  const accent = useThemeColor({}, "accent");
  const { data: cartItems } = useGetCartItems();
  const router = useRouter();

  // When new data is available, append to the proposals state.
  useEffect(() => {
    if (data) {
      const allProposals = data.pages.flatMap((page: any) => page.items);
      setProposals((prev) => [...prev, ...allProposals]);
    }
  }, [data]);

  // Update the current batch whenever proposals or batchStartIndex changes.
  useEffect(() => {
    const newBatch = proposals.slice(batchStartIndex, batchStartIndex + BATCH_SIZE);
    if (newBatch.length) {
      setCardsBatch(newBatch);
    }
  }, [proposals, batchStartIndex]);

  const onSwiped = (direction: "aye" | "nay" | "abstain", cardIndex: number) => {
    const proposal = cardsBatch[cardIndex];
    if (!proposal) return;

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
      onSuccess: () => {
      },
      onError: (error) => {
      },
    });

    // If this is the last card in the current batch, load the next batch.
    if (cardIndex === cardsBatch.length - 1) {
      const nextBatchStart = batchStartIndex + BATCH_SIZE;
      setBatchStartIndex(nextBatchStart);
      // pre-fetch more proposals if we are running low
      if (proposals.length - nextBatchStart <= 3 && hasNextPage) {
        fetchNextPage();
      }
    }
  };

  if (isLoading && proposals.length === 0) {
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
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <TopBar style={{ paddingHorizontal: 16 }} />

      <View style={[styles.container]}>
        {cardsBatch.length ? (
          <Swiper
            cardVerticalMargin={16}
            key={batchStartIndex} // force remount when batch changes
            ref={swiperRef}
            cards={cardsBatch}
            cardIndex={0}
            renderCard={(card) => (
              <View style={[
                styles.cardContainer,
                { backgroundColor, borderColor: colorStroke}
              ]}>
                <ProposalCard
                  post={card}
                  descriptionLength={500}
                  withoutActions
                  withoutViewMore
                />

                <ProposalContentSummary proposalType={card.proposalType} indexOrHash={card.index} />
              </View>
            )}
            onSwipedLeft={(cardIndex) => onSwiped("nay", cardIndex)}
            onSwipedRight={(cardIndex) => onSwiped("aye", cardIndex)}
            onSwipedTop={(cardIndex) => onSwiped("abstain", cardIndex)}
            backgroundColor="transparent"
            stackSize={BATCH_SIZE}
            disableBottomSwipe
            verticalSwipe
            animateCardOpacity
            overlayLabels={{
              left: {
                element: (
                  <View style={[
                    styles.overlayLabel,
                    { backgroundColor: "rgba(249, 201, 201, 0.7)" }
                  ]}>
                    <View style={[
                      styles.iconBadge,
                      { backgroundColor: "#F53C3C" }
                    ]}>
                      <IconNay color="white" filled iconWidth={50} iconHeight={50} />
                    </View>
                  </View>
                ),
              },
              right: {
                element: (
                  <View style={[
                    styles.overlayLabel,
                    { backgroundColor: "rgba(177, 234, 203, 0.7)" }
                  ]}>
                    <View style={[
                      styles.iconBadge,
                      { backgroundColor: "#2ED47A" }
                    ]}>
                      <IconAye color="white" filled iconWidth={50} iconHeight={50} />
                    </View>
                  </View>
                ),
              },
              top: {
                element: (
                  <View style={[
                    styles.overlayLabel,
                    { backgroundColor: "rgba(247, 219, 175, 0.7)" }
                  ]}>
                    <View style={[
                      styles.iconBadge,
                      { backgroundColor: "#FFBF60" }
                    ]}>
                      <IconAbstain color="white" filled iconWidth={50} iconHeight={50} />
                    </View>
                  </View>
                ),
              },
            }}
          />
        ) : (
          <View style={styles.centered}>
            <Text>No more proposals</Text>
          </View>
        )}

        {cartItems && cartItems.length > 0 && (
          <View style={[
            styles.floatingPreview,
            { backgroundColor: "#FFE5F3" }
          ]}>
            <IconVotedProposal />
            <View style={styles.previewText}>
              <ThemedText style={{ color: "#000" }}>Preview</ThemedText>
              <ThemedText style={{ color: colorStroke }}>
                {cartItems.length} Proposals
              </ThemedText>
            </View>
            <TouchableOpacity onPress={() => router.push("/batch-vote/voted-proposals")}>
              <View style={[
                styles.iconView,
                { backgroundColor: accent }
              ]}>
                <Ionicons name="chevron-forward" color="white" size={30} />
              </View>
            </TouchableOpacity>
          </View>
        )}
      </View>
      <View style={[
        styles.bottomContainer,
        { borderColor: colorStroke }
      ]}>
        <View style={{ position: "absolute", width: "100%", height: "100%", bottom: 0, zIndex: 50 }}>
          <TabBarBackground />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "center", alignItems: "center", gap: 24, zIndex: 100, marginTop: 15 }}>
          <TouchableOpacity
            style={[
              styles.voteButton,
              {
                backgroundColor: "#F53C3C",
                width: 50,
                height: 50
              }
            ]}
            onPress={() => swiperRef.current?.swipeLeft()}
          >
            <IconNay color="white" filled iconWidth={25} iconHeight={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.voteButton,
              {
                backgroundColor: "#FFBF60",
                width: 40,
                height: 40
              }
            ]}
            onPress={() => swiperRef.current?.swipeTop()}
          >
            <IconAbstain color="white" iconWidth={20} iconHeight={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[
              styles.voteButton,
              {
                backgroundColor: "#2ED47A",
                width: 50,
                height: 50
              }
            ]}
            onPress={() => swiperRef.current?.swipeRight()}
          >
            <IconAye color="white" filled iconWidth={25} iconHeight={25} />
          </TouchableOpacity>
        </View>
      </View>
    </SafeAreaView>
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
  bottomContainer: {
    width: "100%",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'flex-end',
    alignItems: 'center',
  },
  voteButton: {
    borderRadius: 100,
    justifyContent: "center",
    alignItems: "center",
  },
  floatingPreview: {
    position: "absolute",
    bottom: 110,
    alignSelf: "center",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 100,
    flexDirection: "row",
    gap: 10,
    zIndex: 200,
    alignItems: "center",
  },
  previewText: {
    flexDirection: "column",
    alignContent: "flex-start",
  },
  iconView: {
    width: 30,
    height: 30,
    borderRadius: 15,
  },
  overlayLabel: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: 10,
    padding: 10,
  },
  iconBadge: {
    borderRadius: 100,
    padding: 20,
  },
});

function TabBarBackground() {
  return (
    <Svg width={"100%"} height={"100%"} fill={"#00000000"}>
      <Ellipse
        fill={"#000000"}
        cx={"50%"}
        cy={250 / 2}
        rx={660 / 2}
        ry={250 / 2}
        stroke={"#666666"} // sets the border color to white
        strokeWidth={1}    // sets the border thickness; adjust this value for more or less prominence
      />
    </Svg>
  );
}

export default ProposalVotingScreen;
