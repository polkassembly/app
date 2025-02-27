import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Colors } from "@/lib/constants/Colors";

type ColorName = keyof typeof Colors.dark & keyof typeof Colors.light;

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: ColorName;
  type?: keyof typeof styles;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  colorName,
  type = "bodyLarge",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorName ?? "text"
  );

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

export const styles = StyleSheet.create({
  bodyLarge: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 24,
    fontFamily: "PoppinsMedium",
  },
  bodyMedium1: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 19,
    fontFamily: "PoppinsSemiBold",
  },
  bodyMedium2: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 21,
    fontFamily: "PoppinsMedium",

  },
  bodyMedium3: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 18,
    fontFamily: "PoppinsRegular",
  },
  bodySmall: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 18,
    fontFamily: "PoppinsRegular",
  },
  bodySmall1: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 20,
    fontFamily: "PoppinsMedium",
  },
  bodySmall3: {
    fontSize: 10,
    fontWeight: 500,
    lineHeight: 15,
    fontFamily: "PoppinsRegular",
  },


  /**
   * This font style is not documented in Figma as on of the
   * typography style but still uses repeatedly in the game screen.
   */

  bodySmall4: {
    fontSize: 8,
    fontWeight: 500,
    lineHeight: 12,
    fontFamily: "PoppinsRegular",
  },

  /**
   * This font style is *not* documented in Figma as on of the
   * typography style but still uses it in the intro screens.
   */
  display: {
    fontSize: 28,
    fontWeight: 600,
    lineHeight: 42,
    fontFamily: "PoppinsMedium",
  },

  titleLarge: {
    fontSize: 24,
    fontWeight: 500,
    lineHeight: 36,
    fontFamily: "PoppinsSemiBold",
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 30,
    fontFamily: "PoppinsSemiBold",
  },
  titleMedium1: {
    fontSize: 18,
    fontWeight: 600,
    lineHeight: 27,
    fontFamily: "PoppinsSemiBold",
  },

  /**
   * Not part of the design spec. Marked for removal.
   */
  titleSmall: {
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 27,
    fontFamily: "PoppinsRegular",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "PoppinsRegular",
  },

  /**
   * This font style is *not* documented in Figma as on of the
   * typography style but still uses it in the intro screens.
   */
  buttonLarge: {
    lineHeight: 24,
    fontSize: 16,
    fontWeight: 600,
    fontFamily: "PoppinsSemiBold",
  },

  button1: {
    lineHeight: 21,
    fontSize: 14,
    fontWeight: 500,
    textTransform: "capitalize",
    fontFamily: "PoppinsMedium",
  },
  button2: {
    lineHeight: 21,
    fontSize: 14,
    fontWeight: 500,
    fontFamily: "PoppinsMedium",
  },
});
