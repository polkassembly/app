import Checkbox, { CheckboxProps } from "expo-checkbox";
import { StyleSheet, View } from "react-native";
import { ThemedText } from "../ThemedText";
import { useThemeColor } from "@/hooks/useThemeColor";

export interface ThemedCheckboxProps extends CheckboxProps {
  label?: string;
}

export default function ThemedCheckbox({
  label,
  style,
  ...props
}: ThemedCheckboxProps) {
  const inactiveColor = useThemeColor({}, "mediumText");
  const activeColor = useThemeColor({}, "accent");

  return (
    <View style={[styles.container, style]}>
      <Checkbox color={props.value ? activeColor : inactiveColor} {...props} />

      {label && (
        <ThemedText type="bodySmall1" colorName="mediumText">
          {label}
        </ThemedText>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flexDirection: "row", alignItems: "center", gap: 8 },
});
