import { Colors } from "@/constants/Colors";
import { StyleSheet, TouchableOpacity } from "react-native";
import { TouchableOpacityProps } from "react-native-gesture-handler";
import { ThemedText } from "./ThemedText";

const styles = StyleSheet.create({
  button: {
    backgroundColor: Colors.dark.accent,
    padding: 16,
    borderRadius: 16,
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  },
});

export default function ThemedButton({
  text,
  ...props
}: TouchableOpacityProps & { text?: string }) {
  return (
    <TouchableOpacity {...props} style={[props.style, styles.button]}>
      {props.children}

      {text ? <ThemedText type="button">{text}</ThemedText> : null}
    </TouchableOpacity>
  );
}
