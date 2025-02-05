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

interface ProfileHeaderProps {
  username: string;
  avatarUrl: string;
}

const defaultAvatarUri = "@/assets/images/profile/default-avatar.png";

export function ProfileHeader({ username, avatarUrl }: ProfileHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <ThemedText type="titleLarge">
        {username.toUpperCase()}
      </ThemedText>
      <Image style={styles.avatar} source={avatarUrl ? { uri: avatarUrl } : require(defaultAvatarUri)} />
    </View>
  );
}
