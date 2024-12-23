import { IconPoints } from "@/components/icons/icon-points";
import { IconQR } from "@/components/icons/icon-qr";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
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
import { Actions, Activity, Badges, PointsView, ProfileHeader } from "@/components/Profile";

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

  scrollView: {
    paddingHorizontal: 16,
    marginTop: 16,
    rowGap: 20,
  }
});

function Profile() {
  return (
    <ThemedView type="background" style={styles.container}>
      <ScrollView style={styles.scrollView} contentContainerStyle={{gap: 20}}>
        <ProfileHeader />

        <PointsView />

        <Badges />

        <Actions />

        <Activity />
      </ScrollView>
    </ThemedView>
  );
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
                  backgroundColor: Colors.dark.ctaStroke,
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
            <Stop offset="0" stopColor={Colors.dark.ctaStroke} stopOpacity={1} />
            <Stop offset="1" stopColor={Colors.dark.ctaStroke} stopOpacity={0} />
          </RadialGradient>
        </Defs>

        <Ellipse cx="5" cy="40" rx="40" ry="40" fill="url(#grad)" />
      </Svg>
      {children}
    </View>
  );
}
