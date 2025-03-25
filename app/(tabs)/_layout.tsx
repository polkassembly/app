import { Tabs } from "expo-router";
import React from "react";
import { View, StyleSheet, Pressable } from "react-native";
import Svg, { Ellipse } from "react-native-svg";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { Colors } from "@/lib/constants/Colors";
import { BottomTabBarButtonProps } from "@react-navigation/bottom-tabs";
import { IconBrowser } from "@/lib/components/icons/icon-browser";
import { IconProfile } from "@/lib/components/icons/icon-profile";
import { IconNews } from "@/lib/components/icons/Profile";
import { useThemeColor } from "@/lib/hooks";

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
    left: 0,
    right: 0,
    zIndex: 100,
  },
});

export default function TabLayout() {
  const insets = useSafeAreaInsets();
  const backgroundColor = useThemeColor({}, "secondaryBackground");

  return (
    // Wrap the Tabs with a View that adds bottom padding based on the safe area
    <View style={{ flex: 1 }}>
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
      {/* This view sets the background color of the bottom safe area to match the color of bottom navigation */}
      {
        insets.bottom > 0 && <View style={{ height: insets.bottom, width: "100%", backgroundColor: backgroundColor }} />
      }
    </View>
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
