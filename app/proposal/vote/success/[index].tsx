import IconInfo from "@/lib/components/icons/shared/icon-info";
import ThemedButton from "@/lib/components/ThemedButton";
import { ThemedText } from "@/lib/components/ThemedText";
import { TopBar } from "@/lib/components/Topbar";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { router } from "expo-router";
import { useLocalSearchParams } from "expo-router/build/hooks";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { EProposalType, EVoteDecision } from "@/lib/types/post";
import { toTitleCase } from "@/lib/util/stringUtil";
import { CommentBox } from "@/lib/components/feed";
import Toast from "react-native-toast-message";
import { IconTwinkle } from "@/lib/components/icons/games";

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

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <TopBar style={{ paddingHorizontal: 16 }} />

      <View style={{ justifyContent: "space-between", flex: 1, paddingHorizontal: 16 }}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              width: "100%",
              aspectRatio: 1,
              objectFit: "contain",
            }}
            source={require("@/assets/images/vote-success.gif")}
          />
          <View>
            <Image
              style={{
                width: 47,
                height: 64,
                objectFit: "contain"
              }}
              source={require("@/assets/gif/twinkle.gif")}
              />
          </View>
        </View>
        <View style={{ gap: 16, justifyContent: "center", alignItems: "center" }}>
          <View style={{ flexDirection: "row", alignItems: "center", alignContent: "center"}}>
            <ThemedText type="titleLarge">
              Your{" "}
            </ThemedText>
            <ThemedText style={{ color: decision === 'aye' ? "#2ED47A" : decision === "nay" ? "#F53C3C" : "#FFA013"}} type="titleLarge">
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

          {/* <CommentBox proposalIndex={index} proposalType={proposalType} onCommentSubmitted={() => {
            Toast.show({
              text1: "Comment added successfully"
            })
          }}/> */}

          <Note content="NOTE: Login Via web view to confirm your vote" />

          <ThemedButton
            onPress={() => router.dismissTo("/(tabs)")}
            text="Explore Feed"
            textType="buttonLarge"
            style={{ width: "100%"}}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

interface NoteProps {
  content: string;
}

function Note({ content }: NoteProps) {
  return (
    <View
      style={{
        backgroundColor: "#002C4F",
        padding: 8,
        gap: 16,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
        width: "100%"
      }}
    >
      <IconInfo />
      <ThemedText type="bodySmall">{content}</ThemedText>
    </View>
  );
}