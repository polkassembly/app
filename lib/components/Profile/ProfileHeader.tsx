import React from "react";
import { Image, StyleSheet, View } from "react-native";
import { ThemedText } from "@/lib/components/ThemedText";
import { Skeleton } from "moti/skeleton";

const styles = StyleSheet.create({
  headerContainer: {
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginRight: 8
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

function ProfileHeader({ username, avatarUrl }: ProfileHeaderProps) {
  return (
    <View style={styles.headerContainer}>
      <ThemedText type="titleLarge">
        {username.toUpperCase()}
      </ThemedText>
      <Image style={styles.avatar} source={avatarUrl ? { uri: avatarUrl } : require(defaultAvatarUri)} />
    </View>
  );
}

const ProfileHeaderSkeleton = () => (
  <View style={styles.headerContainer}>
    <Skeleton height={24} width={120} />
    <Skeleton height={42} width={42} radius={21} />
  </View>
);

export { ProfileHeader, ProfileHeaderSkeleton }; 
