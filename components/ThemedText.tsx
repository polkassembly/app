import { Text, type TextProps, StyleSheet } from "react-native";

import { useThemeColor } from "@/hooks/useThemeColor";

export type ThemedTextProps = TextProps & {
  lightColor?: string;
  darkColor?: string;
  type?: keyof typeof styles;
};

export function ThemedText({
  style,
  lightColor,
  darkColor,
  type = "default",
  ...rest
}: ThemedTextProps) {
  const color = useThemeColor({ light: lightColor, dark: darkColor }, "text");

  return <Text style={[{ color }, styles[type], style]} {...rest} />;
}

const styles = StyleSheet.create({
  default: {
    fontSize: 16,
    lineHeight: 24,
  },
  defaultSemiBold: {
    fontSize: 16,
    lineHeight: 24,
    fontWeight: "600",
  },
  display: {
    fontSize: 28,
    fontWeight: 600,
    lineHeight: 42,
  },
  title: {
    fontSize: 24,
    fontWeight: 500,
    lineHeight: 36,
  },
  subtitle: {
    fontSize: 20,
    lineHeight: 30,
    fontWeight: 600,
  },
  link: {
    lineHeight: 30,
    fontSize: 16,
    color: "#0a7ea4",
  },
  button: {
    lineHeight: 24,
    fontSize: 16,
    fontWeight: 600,
  },
});
