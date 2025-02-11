import { View } from "moti";
import { StyleSheet, ViewStyle } from "react-native";

export default function HorizontalSeparator({ style }: { style?: ViewStyle }) {
  return <View style={[styles.root, style]} />;
}

const styles = StyleSheet.create({
  root: {
    width: "100%",
    height: 1,
    backgroundColor: "#383838",
  },
});
