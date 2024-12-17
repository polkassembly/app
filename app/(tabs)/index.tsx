import { Colors } from "@/constants/Colors";
import React, { PropsWithChildren, useState } from "react";
import { StyleSheet, Text, useWindowDimensions, View } from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Defs, Ellipse, RadialGradient, Stop } from "react-native-svg";
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

function Profile() {
  return <Text>Profile</Text>;
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
