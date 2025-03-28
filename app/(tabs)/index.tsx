import { Colors } from "@/lib/constants/Colors";
import React, { PropsWithChildren, useState } from "react";
import {
  StyleSheet,
  useWindowDimensions,
} from "react-native";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";
import {
  SceneMap,
  TabBar,
  TabBarIndicator,
  TabView,
} from "react-native-tab-view";
import { Profile } from "@/lib/components/Profile";
import { Feed } from "@/lib/components/feed";
import { ThemedView } from "@/lib/components/ThemedView";
import { useThemeColor } from "@/lib/hooks";
import { SafeAreaView } from "react-native-safe-area-context";

const renderScene = SceneMap({
  profile: Profile,
  feed: Feed,
});

const routes = [
  { key: "profile", title: "Profile" },
  { key: "feed", title: "Feed" },
];

export default function Home() {
  const layout = useWindowDimensions();
  const [index, setIndex] = useState(0);
  const backgroundColor = useThemeColor({}, "secondaryBackground")

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <TabView
        renderTabBar={(props) => (
          <TabViewWrapper
            key={props.navigationState.index}
          >
            <TabBar
              {...props}
              style={{
                height: 52,
                backgroundColor: "transparent",
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
    </SafeAreaView>
  );
}

function TabViewWrapper({ children }: PropsWithChildren) {
  return (
    <ThemedView type="secondaryBackground" style={{ height: 52 }}>
      <Svg
        viewBox="0 0 10 10"
        style={{
          zIndex: 0,
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
    </ThemedView>
  );
}