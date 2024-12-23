import { IconPoints } from "@/components/icons/icon-points";
import { IconQR } from "@/components/icons/icon-qr";
import { ThemedText } from "@/components/ThemedText";
import { Colors } from "@/constants/Colors";
import React, { PropsWithChildren, useState } from "react";
import {
  Image,
  Pressable,
  ScrollView,
  StyleSheet,
  Text,
  useWindowDimensions,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, {
  Defs,
  Ellipse,
  LinearGradient,
  RadialGradient,
  Rect,
  Stop,
} from "react-native-svg";
import {
  SceneMap,
  TabBar,
  TabBarIndicator,
  TabView,
} from "react-native-tab-view";

const renderScene = SceneMap({
  profile: Profile,
  timeline: Timeline,
});

const routes = [
  { key: "profile", title: "Profile" },
  { key: "timeline", title: "Timeline" },
];

const styles = StyleSheet.create({
  container: {
    width: "100%",
    height: "100%",
  },

  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    margin: 24,
  },

  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ff6191",
  },

  pointsWrapper: {
    marginInline: 24,
  },

  pointsContainer: {
    display: "flex",
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingBlock: 16,
    paddingInline: 20,
  },
});

function Profile() {
  return (
    <ScrollView style={styles.container}>
      <ProfileHeader />

      <PointsView />

      <Badges />

      <Actions />

      <Activity />
    </ScrollView>
  );
}

function ProfileHeader() {
  return (
    <View style={styles.headerContainer}>
      <ThemedText type="titleLarge">GM, Zesha</ThemedText>
      <Image style={styles.avatar} />
    </View>
  );
}

function PointsView() {
  return (
    <View style={styles.pointsWrapper}>
      <PointsViewBackground />

      <View style={styles.pointsContainer}>
        <View style={{ display: "flex", flexDirection: "column", gap: 2 }}>
          <ThemedText>Your Points</ThemedText>

          <View
            style={{
              display: "flex",
              flexDirection: "row",
              alignItems: "center",
              gap: "8",
            }}
          >
            <IconPoints style={{ width: 24 }} />
            <ThemedText type="titleLarge" style={{ fontWeight: 700 }}>
              7,896
            </ThemedText>
          </View>
        </View>

        <Pressable
          style={{
            backgroundColor: "#FFFFFF12",
            padding: 8,
            borderRadius: 8,
          }}
        >
          <IconQR style={{ width: 16 }} />
        </Pressable>
      </View>
    </View>
  );
}

function PointsViewBackground() {
  return (
    <Svg
      style={{
        position: "absolute",
        top: 0,
        left: 0,
        height: "100%",
        width: "100%",
      }}
      viewBox="0 0 100% 100%"
    >
      <Defs>
        <LinearGradient id="grad" gradientTransform="rotate(45)">
          <Stop offset="0" stopColor="#df6a7d" stopOpacity={1} />
          <Stop offset="33.3%" stopColor="#c941a2" stopOpacity={1} />
          <Stop offset="66.6%" stopColor="#fe3761" stopOpacity={1} />
          <Stop offset="100%" stopColor="#781d2c" stopOpacity={1} />
        </LinearGradient>
      </Defs>

      <Rect
        rx="20px"
        x="0"
        y="0"
        width="100%"
        height="100%"
        fill="url(#grad)"
      />
    </Svg>
  );
}

function Badges() {
  return <View />;
}

function Actions() {
  return <View />;
}

function Activity() {
  return <View />;
}

function Timeline() {
  return <Text>Timeline</Text>;
}

export default function Home() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);

  const insets = useSafeAreaInsets();

  return (
    <TabView
      style={{
        paddingTop: insets.top,
      }}
      renderTabBar={(props) => (
        <TabViewWrapper>
          <TabBar
            {...props}
            style={{
              height: 52,
              backgroundColor: "#00000000",
            }}
            renderIndicator={(props) => (
              <TabBarIndicator
                {...props}
                width={100}
                style={StyleSheet.compose(props.style, {
                  backgroundColor: Colors.dark.accent,
                })}
              />
            )}
          />
        </TabViewWrapper>
      )}
      navigationState={{ index, routes }}
      renderScene={renderScene}
      onIndexChange={setIndex}
      initialLayout={{ width: layout.width }}
    />
  );
}

function TabViewWrapper({ children }: PropsWithChildren) {
  return (
    <View style={{ height: 52 }}>
      <Svg
        viewBox="0 0 10 10"
        style={{
          zIndex: -1,
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Defs>
          <RadialGradient id="grad">
            <Stop offset="0" stopColor={Colors.dark.accent} stopOpacity={1} />
            <Stop offset="1" stopColor={Colors.dark.accent} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Ellipse cx="5" cy="40" rx="40" ry="40" fill="url(#grad)" />
      </Svg>
      {children}
    </View>
  );
}
