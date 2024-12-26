import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "@/components/ThemedText";

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  avatar: {
    width: 42,
    height: 42,
    borderRadius: 21,
    backgroundColor: "#ff6191",
  },
});

export function ProfileHeader() {
  return (
    <View style={styles.headerContainer}>
      <ThemedText type="titleLarge">GM, Zesha</ThemedText>
      <Image style={styles.avatar} />
    </View>
  );
}
