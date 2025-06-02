import React from "react";
import { Image, ImageStyle } from "react-native";
import Identicon from '@polkadot/reactnative-identicon';

interface UserAvatarProps {
  avatarUrl: string;
  address?: string;
  width: number;
  height: number;
  style?: ImageStyle;
}

export default function UserAvatar({ avatarUrl, width, height, style, address }: UserAvatarProps) {
  const defaultAvatar = require("@/assets/images/profile/default-avatar.png");

  return (
    !address?.startsWith('0x') && avatarUrl === "" ? (
      <Identicon
        value={address}
        size={width}
      />
    ) : (
      <Image
        style={[{ width, height, borderRadius: width / 2 }, style]}
        source={avatarUrl ? { uri: avatarUrl } : defaultAvatar}
      />
    )
  );
}
