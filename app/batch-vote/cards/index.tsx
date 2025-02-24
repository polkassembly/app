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
import ProposalCard from "@/lib/components/proposal/ProposalCard";

const ProposalVotingScreen: React.FC = () => {
  // Get defaults from search params
  const searchParams = useLocalSearchParams();
  const defaultConviction =
    searchParams?.defaultConviction !== undefined
      ? Number(searchParams.defaultConviction)
      : 0;
  const defaultAyeAmount =
    searchParams?.defaultAyeAmount !== undefined
      ? String(searchParams.defaultAyeAmount)
      : "0";
  const defaultNayAmount =
    searchParams?.defaultNayAmount !== undefined
      ? String(searchParams.defaultNayAmount)
      : "0";
  const defaultAbstainAmount =
    searchParams?.defaultAbstainAmount !== undefined
      ? String(searchParams.defaultAbstainAmount)
      : "0";

  // Fetch proposals feed
  const feedParams = { limit: 10 };
  const { data, isLoading, isError, hasNextPage, fetchNextPage } =
    useActivityFeed(feedParams);
  const voteMutation = useAddCartItem();

  // Proposals state and current index for the deck swiper
  const [proposals, setProposals] = useState<any[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);

  useEffect(() => {
    if (data) {
      const allProposals = data.pages.flatMap((page: any) => page.items);
      setProposals(allProposals);
      setCurrentIndex(0);
    }
  }, [data]);

  // Reference for deck swiper to allow programmatic swipes
  const swiperRef = useRef<any>(null);

  const { data: cartItems } = useGetCartItems();
  // Router to navigate to voted proposals screen
  const router = useRouter();

  const onSwiped = (direction: "aye" | "nay" | "abstain", cardIndex: number) => {
    const proposal = proposals[cardIndex];
    if (!proposal) return;

    // Build the amount parameter based on the swipe direction
    let amountValue = "0";
    if (direction === "aye") {
      amountValue = defaultAyeAmount;
    } else if (direction === "nay") {
      amountValue = defaultNayAmount;
    } else if (direction === "abstain") {
      amountValue = defaultAbstainAmount;
    }

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
        // Additional onSuccess logic if needed.
      },
      onError: (error) => {
        // Handle errors if needed.
      },
    });

    setCurrentIndex(cardIndex + 1);
    if (proposals.length - (cardIndex + 1) <= 2 && hasNextPage) {
      fetchNextPage();
    }
  };

  if (isLoading) {
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

  const backgroundColor = useThemeColor({}, "container");
  const colorStroke = useThemeColor({}, "stroke");
  const accent = useThemeColor({}, "accent");

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <TopBar style={{ marginTop: 20 }} />

      <View style={styles.container}>
        {currentIndex < proposals.length ? (
          <Swiper
            ref={swiperRef}
            cards={proposals}
            cardIndex={currentIndex}
            renderCard={(card) => (
              <View style={{ borderRadius: 12, padding: 10, backgroundColor: backgroundColor, borderWidth: 1, borderColor: colorStroke, flex: 1, maxHeight: "85%", overflow: "hidden"}}>
                <ProposalCard
                  post={card}
                  descriptionLength={600}
                  withoutActions
                  withoutViewMore
                />
              </View>
            )}
            onSwipedLeft={(cardIndex) => onSwiped("nay", cardIndex)}
            onSwipedRight={(cardIndex) => onSwiped("aye", cardIndex)}
            onSwipedTop={(cardIndex) => onSwiped("abstain", cardIndex)}
            backgroundColor="transparent"
            stackSize={3}
            disableBottomSwipe
            verticalSwipe
            animateCardOpacity
            overlayLabels={{
              left: {
                element: (
                  <View style={[styles.overlayLabel, { backgroundColor: "rgba(249, 201, 201, 0.7)" }]}>
                    <View style={{ borderRadius: 100, backgroundColor: "#F53C3C", padding: 20 }}>
                      <IconNay color="white" filled iconWidth={50} iconHeight={50} />
                    </View>
                  </View>

                ),
                title: "Nay",
              },
              right: {
                element: (
                  <View style={[styles.overlayLabel, { backgroundColor: "rgba(177, 234, 203, 0.7)" }]}>
                    <View style={{ borderRadius: 100, backgroundColor: "#2ED47A", padding: 20 }}>
                      <IconAye color="white" filled iconWidth={50} iconHeight={50} />
                    </View>
                  </View>
                ),
                title: "Aye",
              },
              top: {
                element: (
                  <View style={[styles.overlayLabel, { backgroundColor: "rgba(247, 219, 175, 0.7)" }]}>
                    <View style={{ borderRadius: 100, backgroundColor: "#FFBF60", padding: 20 }}>
                      <IconAbstain color="white" filled iconWidth={50} iconHeight={50} />
                    </View>
                  </View>
                ),
                title: "Abstain",
              },
            }}
          />
        ) : (
          <View style={styles.centered}>
            <Text>No more proposals</Text>
          </View>
        )}

        {/* Floating Preview (visible if cart is not empty) */}
        {cartItems && cartItems.length > 0 && (
          <View style={[styles.floatingPreview, { flexDirection: "row", justifyContent: "center", backgroundColor: "#FFE5F3" }]}>
            <IconVotedProposal />
            <View style={{ flexDirection: "column", alignContent: "flex-start" }}>
              <ThemedText style={{ color: "#000" }}>Preview</ThemedText>
              <ThemedText style={{ color: colorStroke }}>{cartItems.length} Proposals</ThemedText>
            </View>
            <TouchableOpacity onPress={() => router.push("/batch-vote/voted-proposals")}>
              <View style={[styles.iconView, { backgroundColor: accent }]}>
                <Ionicons name="chevron-forward" color="white" size={30} />
              </View>
            </TouchableOpacity>
          </View>
        )}

        {/* Bottom voting buttons trigger the same swipe animations */}
        <View style={[styles.bottomContainer, { borderColor: colorStroke, zIndex: 100 }]}>
          <TouchableOpacity
            style={[styles.voteButton, { backgroundColor: "#F53C3C" }]}
            onPress={() => swiperRef.current?.swipeLeft()}
          >
            <IconNay color="white" filled iconWidth={25} iconHeight={25} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.voteButton, { backgroundColor: "#FFBF60", width: 40, height: 40 }]}
            onPress={() => swiperRef.current?.swipeTop()}
          >
            <IconAbstain color="white" iconWidth={20} iconHeight={20} />
          </TouchableOpacity>
          <TouchableOpacity
            style={[styles.voteButton, { backgroundColor: "#2ED47A" }]}
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
    padding: 16,
    paddingBottom: 100,
  },
  cardContainer: {
    borderRadius: 10,
    padding: 10,
    flexWrap: "wrap",
  },
  centered: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  bottomContainer: {
    flexDirection: "row",
    justifyContent: "center",
    width: "120%",
    left: "-5%",
    right: "-5%",
    paddingHorizontal: 30,
    paddingVertical: 21,
    position: "absolute",
    bottom: -5,
    borderTopStartRadius: 50,
    borderTopEndRadius: 100,
    borderWidth: 2,
    backgroundColor: "#000000",
    gap: 40,
  },
  voteButton: {
    paddingVertical: 8,
    paddingHorizontal: 8,
    borderRadius: 100,
    width: 50,
    height: 50,
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
    alignItems: "center",
    zIndex: 200,
    flexDirection: "row",
    justifyContent: "center",
    gap: 10,
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
  overlayLabelText: {
    fontSize: 32,
    color: "white",
    fontWeight: "bold",
  },
});

export default ProposalVotingScreen;
