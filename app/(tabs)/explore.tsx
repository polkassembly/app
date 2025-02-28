import GlitterBackground from "@/lib/components/icons/browser/glitter-background";
import IconPolkasafe from "@/lib/components/icons/browser/icon-polkasafe";
import { IconBrowser } from "@/lib/components/icons/icon-browser";
import { IconPoints } from "@/lib/components/icons/icon-points";
import { IconSearch } from "@/lib/components/icons/shared";
import ThemedButton from "@/lib/components/ThemedButton";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { Colors } from "@/lib/constants/Colors";
import { useGetUserById } from "@/lib/net/queries/profile";
import { KEY_ID, storage } from "@/lib/store";
import { ResizeMode, Video } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import { openBrowserAsync } from "expo-web-browser";
import React from "react";
import {
  Image,
  ImageSourcePropType,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  TouchableOpacity,
  useWindowDimensions,
  View,
} from "react-native";
import Carousel from "react-native-reanimated-carousel";
import { CarouselRenderItemInfo } from "react-native-reanimated-carousel/lib/typescript/types";

export default function Browser() {
  return (
    <View style={{ backgroundColor: Colors.dark.secondaryBackground, flex: 1 }}>
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

            <Text style={styles.bannerTitle}>
              Welcome to Polkassembly Browser!
            </Text>
            <Text style={styles.bannerSubtitle}>
              Polkadot anything, everything!
            </Text>

            <Image
              style={{ height: 36, width: 102 }}
              source={require("@/assets/images/browser/polkaassembly.png")}
            />
          </View>
        </View>

        <View style={{ paddingInline: 16, marginBlock: 16, gap: 16 }}>
          <View style={styles.searchInput}>
            <IconSearch />

            <TextInput
              placeholder="Search by name or enter URL"
              placeholderTextColor={Colors.dark.mediumText}
              style={{ color: Colors.dark.text }}
            />
          </View>

          <View style={{ gap: 8 }}>
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
                <ThemedText type="bodySmall">Polkassembly</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featuredCard}
                onPress={() => openBrowserAsync("https://townhallgov.com/")}
              >
                <Image
                  source={require("@/assets/images/browser/feature-townhall.png")}
                  style={styles.featuredImage}
                />
                <ThemedText type="bodySmall">Townhall</ThemedText>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.featuredCard}
                onPress={() => openBrowserAsync("https://polkasafe.xyz/")}
              >
                <IconPolkasafe />
                <ThemedText type="bodySmall">Polkasafe</ThemedText>
              </TouchableOpacity>
            </View>
          </View>
        </View>

        <QuickActions />
      </ScrollView>
    </View>
  );
}

function TitleSection() {
  const id = storage.getString(KEY_ID);

  const { data } = useGetUserById(id || "");

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
          color={Colors.dark.tint}
          style={{ width: 24, height: 24 }}
        />
        <ThemedText type="titleMedium" style={{ fontWeight: 700 }}>
          {data?.profileScore}
        </ThemedText>
      </View>
    </ThemedView>
  );
}

function QuickActions() {
  const size = useWindowDimensions();

  return (
    <View style={{ padding: 16, gap: 16 }}>
      <GlitterBackground
        style={{
          zIndex: -10,
          top: 0,
          left: 0,
          position: "absolute",
          width: "100%",
        }}
      />

      <View>
        <ThemedText
          style={[
            styles.quickActionHeading,
            {
              textShadowColor: Colors.dark.accent,
              fontSize: 12,
            },
          ]}
        >
          POLKASSEMBLY
        </ThemedText>

        <ThemedText
          style={[
            styles.quickActionHeading,
            {
              textShadowColor: "#4766F9",
              fontSize: 24,
              color: "#F0B44F",
            },
          ]}
        >
          QUICK ACTIONS
        </ThemedText>
      </View>

      <Carousel
        defaultIndex={1}
        width={size.width}
        windowSize={size.width / 3}
        height={400}
        data={quickActions}
        mode="parallax"
        snapEnabled={true}
        loop={false}
        renderItem={renderQuickActionItem}
      ></Carousel>
    </View>
  );
}

const quickActions: QuickActionCardProps[] = [
  {
    title: "Bounties",
    subtitle: "See The Latest Hot Bounties",
    button: "Go To Bounties",
    url: "https://polkadot.polkassembly.io/bounty-dashboard",
    imageSource: require("@/assets/images/browser/quick-action-bounties.png"),
  },
  {
    title: "Delegation",
    subtitle: "Delegate on Polkassmebly",
    button: "Delegate Now",
    url: "https://polkadot.polkassembly.io/delegation",
    imageSource: require("@/assets/images/browser/quick-action-delegate.png"),
  },
  {
    title: "Calendar",
    subtitle: "Checkout Calendar On Polkassembly",
    button: "See Calendar",
    url: "https://polkadot.polkassembly.io/calendar",
    imageSource: require("@/assets/images/browser/quick-action-calendar.png"),
  },
];

function renderQuickActionItem(
  info: CarouselRenderItemInfo<QuickActionCardProps>
) {
  return <QuickActionCard {...info.item} />;
}

interface QuickActionCardProps {
  title: string;
  subtitle: string;
  url: string;
  imageSource: ImageSourcePropType;
  button: string;
}

function QuickActionCard({
  title,
  subtitle,
  url,
  imageSource,
  button,
}: QuickActionCardProps) {
  return (
    <ThemedView
      type="secondaryBackground"
      style={{
        borderWidth: 1,
        borderColor: "#383838",
        paddingBlock: 16,
        paddingInline: 24,
        gap: 36,
        shadowColor: "#F100861A",
        shadowRadius: 10,
        shadowOffset: {
          width: 1,
          height: 0,
        },
        borderRadius: 8,
        alignItems: "center",
      }}
    >
      <ThemedText
        style={{ textTransform: "uppercase", color: Colors.dark.mediumText }}
      >
        {title}
      </ThemedText>
      <Image source={imageSource} />
      <ThemedText type="titleMedium">{subtitle}</ThemedText>
      <ThemedButton
        style={{ backgroundColor: "white", alignSelf: "stretch" }}
        textStyle={{ color: "black" }}
        textType="buttonLarge"
        text={button}
        onPress={() => openBrowserAsync(url)}
      />
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
    marginInline: 64,
    marginBlock: 32,
    gap: 8,
  },
  bannerTitle: {
    padding: 16,
    fontSize: 20,
    fontWeight: "bold",
    color: "#FFFFFF",
    marginBottom: 5,
    textAlign: "center",
  },
  bannerSubtitle: {
    fontSize: 14,
    color: "#BBBBBB",
    textAlign: "center",
  },

  searchInput: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    borderColor: Colors.dark.stroke,
    borderWidth: 1,
    borderRadius: 32,
    paddingHorizontal: 15,
    paddingVertical: 10,
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

  quickActionHeading: {
    textAlign: "center",
    textShadowRadius: 0.1,
    textShadowOffset: {
      height: 2,
      width: -2,
    },
    borderWidth: 0.5,
  },
});
