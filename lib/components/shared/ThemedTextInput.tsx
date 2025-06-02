import { styles as textStyles, ThemedText } from "@/lib/components/shared/text/ThemedText";
import { Colors } from "@/lib/constants/Colors";
import { StyleSheet, TextInput, TextInputProps, View } from "react-native";

export interface ThemedTextInput extends TextInputProps {
  errorText?: string;
  label?: string;
  password?: boolean;
  required?: boolean
}

export default function ThemedTextInput({
  errorText,
  label,
  password,
  required = false,
  ...props
}: ThemedTextInput) {
  return (
    <View style={styles.wrapper}>
      {label && (
        <View style={{ flexDirection: "row", gap: 2 }}>
          <ThemedText colorName="mediumText" type="bodySmall1">
            {label}
          </ThemedText>
          { required && <ThemedText colorName="error" type="bodySmall1">*</ThemedText>}
        </View>
      )}

      <View style={styles.container}>
        <TextInput
          textContentType={password ? "password" : props.textContentType}
          secureTextEntry={password ?? props.secureTextEntry}
          {...props}
          style={[styles.input, textStyles.bodySmall1]}
        />
      </View>
      {errorText ? (
        <ThemedText type="bodySmall" colorName="error" style={styles.errorText}>
          {errorText}
        </ThemedText>
      ) : null}
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
    padding: 10,
    color: Colors.dark.text,
  },
  errorText: {
    marginLeft: 4,
  },
});
