import IconInfo from "@/lib/components/icons/shared/icon-info";
import ThemedButton from "@/lib/components/ThemedButton";
import { ThemedText } from "@/lib/components/ThemedText";
import { TopBar } from "@/lib/components/Topbar";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { router } from "expo-router";
import { useLocalSearchParams, useSearchParams } from "expo-router/build/hooks";
import { Image, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Params = {
  conviction: string;
  dot: string;
};

export default function SuccessScreen() {
  const backgroundColor = useThemeColor({}, "secondaryBackground");

  const { conviction, dot } = useLocalSearchParams<Params>();

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <TopBar />

      <View style={{ padding: 16, justifyContent: "space-between", flex: 1 }}>
        <View style={{ flexDirection: "row" }}>
          <Image
            style={{
              width: "100%",
              aspectRatio: 1,
              objectFit: "contain",
            }}
            source={require("@/assets/images/vote-success.gif")}
          />
        </View>

        <View style={{ gap: 16 }}>
          <ThemedText style={{ textAlign: "center" }} type="titleLarge">
            Your Aye was added to cart
          </ThemedText>

          <View
            style={{
              flexDirection: "row",
              alignItems: "baseline",
              justifyContent: "center",
            }}
          >
            <ThemedText type="titleMedium">{conviction}x conviction</ThemedText>
            <ThemedText type="bodyMedium1" colorName="mediumText">
              {" "}
              with{" "}
            </ThemedText>

            <ThemedText type="titleMedium" colorName="ctaText">
              {dot} DOT
            </ThemedText>
          </View>

          <Note content="NOTE: Login Via web view to confirm your vote" />

          <ThemedButton
            onPress={() => router.dismissTo("/(tabs)")}
            text="Explore Feed"
            textType="buttonLarge"
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
      }}
    >
      <IconInfo />
      <ThemedText type="bodySmall">{content}</ThemedText>
    </View>
  );
}
