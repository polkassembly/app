/**
 * Below are the colors that are used in the app. The colors are defined in the light and dark mode.
 * There are many other ways to style your app. For example, [Nativewind](https://www.nativewind.dev/), [Tamagui](https://tamagui.dev/), [unistyles](https://reactnativeunistyles.vercel.app), etc.
 */

import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const tintColorDark = "#fff";
const tintColorLight = "#fff";

/**
 * The primary color of the app. While design spec has 'ctaStroke' and 'ctaText'
 * which are the exact same colors, those names do not match the semantics of
 * how the color is actually used. Hence this alias.
 * This occurs as background of buttons, links text color and other things with emphasis.
 */
const colorAccent = "#E5007A";

export const Colors = {
  light: {
    accent: colorAccent,
    background: "#161616",
    secondaryBackground: "#000000",
    container: "#000000",
    secondaryContainer: "#1D1D1D",
    stroke: "#383838",
    ctaStroke: "#E5007A",
    text: "#FFFFFF",
    mediumText: "#79767D",
    ctaText: "#E5007A",
    activeIcon: "#FFFFFF",
    selectedIcon: "#1D1D1D",
    inactiveIcon: "#575756",
    tint: tintColorDark,
  },
  dark: {
    accent: colorAccent,
    background: "#161616",
    secondaryBackground: "#000000",
    container: "#000000",
    secondaryContainer: "#1D1D1D",
    stroke: "#383838",
    ctaStroke: "#E5007A",
    text: "#FFFFFF",
    mediumText: "#79767D",
    ctaText: "#E5007A",
    activeIcon: "#FFFFFF",
    selectedIcon: "#1D1D1D",
    inactiveIcon: "#575756",
    tint: tintColorDark,
  },
};

export const NavigationLightTheme = {
  ...DefaultTheme,
  colors: {
    ...DefaultTheme.colors,
    background: Colors.light.background,
    primary: Colors.light.ctaStroke,
    text: Colors.light.text,
    card: Colors.light.container,
  },
};

export const NavigationDarkTheme = {
  ...DarkTheme,
  colors: {
    ...DarkTheme.colors,
    background: Colors.dark.background,
    primary: Colors.dark.ctaStroke,
    text: Colors.dark.text,
    card: Colors.dark.container,
  },
};
