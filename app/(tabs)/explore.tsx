import { QuickActions } from "@/lib/components/browser";
import IconPolkasafe from "@/lib/components/icons/browser/icon-polkasafe";
import { IconBrowser } from "@/lib/components/icons/icon-browser";
import { IconPoints } from "@/lib/components/icons/icon-points";
import { IconSearch } from "@/lib/components/icons/shared";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { Colors } from "@/lib/constants/Colors";
import { useProfileStore } from "@/lib/store/profileStore";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { openBrowserAsync } from "expo-web-browser";
import React from "react";
import {
  Image,
  ScrollView,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Browser() {
  return (
    <View style={{ backgroundColor: Colors.dark.secondaryBackground, flex: 1, zIndex: -100 }}>
      <SafeAreaView style={{ flex: 1 }} >
        <TitleSection />

        <ScrollView
          style={styles.container}
          contentContainerStyle={{ paddingBottom: 64 }}
        >
          <View>
            <Video
              source={require("@/assets/videos/browser/bg.mp4")}
              style={{
                position: "absolute",
                top: 0,
                height: "100%",
                width: "100%",
                opacity: 0.3
              }}
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
                style={{
                  position: "absolute",
                  top: 0,
                  height: "100%",
                  width: "100%",
                }}
              />

              <View style={{ padding: 20, alignItems: "center" }}>
                <ThemedText type="titleMedium" style={{ textAlign: "center", marginBottom: 10 }}>
                  Welcome to{"\n"} Polkassembly Browser!
                </ThemedText>
                <ThemedText type="bodyMedium3" style={{ textAlign: "center", color: "#737373", marginBottom: 20 }}>
                  Polkadot anything, everything!
                </ThemedText>

                <Image
                  style={{ height: 36, width: 102 }}
                  source={require("@/assets/images/browser/polkaassembly.png")}
                />
              </View>
            </View>
            <View style={{ position: "absolute", left: 0, right: 0, top: 0, bottom: 0, backgroundColor: "#000", opacity: 0.3 }} />
          </View>

          <View style={{ paddingInline: 16, marginBlock: 24, gap: 24 }}>
            <View style={styles.searchInput}>
              <IconSearch />

              <TextInput
                placeholder="Search by name or enter URL"
                placeholderTextColor={Colors.dark.mediumText}
                style={{ color: Colors.dark.text }}
              />
            </View>

            <View style={{ gap: 16 }}>
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
                    <ThemedText type="bodySmall4" style={{ color: "#9B9B9B" }}>Governance</ThemedText>
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
                    <ThemedText type="bodySmall4" style={{ color: "#9B9B9B" }}>Governance</ThemedText>
                  </View>
                </TouchableOpacity>

                <TouchableOpacity
                  style={styles.featuredCard}
                  onPress={() => openBrowserAsync("https://polkasafe.xyz/")}
                >
                  <IconPolkasafe />
                  <View>
                    <ThemedText type="bodySmall3">Polkasafe</ThemedText>
                    <ThemedText type="bodySmall4" style={{ color: "#9B9B9B" }}>Governance</ThemedText>
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          </View>

          <QuickActions />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function TitleSection() {

  const userProfile = useProfileStore((state) => state.profile);

  return (
    <ThemedView type="container" style={styles.titleContainer}>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <IconBrowser
          color={Colors.dark.text}
          style={{ width: 24, height: 24 }}
        />
        <ThemedText type="titleMedium" style={{ fontWeight: 500 }}>
          Browser
        </ThemedText>
      </View>
      <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
        <IconPoints
          iconHeight={24}
          iconWidth={24}
        />
        <ThemedText type="titleMedium" style={{ fontWeight: 700 }}>
          {userProfile?.profileScore}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  bannerContainer: {
    alignItems: "center",
    backgroundColor: "#01017F",
    marginInline: 50,
    marginBlock: 35,
  },
  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderColor: Colors.dark.stroke,
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 15,
    paddingVertical: 4,
  },

  sectionTitle: {
    fontSize: 16,
    color: Colors.dark.text,
    fontWeight: "600",
    marginBottom: 10,
  },
  featuredCardsWrapper: {
    flexDirection: "row",
    gap: 16,
  },
  featuredImage: {
    height: 32,
    width: 32,
    resizeMode: "contain",
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
  featuredCardText: {
    color: "#FFF",
    fontSize: 14,
    fontWeight: "500",
  },

  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16,
    paddingBlock: 16,
  },
});
