import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";
import { Colors } from "@/constants/Colors";

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
    lineHeight: 24,
  },
  bodyMedium1:{
    fontSize: 16,
    fontWeight: 600,
    lineHeight: 19
  },
  bodyMedium2: {
    fontSize: 14,
    fontWeight: 500,
    lineHeight: 21,

  },
  bodyMedium3: {
    fontSize: 14,
    fontWeight: 400,
    lineHeight: 18,
  },
  bodySmall:{
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 18
  },
  bodySmall3: {
    fontSize: 10, 
    fontWeight: 500,
    lineHeight: 15,
  },
  bodySmall1: {
    fontSize: 12,
    fontWeight: 500,
    lineHeight: 20,
  },

  /**
   * This font style is *not* documented in Figma as on of the
   * typography style but still uses it in the intro screens.
   */
  display: {
    fontSize: 28,
    fontWeight: 600,
    lineHeight: 42,
  },

  titleLarge: {
    fontSize: 24,
    fontWeight: 500,
    lineHeight: 36,
  },
  titleMedium: {
    fontSize: 20,
    fontWeight: 600,
    lineHeight: 30,
  },

  /**
   * Not part of the design spec. Marked for removal.
   */
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },

  /**
   * This font style is *not* documented in Figma as on of the
   * typography style but still uses it in the intro screens.
   */
  buttonLarge: {
    lineHeight: 24,
    fontSize: 16,
    fontWeight: 600,
  },

  button1: {
    lineHeight: 21,
    fontSize: 14,
    fontWeight: 500,
    textTransform: "capitalize",
  },
  button2: {
    lineHeight: 21,
    fontSize: 14,
    fontWeight: 500,
  },
});
