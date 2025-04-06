import { View } from "moti";
import { StyleSheet, ViewStyle } from "react-native";

export default function VerticalSeprator({ style }: { style?: ViewStyle }) {
  return <View style={[styles.root, style]} />;
}

const styles = StyleSheet.create({
  root: {
    width: 1,
		flex: 1,
    backgroundColor: "#383838",
  },
});
