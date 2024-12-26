import { Colors } from "@/constants/Colors";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { TouchableOpacityProps } from "react-native-gesture-handler";
import { ThemedText, ThemedTextProps } from "./ThemedText";

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

interface ThemedButtonProps extends TouchableOpacityProps {
  text?: string;
  textType?: ThemedTextProps["type"];
  bordered?: boolean;
  borderless?: boolean;
}

const ThemedButton = React.forwardRef<View, ThemedButtonProps>(
  (
    {
      textType = "button2",
      text,
      bordered = false,
      borderless = false,
      ...props
    },
    ref
  ) => (
    <TouchableOpacity
      {...props}
      ref={ref}
      style={[
        styles.button,
        bordered && styles.bordered,
        borderless && styles.borderless,
        props.style,
      ]}
    >
      {props.children}

      {text ? (
        <ThemedText
          type={textType}
          darkColor={bordered || borderless ? Colors.dark.accent : undefined}
          lightColor={bordered || borderless ? Colors.light.accent : undefined}
        >
          {text}
        </ThemedText>
      ) : null}
    </TouchableOpacity>
  )
);

export default ThemedButton;
