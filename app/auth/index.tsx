import IconGettingStarted from "@/components/icons/auth/icon-getting-started";
import IntroPager from "@/components/IntroPager";
import BottomSheet from "@/components/shared/BottomSheet";
import ThemedButton from "@/components/ThemedButton";
import { ThemedText } from "@/components/ThemedText";
import React, { useState } from "react";
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
    margin: 22,
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
  const [sheetOpen, setSheetOpen] = useState(false);

  return (
    <View style={styles.container}>
      <GettingStartedSheet
        open={sheetOpen}
        onClose={() => setSheetOpen(false)}
      />

      <SafeAreaView style={styles.container}>
        <Slides />

        <View style={styles.bottom}>
          <ThemedButton
            textType="bodyLarge"
            onPress={() => setSheetOpen((it) => !it)}
            text="Get Started"
          />
        </View>
      </SafeAreaView>
    </View>
  );
}

function GettingStartedSheet({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  return (
    <BottomSheet open={open} onClose={onClose}>
      <View
        style={{
          flexDirection: "column",
        }}
      >
        <View
          style={{
            flexDirection: "row",
            justifyContent: "space-between",
            marginBottom: 12,
          }}
        >
          <IconGettingStarted />
        </View>

        <View
          style={{
            flexDirection: "column",
            gap: 4,
          }}
        >
          <ThemedText type="titleLarge">Get Started</ThemedText>

          <ThemedText>
            Lorem ipsum dolor sit amet consectetur adipisicing elit.
          </ThemedText>
        </View>

        <View
          style={{
            marginTop: 24,
            flexDirection: "column",
            gap: 8,
          }}
        >
          <ThemedButton textType="buttonLarge" text="Connect Wallet" />

          <ThemedButton
            textType="buttonLarge"
            text="Sign Up with Email"
            bordered
          />
        </View>
      </View>
    </BottomSheet>
  );
}

function Slides() {
  return (
    <IntroPager style={styles.slides}>
      <Slide1 />
      <Slide2 />
      <Slide3 />
      <Slide4 />
      <Slide5 />
    </IntroPager>
  );
}

function Slide1() {
  return (
    <View style={styles.slideContainer}>
      <Image
        style={{ flexGrow: 1, flexBasis: 0 }}
        resizeMode="contain"
        source={require("@/assets/images/bg-intro-1.png")}
      />

      <View style={{ marginInline: 8, gap: 8 }}>
        <ThemedText type="display" style={{ textAlign: "center" }}>
          The Ultimate Hub for Polkadot Governance
        </ThemedText>

        <ThemedText style={{ textAlign: "center" }}>
          Vestibulum nec leo at dui euismod lacinia non quis risus. Vivamus
          lobortis felis lectus, et consequat lacus dapibus in. Noits....
        </ThemedText>
      </View>
    </View>
  );
}

function Slide2() {
  return (
    <View style={styles.slideContainer}>
      <ThemedText type="titleMedium">
        Hi, I am Polka- your friendly goto...
      </ThemedText>

      <Image
        style={{ flexGrow: 1, flexBasis: 0 }}
        resizeMode="contain"
        source={require("@/assets/images/bg-intro-2.png")}
      />

      <View style={{ marginInline: 8, gap: 8 }}>
        <ThemedText type="display" style={{ textAlign: "center" }}>
          Lorem Ipsum - New Feature
        </ThemedText>

        <ThemedText style={{ textAlign: "center" }}>
          Vestibulum nec leo at dui euismod lacinia non quis risus. Vivamus
          lobortis felis lectus, et consequat lacus dapibus in. Noits....
        </ThemedText>
      </View>
    </View>
  );
}

function Slide3() {
  return (
    <View style={styles.slideContainer}>
      <Image
        style={{ flexGrow: 1, flexBasis: 0 }}
        resizeMode="contain"
        source={require("@/assets/images/bg-intro-3.png")}
      />

      <View style={{ marginInline: 8, gap: 8 }}>
        <ThemedText type="display" style={{ textAlign: "center" }}>
          Create Proposals and Participate in Voting!
        </ThemedText>

        <ThemedText style={{ textAlign: "center" }}>
          Vestibulum nec leo at dui euismod lacinia non quis risus. Vivamus
          lobortis felis lectus, et consequat lacus dapibus in. Noits....
        </ThemedText>
      </View>
    </View>
  );
}

function Slide4() {
  return (
    <View style={styles.slideContainer}>
      <Image
        style={{ flexGrow: 1, flexBasis: 0 }}
        resizeMode="contain"
        source={require("@/assets/images/bg-intro-4.png")}
      />

      <View style={{ marginInline: 8, gap: 8 }}>
        <ThemedText type="display" style={{ textAlign: "center" }}>
          Create Discussions and Engage with Comm.!
        </ThemedText>

        <ThemedText style={{ textAlign: "center" }}>
          Vestibulum nec leo at dui euismod lacinia non quis risus. Vivamus
          lobortis felis lectus, et consequat lacus dapibus in. Noits....
        </ThemedText>
      </View>
    </View>
  );
}

function Slide5() {
  return (
    <View style={styles.slideContainer}>
      <Image
        style={{ flexGrow: 1, flexBasis: 0 }}
        resizeMode="contain"
        source={require("@/assets/images/bg-intro-5.png")}
      />

      <View style={{ marginInline: 8, gap: 8 }}>
        <ThemedText type="display" style={{ textAlign: "center" }}>
          Batch Voting
        </ThemedText>

        <ThemedText style={{ textAlign: "center" }}>
          Vestibulum nec leo at dui euismod lacinia non quis risus. Vivamus
          lobortis felis lectus, et consequat lacus dapibus in. Noits....
        </ThemedText>
      </View>
    </View>
  );
}
