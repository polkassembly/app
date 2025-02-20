import { IconNews } from "@/lib/components/icons/Profile";
import { ThemedText } from "@/lib/components/ThemedText";
import { TopBar } from "@/lib/components/Topbar";
import { Colors } from "@/lib/constants/Colors";
import { PropsWithChildren } from "react";
import { Image, ScrollView, StyleSheet, View } from "react-native";
import Svg, {
  Defs,
  FeBlend,
  FeColorMatrix,
  FeComposite,
  FeFlood,
  FeGaussianBlur,
  FeOffset,
  Filter,
  G,
  LinearGradient,
  Path,
  Stop,
} from "react-native-svg";
import WebView from "react-native-webview";

export default function NewsScreen() {
  return (
    <View style={styles.root}>
      <TopBar />
      <ScrollView
        style={styles.content}
        contentContainerStyle={{
          gap: 8,
          padding: 16,
        }}
      >
        <Content />
      </ScrollView>
    </View>
  );
}

function Content() {
  return (
    <>
      <View style={{ flexDirection: "row", gap: 16, alignItems: "center" }}>
        <IconNews color={Colors.dark.text} />
        <ThemedText type="titleMedium">New/ Explore</ThemedText>
      </View>

      <Treasury />

      <WebView
        source={require("@/assets/x-timeline-embed.html")}
        style={{
          height: 500,
          width: "100%",
        }}
      />
    </>
  );
}

function Treasury() {
  return (
    <View>
      <Image
        style={{
          width: "100%",
          height: 151 + 64 + 64,
          position: "absolute",
          top: 0,
          left: 0,
        }}
        resizeMode="cover"
        source={require("@/assets/images/news/bg-news.gif")}
      />

      <View style={{ marginInline: "auto", marginBlock: 64 }}>
        <TreasuryContainer>
          <ThemedText type="bodyLarge">Polkadot Treasury</ThemedText>
          <ThemedText type="display">18,000 DOT</ThemedText>
          <ThemedText type="bodyMedium2" colorName="mediumText">
            ~18,000 DOT
          </ThemedText>
        </TreasuryContainer>
      </View>
    </View>
  );
}

function TreasuryContainer({ children }: PropsWithChildren) {
  return (
    <Svg
      width="232"
      height="151"
      viewBox="0 0 232 151"
      fill="none"
      style={{
        position: "fixed",
        top: 0,
        left: 0,
      }}
    >
      <G filter="url(#filter0_d_1_4488)">
        <Path d="M9 28.1919C9 18.0855 16.5246 9.60406 26.5916 8.71195C45.8092 7.00892 78.8512 4.7364 116 5.02498C152.916 5.31175 185.777 7.40518 205.046 8.91566C215.263 9.71656 223 18.2778 223 28.5261V114.802C223 124.922 215.437 133.406 205.354 134.269C186.648 135.869 154.512 138 116 138C77.4876 138 45.3525 135.869 26.6459 134.269C16.5631 133.406 9 124.922 9 114.802V28.1919Z" />
        <Path
          d="M9.5 28.1919C9.5 18.3361 16.8351 10.0785 26.6357 9.21C45.8434 7.50785 78.8685 5.23655 115.996 5.52496C152.897 5.81161 185.745 7.90422 205.007 9.41413C214.958 10.1942 222.5 18.5325 222.5 28.5261V114.802C222.5 124.67 215.128 132.931 205.312 133.771C186.615 135.37 154.495 137.5 116 137.5C77.5053 137.5 45.3848 135.37 26.6885 133.771C16.8723 132.931 9.5 124.67 9.5 114.802V28.1919Z"
          stroke="url(#paint0_linear_1_4488)"
        />
        <View
          style={{
            width: "100%",
            padding: 21,
            alignItems: "center",
            gap: 8,
          }}
        >
          {children}
        </View>
      </G>

      <Defs>
        <Filter
          id="filter0_d_1_4488"
          x="0.4"
          y="0.4"
          width="231.2"
          height="150.2"
          filterUnits="userSpaceOnUse"
          color-interpolation-filters="sRGB"
        >
          <FeFlood flood-opacity="0" result="BackgroundImageFix" />
          <FeColorMatrix
            in="SourceAlpha"
            type="matrix"
            values="0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 0 127 0"
            result="hardAlpha"
          />
          <FeOffset dy="4" />
          <FeGaussianBlur stdDeviation="4.3" />
          <FeComposite in2="hardAlpha" operator="out" />
          <FeColorMatrix
            type="matrix"
            values="0 0 0 0 0.929412 0 0 0 0 0.988235 0 0 0 0 0.454902 0 0 0 0.23 0"
          />
          <FeBlend
            mode="normal"
            in2="BackgroundImageFix"
            result="effect1_dropShadow_1_4488"
          />
          <FeBlend
            mode="normal"
            in="SourceGraphic"
            in2="effect1_dropShadow_1_4488"
            result="shape"
          />
        </Filter>
        <LinearGradient
          id="paint0_linear_1_4488"
          x1="116"
          y1="5"
          x2="116"
          y2="138"
          gradientUnits="userSpaceOnUse"
        >
          <Stop stop-color="#F0B44F" />
          <Stop offset="0.46" stop-color="white" />
          <Stop offset="1" stop-color="#EDFC74" />
        </LinearGradient>
      </Defs>
    </Svg>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.secondaryBackground,
  },

  content: {
    flex: 1,
  },
});
