import { Tabs } from "expo-router";
import React, { Children } from "react";
import { Pressable, StyleSheet, View, ViewStyle, Text } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import { SafeAreaView } from "react-native-safe-area-context";

import { Colors } from "@/lib/constants/Colors";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { IconBrowser } from "@/lib/components/icons/icon-browser";
import { IconProfile } from "@/lib/components/icons/icon-profile";
import { IconNews } from "@/lib/components/icons/Profile";

const smallIconSize = 32;
const largeIconSize = 44;

const styles = StyleSheet.create({
  smallIcon: {
    height: smallIconSize,
    marginTop: 36,
  },

  largeIcon: {
    marginTop: 12,
    height: largeIconSize,
    width: largeIconSize,
  },
  tabBarStyle: {
    elevation: 0,
    height: 80,
    paddingTop: 8,
    borderTopWidth: 0,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
  },
});

export default function TabLayout() {
  return (
    <SafeAreaView style={{ flex: 1 }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors["dark"].tint,
          headerShown: false,
          tabBarButton: TabBarButton,
          tabBarBackground: TabBarBackground,
          tabBarStyle: styles.tabBarStyle
        }}
      >
        <Tabs.Screen
          name="news"
          options={{
            tabBarIcon: ({ color }) => (
              <IconNews style={styles.smallIcon} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <IconProfile style={styles.largeIcon} color={color} />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ color }) => (
              <IconBrowser style={styles.smallIcon} color={color} />
            ),
          }}
        />
      </Tabs>
    </SafeAreaView>
  );
}

function TabBarButton(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      {...props}
      // disable ripple
      android_ripple={{
        radius: 0,
      }}
    />
  );
}

function TabBarBackground() {
  return (
    <Svg width={"100%"} height={"100%"} fill={"#00000000"}>
      <Ellipse
        fill={"#000000"}
        cx={"50%"}
        cy={250 / 2}
        rx={660 / 2}
        ry={250 / 2}
      />
    </Svg>
  );
}
