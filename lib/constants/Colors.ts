import { DarkTheme, DefaultTheme } from "@react-navigation/native";

const tintColorDark = "#fff";
const tintColorLight = "#fff";
const colorAccent = "#E5007A";

export const Colors = {
  light: {
    accent: colorAccent,
    error: "#F53C3C",
    background: "#161616",
    secondaryBackground: "#000000",
    container: "#000000",
    secondaryContainer: "#1D1D1D",
    stroke: "#383838",
    ctaStroke: "#E5007A",
    text: "#FFFFFF",
    mediumText: "#79767D",
    secondaryText: "#1D1D1D",
    ctaText: "#E5007A",
    activeIcon: "#FFFFFF",
    selectedIcon: "#1D1D1D",
    inactiveIcon: "#575756",
    tint: tintColorDark,

    /**
     * Not documented in the color scheme in design spec but still used
     * as backdrop background for bottom sheet.
     */
    backdrop: "#222121A6",
  },
  dark: {
    accent: colorAccent,
    error: "#F53C3C",
    background: "#161616",
    secondaryBackground: "#000000",
    container: "#000000",
    secondaryContainer: "#1D1D1D",
    stroke: "#383838",
    ctaStroke: "#E5007A",
    text: "#FFFFFF",
    mediumText: "#79767D",
    secondaryText: "#1D1D1D",
    ctaText: "#E5007A",
    activeIcon: "#FFFFFF",
    selectedIcon: "#1D1D1D",
    inactiveIcon: "#575756",
    tint: tintColorDark,

    /**
     * Not documented in the color scheme in design spec but still used
     * as backdrop background for bottom sheet.
     */
    backdrop: "#222121A6",
  },
};

export const bgColors = {
  light: {
    originBadges: {
      default: "#ECECEC",
      auction: "#ffede5",
      community: "#dff4ff",
      council: "#FFEDF2",
      technical: "#FEF7DD",
      general: "#FDF5F0",
    },
  },
  dark: {
    originBadges: {
      default: "#333333",
      auction: "#FFF4EB",
      community: "#1C2945",
      council: "#C8D9FE",
      technical: "#302921",
      general: "#380E0E",
    },
  }
}

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
