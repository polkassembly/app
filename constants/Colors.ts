/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { DarkTheme, Theme } from "@react-navigation/native";

const tintColorDark = "#fff";

export const Colors = {
  dark: {
    accent: "#E5007A",
    text: "#ECEDEE",
    background: "#161616",
    tint: tintColorDark,
    icon: "#9BA1A6",
    tabIconDefault: "#9BA1A6",
    tabIconSelected: tintColorDark,
  },
};

export const NavigationDarkTheme: Theme = {
  ...DarkTheme,
};

NavigationDarkTheme.colors.background = Colors.dark.background;
