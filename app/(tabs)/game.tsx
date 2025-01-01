import React from "react";
import { Colors } from "@/constants/Colors";
import { IconGame } from "@/components/icons/icon-game";
import { IconPoints } from "@/components/icons/icon-points";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PropsWithChildren } from "react";
import { Image, StyleSheet, TouchableOpacity, View, ImageBackground, Text, TouchableOpacityProps } from "react-native";
import { ScrollView } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { categories, games, playedGames } from "../data/mockData";
import { GradientText, OutlinedText, ThemedTextInput } from "@/components/shared";
import { IconFilterOption, IconFireworks, IconStar, IconTwinkle } from "@/components/icons/games";
import { Video, ResizeMode } from "expo-av";
import { LinearGradient } from "expo-linear-gradient";
import IntroPager from "@/components/IntroPager";
import { TextInput } from "react-native";
import { IconSearch } from "@/components/icons/shared";
import CircularProgressBar from "@/components/shared/CircularProgressBar";

export default function GameScreen() {
  return (
    <GameWrapper>
      <TitleSection />
      <HeroSection />
      <SearchSection />
      <HotGamesSection />
      <CuratedForYouSection />
      <UnfinishedBusinessSection />
      <CategoriesSection />
    </GameWrapper>
  );
}

function GameWrapper({ children }: PropsWithChildren) {
  return (
    <SafeAreaView>
      <ThemedView type="container" style={styles.mainContainer}>
        <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 32 }}>
          {children}
        </ScrollView>
      </ThemedView>
    </SafeAreaView>
  );
}

function TitleSection() {
  return (
    <ThemedView type="container" style={styles.titleContainer}>
      <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
        <IconGame color={Colors.dark.tint} style={{ width: 24, height: 24 }} />
        <ThemedText type="titleMedium" style={{ fontWeight: 500 }}>
          Games Portal
        </ThemedText>
      </View>
      <View style={{ flexDirection: "row", gap: 6, alignItems: "center" }}>
        <IconPoints color={Colors.dark.tint} style={{ width: 24, height: 24 }} />
        <ThemedText type="titleMedium" style={{ fontWeight: 700 }}>
          7,896
        </ThemedText>
      </View>
    </ThemedView>
  )
}
function HeroSection() {
  return (
    <View style={{ overflow: "hidden" }}>
      <Video
        source={require("@/assets/videos/game_hero.mp4")}
        style={styles.heroVideoBg}
        shouldPlay
        isLooping
        isMuted
        resizeMode={ResizeMode.COVER}
      />

      {/* Linear gradient */}
      <LinearGradient
        colors={["#000000", "rgba(0, 0, 0, 0)"]}
        start={{ x: 0.5, y: 0.27 }}
        end={{ x: 0.5, y: 0.47 }}
        style={styles.heroVideoMask}
      />

      <View style={styles.heroContainer}>
        <View style={{ backgroundColor: "#FF8811", width: 261, height: 251, padding: 14 }}>
          <View style={{ backgroundColor: "#FFFFFF", width: 232, height: 223 }}>
            <Image
              source={require("@/assets/images/games/game_marvel.png")}
              resizeMode="contain"
              style={{ width: 232, height: 103 }}
            />

            <View style={{ marginTop: 11, width: "100%", alignItems: "center", gap: 6 }}>
              <Text style={styles.heroTitle}>FORTNITE</Text>
              <View>
                <ThemedText type="bodyMedium3" style={{ color: "#000000", lineHeight: 21 }}>
                  Win the battle for
                </ThemedText>
                <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                  <IconPoints color="#FFD669" />
                  <ThemedText colorName="container" style={styles.heroPoints}>
                    6000
                  </ThemedText>
                </View>
              </View>
            </View>
          </View>
        </View>
        <PlayNowButton />
      </View>
    </View>
  );
}
function SearchSection() {
  return (
    <View style={{ paddingHorizontal: 16, gap: 12, flexDirection: 'row', alignItems: 'center' }}>
      <View style={{ flexDirection: 'row', alignItems: 'center', borderWidth: 1, borderColor: '#E5E5E5', borderRadius: 20, paddingHorizontal: 10, gap: 6, flex: 1 }}>
        <IconSearch />
        <TextInput
          style={{ flex: 1, color: '#FFF' }}
          placeholder="Search by name or enter URL"
          placeholderTextColor="#9B9B9B"
        />
      </View>
      <IconFilterOption iconWidth={40} iconHeight={40} />
    </View>
  );
}
function HotGamesSection() {
  return (
    <View style={styles.hotGamesContainer}>
      <View style={{ alignItems: "center", marginBottom: 11 }}>
        <GradientText text="HOT GAMES" style={styles.gradientText} />
      </View>
      <IconFireworks iconHeight={36} iconWidth={36} style={[styles.fireworks, { left: 0, top: 0 }]} />
      <IconFireworks iconHeight={13} iconWidth={13} style={[styles.fireworks, { left: 0, top: 51 }]} />
      <IconFireworks iconHeight={24} iconWidth={24} style={[styles.fireworks, { left: 100, top: 30 }]} />
      <IconFireworks iconHeight={24} iconWidth={24} style={[styles.fireworks, { left: 280, top: 2 }]} />
      <IconFireworks iconHeight={17} iconWidth={17} style={[styles.fireworks, { left: 370, top: 40 }]} />
      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          {
            games.map((game, index) => (
              <GameCard key={index} {...game} />
            ))
          }
        </View>
      </ScrollView>
    </View>
  )
}
function CuratedForYouSection() {
  return (
    <View style={styles.curatedForYouContainer}>
      <View style={{ alignItems: "center", marginBottom: 11 }}>
        <GradientText text="CURATED FOR YOU" style={styles.gradientText} colors={["#FFDA56", "#FFFFFF", "#FFDA56"]} />
      </View>
      <IconTwinkle iconHeight={21} iconWidth={21} style={[styles.fireworks, { left: 7, top: 33 }]} />
      <IconTwinkle iconHeight={21} iconWidth={21} style={[styles.fireworks, { left: 61, top: -10 }]} />
      <IconTwinkle iconHeight={12} iconWidth={12} style={[styles.fireworks, { left: 283, top: 36 }]} />
      <IconTwinkle iconHeight={12} iconWidth={12} style={[styles.fireworks, { left: 298, top: 6 }]} />
      <IconTwinkle iconHeight={12} iconWidth={12} style={[styles.fireworks, { left: 351, top: 24 }]} />

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View style={{ flexDirection: "row" }}>
          {
            games.map((game, index) => (
              <GameCard key={index} {...game} />
            ))
          }
        </View>
      </ScrollView>
    </View>
  )
}
function UnfinishedBusinessSection() {
  return (
    <View style={styles.unfinishedBusinessContainer}>
      <View style={{ alignItems: "center", marginBottom: 11 }}>
        <GradientText text="UNFINISHED BUSINESS" style={styles.gradientText} colors={["#52FFF3", "#FFFFFF", "#52FFF3"]} />
      </View>
      <IconTwinkle iconHeight={21} iconWidth={21} style={[styles.fireworks, { left: 7, top: 33 }]} />
      <IconTwinkle iconHeight={21} iconWidth={21} style={[styles.fireworks, { left: 61, top: -10 }]} />
      <IconTwinkle iconHeight={12} iconWidth={12} style={[styles.fireworks, { left: 283, top: 36 }]} />
      <IconTwinkle iconHeight={12} iconWidth={12} style={[styles.fireworks, { left: 298, top: 6 }]} />
      <IconTwinkle iconHeight={12} iconWidth={12} style={[styles.fireworks, { left: 351, top: 24 }]} />

      <View style={{ flexDirection: "column", gap: 12 }}>
        {
          playedGames.slice(0, 2).map((game, index) => (
            <PlayedGamesCard key={index} {...game} />
          ))
        }
      </View>
    </View>
  )
}
function CategoriesSection() {
  return (
    <View style={{ paddingHorizontal: 16, gap: 12 }}>
      <ThemedText type="bodySmall">
        CATEGORIES
      </ThemedText>

      <IntroPager style={{ width: "100%", height: 200 }}>
        {
          categories.map((category, index) => (
            <View key={index}>
              <Image source={{ uri: category.image }} style={{ position: "absolute", width: "100%", height: 150, borderRadius: 12 }} resizeMethod="scale" resizeMode="cover" />
              <View style={{ left: 8, top: 95 }}>
                <ThemedText type="titleMedium">{category.title}</ThemedText>
                <ThemedText type="bodySmall">{category.description}</ThemedText>
              </View>
            </View>
          ))
        }
      </IntroPager>
    </View>
  )
}

const PlayNowButton = React.forwardRef<View, TouchableOpacityProps>((props, ref) => {
  return (
    <View style={{ width: 260, height: 51, marginTop: 20, marginBottom: 13 }}>
      <ImageBackground
        source={require("@/assets/images/games/playNowButtonBg.png")}
        imageStyle={styles.buttonBackground}
      >
        <TouchableOpacity style={styles.button} {...props} ref={ref}>
          <OutlinedText>PLAY NOW</OutlinedText>
        </TouchableOpacity>
      </ImageBackground>
    </View>
  );
});

interface GameCardProps {
  title: string;
  rating: number;
  image: string;
}
function GameCard({ title, rating, image }: GameCardProps) {
  return (
    <View style={styles.gameCardContainer}>
      <Image source={{ uri: image }} resizeMode="cover" style={{ width: 90, height: 130, borderRadius: 12 }} />


      <ThemedText type="bodySmall3" style={{ fontWeight: 600, color: "#000" }}>
        {title}
      </ThemedText>

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <View style={styles.flexRowGap4AlignCenter}>
          <Image source={require("@/assets/images/games/polkadot.png")} style={{ width: 8, height: 8 }} />
          <ThemedText type="bodySmall4" style={{ color: "#9B9B9B" }}>Polkadot</ThemedText>
        </View>
        <View style={styles.flexRowGap4AlignCenter}>
          <IconStar />
          <ThemedText type="bodySmall4" style={{ color: "#9B9B9B" }}>{rating}</ThemedText>
        </View>
      </View>
    </View>
  )
}

interface playedGamesProps {
  title: string,
  image: string,
  levels: number,
  levelsCompleted: number
}
function PlayedGamesCard({ title, image, levels, levelsCompleted }: playedGamesProps) {
  return (
    <View style={{ backgroundColor: "#0D837B", borderRadius: 26, paddingHorizontal: 12, paddingVertical: 14, flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
      <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
        <Image source={{ uri: image }} style={{ width: 48, height: 48, borderRadius: 32 }} />
        <View style={{ flexDirection: 'column', gap: 4 }} >
          <ThemedText type="bodyMedium3" style={{ color: "#FFFFFF", fontSize: 15 }}>{title}</ThemedText>
          <ThemedText type="bodySmall1" style={{ color: "#FFFFFF", fontWeight: 400, lineHeight: 12 }}>{levels} levels</ThemedText>
        </View>
      </View>
      <CircularProgressBar percentage={(levelsCompleted / levels) * 100} radius={20} strokeWidth={4} color="#000000" backgroundColor="#FFFFFF" />
    </View>
  )
}

const styles = StyleSheet.create({
  mainContainer: {
    width: "100%",
    height: "100%",
  },
  scrollView: {
    marginTop: 16,
  },
  titleContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 16
  },
  heroVideoBg: {
    position: "absolute",
    width: "100%",
    height: 667,
    zIndex: -1,
  },
  heroVideoMask: {
    position: "absolute",
    bottom: 0,
    width: "100%",
    height: "100%",
    zIndex: -1
  },
  heroContainer: {
    alignItems: "center",
  },
  heroTitle: {
    fontFamily: "Recharge",
    fontSize: 28,
    lineHeight: 33.6,
    color: "#4766F9",
  },
  heroPoints: {
    fontSize: 25,
    fontWeight: "700",
    lineHeight: 37.5,
  },
  buttonBackground: {
    width: "100%",
    height: "100%",
    resizeMode: "stretch",
  },
  button: {
    width: "100%",
    height: "100%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "transparent",
  },
  hotGamesContainer: {
    backgroundColor: "#350148",
    paddingTop: 16,
    paddingBottom: 20,
  },
  gradientText: {
    fontFamily: "LilitaOneRegular",
    fontSize: 24,
    lineHeight: 27
  },
  fireworks: {
    ...StyleSheet.absoluteFillObject,
    zIndex: 5,
  },
  curatedForYouContainer: {
    backgroundColor: "#000045",
    paddingTop: 16,
    paddingBottom: 20,
    overflow: "hidden",
  },
  flexRowGap4AlignCenter: {
    flexDirection: "row",
    gap: 4,
    alignItems: "center"
  },
  gameCardContainer: {
    width: 110,
    height: 182,
    backgroundColor: "#FFFFFF",
    borderRadius: 8,
    padding: 10,
    marginLeft: 24,
    gap: 4
  },
  unfinishedBusinessContainer: {
    backgroundColor: "#00B6AA",
    paddingTop: 16,
    paddingBottom: 20,
    overflow: "hidden",
    paddingHorizontal: 16,
    height: 243
  }
});
