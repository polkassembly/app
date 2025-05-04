import IconInfo from "@/lib/components/icons/shared/icon-info";
import { ThemedButton } from "@/lib/components/shared/button";
import { ThemedText } from "@/lib/components/shared/text";
import { Note, TopBar, UserAvatar } from "@/lib/components/shared";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Image, StyleSheet, TouchableOpacity, View } from "react-native";
import { EProposalType, EVoteDecision } from "@/lib/types/post";
import { toTitleCase } from "@/lib/util/stringUtil";
import { ThemedView, TopGlow, VoteSuccessView } from "@/lib/components/shared/View";
import { useProfileStore } from "@/lib/store/profileStore";
import { useCommentSheet } from "@/lib/context/commentContext";
import { UserProfile } from "@/lib/types";
import { TouchableWithoutFeedback } from "react-native-gesture-handler";
import { useProposalStore } from "@/lib/store/proposalStore";
import { useGetUserByAddress } from "@/lib/net/queries/profile";

type Params = {
  conviction: string;
  dot: string;
  decision: EVoteDecision
  index: string
  proposalType: EProposalType
};

export default function SuccessScreen() {
  const backgroundColor = useThemeColor({}, "secondaryBackground");
  const { conviction, decision, dot, index, proposalType } = useLocalSearchParams<Params>();

  const userProfile = useProfileStore((state) => state.profile);
  const proposal = useProposalStore((state) => state.proposal);

  const { data: author } = useGetUserByAddress(proposal?.onChainInfo?.proposer || "")

  const { openCommentSheet } = useCommentSheet();

  const handleCommentPress = () => {
    openCommentSheet({
      proposalIndex: index,
      proposalType: proposalType,
      author: author as UserProfile,
      proposalTitle: proposal?.title || "",
      

      onCommentSuccess: () => {
        router.dismissTo(`/(tabs)`)
      },
    });
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <TopBar style={{ paddingHorizontal: 16 }} />
      <VoteSuccessView />
      <View>
        <TopGlow />
        <ThemedView type="secondaryBackground" style={{ gap: 16, justifyContent: "center", alignItems: "center", paddingHorizontal: 16, borderRadius: 26, paddingVertical: 26 }}>
          <View style={{ gap: 8 }}>
            <View style={{ flexDirection: "row", alignItems: "center", alignContent: "center" }}>
              <ThemedText type="titleLarge">
                Your{" "}
              </ThemedText>
              <ThemedText style={{ color: decision === 'aye' ? "#2ED47A" : decision === "nay" ? "#F53C3C" : "#FFA013" }} type="titleLarge">
                {toTitleCase(decision)}
              </ThemedText>
              <ThemedText type="titleLarge">
                {" "}was added to cart
              </ThemedText>
            </View>

            <View
              style={{
                flexDirection: "row",
                alignItems: "baseline",
                justifyContent: "center",
              }}
            >
              <ThemedText type="titleMedium">
                {conviction}x conviction
              </ThemedText>
              <ThemedText type="bodyMedium1" colorName="mediumText">
                {" "}
                with{" "}
              </ThemedText>
              <ThemedText type="titleMedium" colorName="ctaText">
                {dot} DOT
              </ThemedText>
            </View>
          </View>

          <TouchableOpacity
            onPress={handleCommentPress}
            style={{ width: "100%" }}
            touchSoundDisabled
          >
            <ThemedView
              style={styles.commentBox}
            >
              <UserAvatar
                width={24}
                height={24}
                avatarUrl={userProfile?.profileDetails.image || ""}
              />
              <ThemedText type="bodySmall" colorName="mediumText">
                Share your reason to vote in a comment...
              </ThemedText>
            </ThemedView>
          </TouchableOpacity>

          <Note content="Login Via Desktop to confirm your vote" />

          <ThemedButton
            onPress={() => router.dismissTo("/(tabs)")}
            text="Explore Feed"
            textType="buttonLarge"
            style={{ width: "100%" }}
          />
        </ThemedView>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  commentBox: {
    padding: 8,
    gap: 16,
    borderRadius: 26,
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
  },
});