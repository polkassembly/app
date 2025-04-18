import React from "react";
import { BaseToast, ErrorToast } from "react-native-toast-message";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Colors } from "@/lib/constants/Colors";

export function useToastConfig() {
  // Get colors based on current theme.
  const containerColor = useThemeColor({}, "container");
  const textColor = useThemeColor({}, "text");
  const accentColor = useThemeColor(
    { light: Colors.light.ctaStroke, dark: Colors.dark.ctaStroke },
    "ctaStroke"
  );

  return {
    success: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: accentColor, backgroundColor: containerColor }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          color: textColor,
          fontSize: 16,
          fontWeight: "bold",
        }}
        text2Style={{
          color: textColor,
          fontSize: 14,
        }}
      />
    ),
    error: (props: any) => (
      <ErrorToast
        {...props}
        style={{ borderLeftColor: "red", backgroundColor: containerColor }}
        text1Style={{
          color: textColor,
          fontSize: 16,
          fontWeight: "bold",
        }}
        text2Style={{
          color: textColor,
          fontSize: 14,
        }}
      />
    ),
    info: (props: any) => (
      <BaseToast
        {...props}
        style={{ borderLeftColor: "#00b8d4", backgroundColor: containerColor }}
        contentContainerStyle={{ paddingHorizontal: 15 }}
        text1Style={{
          color: textColor,
          fontSize: 16,
          fontWeight: "bold",
        }}
        text2Style={{
          color: textColor,
          fontSize: 14,
        }}
      />
    ),
  };
}
