import IntroPager from "@/lib/components/IntroPager";
import { GradientText } from "@/lib/components/shared";
import ThemedButton from "@/lib/components/ThemedButton";
import { ThemedText } from "@/lib/components/ThemedText";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Link } from "expo-router";
import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    display: "flex",
    flexDirection: "column",
  },

  slides: {
    display: "flex",
    flex: 1,
    marginTop: 32,
    flexGrow: 6,
  },

  bottom: {
    flexGrow: 1,
    flexBasis: 0,
    display: "flex",
    flexDirection: "column",
    justifyContent: "flex-end",
    marginHorizontal: 22,
    marginBottom: 16,
  },

  slideContainer: {
    display: "flex",
    flex: 1,
    flexDirection: "column",
    alignItems: "center",
    gap: 8,
  },
});

export default function IntroScreen() {

  const bgColor = useThemeColor({}, "container")
  return (
    <View style={[styles.container, { backgroundColor: bgColor}]}>

      <SafeAreaView style={styles.container}>
        <Slides />

        <View style={styles.bottom}>
          <Link href="/auth/qrAuth" asChild>
            <ThemedButton
              textType="bodyLarge"
              text="Get Started"
            />
          </Link>
        </View>
      </SafeAreaView>
    </View>
  );
}

function Slides() {
  return (
    <IntroPager style={styles.slides}>
      <Slide1 />
      <Slide2 />
    </IntroPager>
  );
}

function Slide1() {
  return (
    <View style={styles.slideContainer}>
      <Image
        style={{ flexGrow: 1, flexBasis: 0, maxWidth: "100%" }}
        resizeMode="contain"
        source={require("@/assets/images/auth/bg-intro-1.png")}
      />

      <View style={{ marginInline: 8, gap: 8, marginTop: 32 }}>
        <ThemedText type="display" style={{ textAlign: "center" }}>
          The Ultimate Hub for{"\n"} Polkadot Governance
        </ThemedText>

        <ThemedText style={{ textAlign: "center", color: "#79767D" }}>
          Welcome to Polkassembly! Engage with the Polkadot ecosystem: vote, participate in discussions, and help shape the future.
        </ThemedText>
      </View>
    </View>
  );
}

function Slide2() {
  return (
    <View style={styles.slideContainer}>
      <Image
        style={{ width: 160, height: 50 }}
        resizeMode="contain"
        source={require("@/assets/images/logo-wide.png")}
      />

      <Image
        style={{ flexGrow: 1, flexBasis: 0 }}
        resizeMode="contain"
        source={require("@/assets/images/auth/bg-intro-2.gif")}
      />

      <View style={{ marginInline: 32, gap: 8 }}>
        <ThemedText type="display" style={{ textAlign: "center" }}>
          Meet Polka, Your {"\n"} Governance Buddy!
        </ThemedText>

        <ThemedText style={{ textAlign: "center", color: "#79767D" }}>
          Polka's here to guide you through voting, discussions, and making an impact in the Polkadot ecosystem!
        </ThemedText>
      </View>
    </View>
  );
}