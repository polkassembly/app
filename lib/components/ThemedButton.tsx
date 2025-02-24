import { Colors } from "@/lib/constants/Colors";
import React from "react";
import {
  ActivityIndicator,
  StyleProp,
  StyleSheet,
  TextStyle,
  TouchableOpacity,
  View,
} from "react-native";
import { TouchableOpacityProps } from "react-native-gesture-handler";
import { ThemedText, ThemedTextProps } from "./ThemedText";
import { useThemeColor } from "../hooks/useThemeColor";

type ColorName = keyof typeof Colors.dark & keyof typeof Colors.light;

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.accent,
    padding: 16,
    borderRadius: 16,
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },

  bordered: {
    backgroundColor: "#00000000",
    borderColor: Colors.dark.accent,
    borderWidth: 1,
  },

  borderless: {
    backgroundColor: "#00000000",
  },
});

export interface ThemedButtonProps extends TouchableOpacityProps {
  text?: string;
  textType?: ThemedTextProps["type"];
  textStyle?: StyleProp<TextStyle>;
  bordered?: boolean;
  borderless?: boolean;
  loading?: boolean;
  buttonBgLightColor?: string;
  buttonBgDarkColor?: string;
  buttonBgColor?: ColorName;
}

const ThemedButton = React.forwardRef<View, ThemedButtonProps>(
  (
    {
      textType = "button2",
      text,
      bordered = false,
      borderless = false,
      loading = false,
      textStyle,
      buttonBgDarkColor,
      buttonBgLightColor,
      buttonBgColor,
      ...props
    },
    ref
  ) => {

    const color = useThemeColor(
      { light: buttonBgLightColor, dark: buttonBgDarkColor },
      buttonBgColor ?? "accent"
    );
    
    return (
      <TouchableOpacity
        {...props}
        ref={ref}
        style={[
          styles.button,
          { backgroundColor: color },
          bordered && styles.bordered,
          borderless && styles.borderless,
          props.style,
        ]}
      >
        {loading && (
          <ActivityIndicator
            color={bordered || borderless ? Colors.dark.accent : Colors.dark.text}
          />
        )}

        {!loading && props.children}

        {!loading && text ? (
          <ThemedText
            type={textType}
            darkColor={bordered || borderless ? Colors.dark.accent : undefined}
            lightColor={bordered || borderless ? Colors.light.accent : undefined}
            style={textStyle}
          >
            {text}
          </ThemedText>
        ) : null}
      </TouchableOpacity>
    );
  }
);

export default ThemedButton;
