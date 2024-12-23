import { Colors } from "@/constants/Colors";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TouchableOpacityProps } from "react-native-gesture-handler";
import { ThemedText, ThemedTextProps } from "./ThemedText";

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.accent,
    padding: 16,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },

  bordered: {
    backgroundColor: "#00000000",
    borderColor: Colors.dark.accent,
    borderWidth: 1,
  },
});

export default function ThemedButton({
  textType = "button2",
  text,
  bordered = false,
  ...props
}: TouchableOpacityProps & {
  text?: string;
  textType?: ThemedTextProps["type"];
  bordered?: boolean;
}) {
  return (
    <TouchableOpacity
      {...props}
      style={[props.style, styles.button, bordered && styles.bordered]}
    >
      {props.children}

      {text ? (
        <ThemedText
          type={textType}
          darkColor={bordered ? Colors.dark.accent : undefined}
          lightColor={bordered ? Colors.light.accent : undefined}
        >
          {text}
        </ThemedText>
      ) : null}
    </TouchableOpacity>
  );
}
