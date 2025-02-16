import React from "react";
import { Image, ImageStyle, StyleSheet } from "react-native";

interface UserAvatarProps {
  avatarUrl: string;
  width: number;
  height: number;
  style?: ImageStyle;
}

export default function UserAvatar({ avatarUrl, width, height, style }: UserAvatarProps) {
  const defaultAvatar = require("@/assets/images/profile/default-avatar.png");

  return (
    <Image
      style={[{ width, height, borderRadius: width / 2 }, style]}
      source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
    />
  );
}
