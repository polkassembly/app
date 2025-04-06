import { styles as textStyles, ThemedText } from "@/lib/components/shared/text/ThemedText";
import { Colors } from "@/lib/constants/Colors";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

export interface ThemedTextInput extends TextInputProps {
  label?: string;
  password?: boolean;
}

export default function ThemedTextInput({
  label,
  password,
  ...props
}: ThemedTextInput) {
  return (
    <View style={styles.wrapper}>
      {label && (
        <ThemedText colorName="mediumText" type="bodySmall1">
          {label}
        </ThemedText>
      )}

      <View style={styles.container}>
        <TextInput
          textContentType={password ? "password" : props.textContentType}
          secureTextEntry={password ?? props.secureTextEntry}
          {...props}
          style={[styles.input, textStyles.bodySmall1]}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  wrapper: {
    gap: 4,
  },

  container: {
    flexDirection: "row",
    gap: 8,
    alignItems: "baseline",
    backgroundColor: Colors.dark.secondaryBackground,
    paddingBlock: 13.5,
    paddingInline: 14,
    borderRadius: 10,
  },

  input: {
    flex: 1,
    padding: 0,
    color: Colors.dark.text,
  },
});
