import { Tabs } from "expo-router";
import React from "react";
import { StyleSheet, Pressable } from "react-native";
import Svg, { Defs, Ellipse, LinearGradient, Stop } from "react-native-svg";
import { Colors } from "@/lib/constants/Colors";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import IconBrowser from "@/lib/components/icons/icon-browser";
import { IconNews } from "@/lib/components/icons/Profile";
import { IconFeed } from "@/lib/components/icons/shared";
import { ThemedView } from "@/lib/components/shared/View";

const smallIconSize = 32;
const largeIconSize = 44;

const styles = StyleSheet.create({
  smallIcon: {
    marginTop: 36,
  },
  largeIcon: {
    marginTop: 12,
  },
  tabBarStyle: {
    elevation: 0,
    height: 80,
    paddingTop: 8,
    borderTopWidth: 0,
    backgroundColor: "transparent",
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
  },
});

export default function TabLayout() {
  return (
    <ThemedView type="secondaryBackground" style={{ flex: 1, paddingTop: 16 }}>
      <Tabs
        screenOptions={{
          tabBarShowLabel: false,
          tabBarActiveTintColor: Colors["dark"].tint,
          headerShown: false,
          tabBarButton: TabBarButton,
          tabBarBackground: TabBarBackground,
          tabBarStyle: styles.tabBarStyle,
        }}
      >
        <Tabs.Screen
          name="news"
          options={{
            tabBarIcon: ({ color }) => (
              <IconNews
                style={styles.smallIcon}
                color={color}
                iconHeight={smallIconSize}
                iconWidth={smallIconSize}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="index"
          options={{
            tabBarIcon: ({ color }) => (
              <IconFeed
                style={styles.largeIcon}
                color={color}
                iconHeight={largeIconSize}
                iconWidth={largeIconSize}
              />
            ),
          }}
        />

        <Tabs.Screen
          name="explore"
          options={{
            tabBarIcon: ({ color }) => (
              <IconBrowser
                style={styles.smallIcon}
                color={color}
                iconHeight={smallIconSize}
                iconWidth={smallIconSize}
              />
            ),
          }}
        />
      </Tabs>
    </ThemedView >
  );
}

function TabBarButton(props: BottomTabBarButtonProps) {
  return (
    <Pressable
      {...props}
      android_ripple={{
        radius: 0,
      }}
    />
  );
}

function TabBarBackground() {
  return (
    <Svg width={"100%"} height={"100%"} fill={"transparent"}>
      <Defs>
        <LinearGradient id="borderGradient" x1="100%" y1="0%" x2="0%" y2="0%">
          <Stop offset="9.13%" stopColor="#000000" />
          <Stop offset="50.62%" stopColor="#666666" />
          <Stop offset="88.92%" stopColor="#000000" />
        </LinearGradient>
      </Defs>
      <Ellipse
        fill="#000000"
        stroke="url(#borderGradient)"
        strokeWidth={1}
        cx="50%"
        cy={250 / 2}
        rx={660 / 2}
        ry={250 / 2}
      />
    </Svg>
  );
}