import { Text, type TextProps, StyleSheet } from "react-native";

import { ColorName, useThemeColor } from "@/lib/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  colorName?: ColorName;
  type?: keyof typeof styles;
  fontWeight?: number;
};

function poppinsFont(weight: number = 400): string {
  switch (weight) {
    case 100: return "Poppins-Thin";
    case 200: return "Poppins-ExtraLight";
    case 300: return "Poppins-Light";
    case 400: return "Poppins-Regular";
    case 500: return "Poppins-Medium";
    case 600: return "Poppins-SemiBold";
    case 700: return "Poppins-Bold";
    case 800: return "Poppins-ExtraBold";
    case 900: return "Poppins-Black";
    default: return "Poppins-Regular";
  }
}

export function ThemedText({
  style,
  lightColor,
  darkColor,
  colorName,
  type = "bodyLarge",
  fontWeight,
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor(
    { light: lightColor, dark: darkColor },
    colorName ?? "text"
  );

  const fontFamily = fontWeight ? poppinsFont(fontWeight) : styles[type].fontFamily;

  return (
    <Text
      style={[{ color, fontFamily }, styles[type], style]}
      {...rest}
    />
  );
}

export const styles = StyleSheet.create({
  bodyLarge: {
    fontSize: 16,
    lineHeight: 24,
    fontFamily: "Poppins-Medium",
  },
  bodyMedium1: {
    fontSize: 16,
    lineHeight: 19,
    fontFamily: "Poppins-SemiBold",
  },
  bodyMedium2: {
    fontSize: 14,
    lineHeight: 21,
    fontFamily: "Poppins-Medium",
  },
  bodyMedium3: {
    fontSize: 14,
    lineHeight: 18,
    fontFamily: "Poppins-Regular",
  },
  bodySmall: {
    fontSize: 12,
    lineHeight: 18,
    fontFamily: "Poppins-Regular",
  },
  bodySmall1: {
    fontSize: 12,
    lineHeight: 20,
    fontFamily: "Poppins-Medium",
  },
  bodySmall3: {
    fontSize: 10,
    lineHeight: 15,
    fontFamily: "Poppins-Regular",
  },
  bodySmall4: {
    fontSize: 8,
    lineHeight: 12,
    fontFamily: "Poppins-Regular",
  },
  display: {
    fontSize: 28,
    lineHeight: 42,
    fontFamily: "Poppins-Medium",
  },
  titleLarge: {
    fontSize: 24,
    lineHeight: 36,
    fontFamily: "Poppins-SemiBold",
  },
  titleMedium: {
    fontSize: 20,
    lineHeight: 30,
    fontFamily: "Poppins-SemiBold",
  },
  titleMedium1: {
    fontSize: 18,
    lineHeight: 27,
    fontFamily: "Poppins-SemiBold",
  },
  titleSmall: {
    fontSize: 16,
    lineHeight: 27,
    fontFamily: "Poppins-Regular",
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
    fontFamily: "Poppins-Regular",
  },
  buttonLarge: {
    lineHeight: 24,
    fontSize: 16,
    fontFamily: "Poppins-SemiBold",
  },
  button1: {
    lineHeight: 21,
    fontSize: 14,
    textTransform: "capitalize",
    fontFamily: "Poppins-Medium",
  },
  button2: {
    lineHeight: 21,
    fontSize: 14,
    fontFamily: "Poppins-Medium",
  },
});
