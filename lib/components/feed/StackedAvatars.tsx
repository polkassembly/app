import React from "react";
import { View, StyleSheet, ViewStyle } from "react-native";
import { UserAvatar } from "../shared";

interface UserData {
  avatarUrl: string | null;
  address: string;
}

interface StackedAvatarsProps {
  users: UserData[];
  size?: number;
  offset?: number;
  containerStyle?: ViewStyle;
}

export default function StackedAvatars({
  users,
  size = 17,
  offset = 4,
  containerStyle,
}: StackedAvatarsProps) {
  const hasUsers = users.length > 0;
  const totalAvatars = hasUsers ? users.length + 1 : 1;
  const containerWidth = size + offset * (totalAvatars - 1);

  return (
    <View style={[styles.container, { width: containerWidth, height: size }, containerStyle]}>
      {hasUsers &&
        users.slice(0, 4).map((userData, index) => (
          <View
            key={`avatar-${userData.address}-${index}`}
            style={[
              styles.avatarWrapper,
              { left: index * offset, zIndex: index },
            ]}
          >
            <UserAvatar
              avatarUrl={userData.avatarUrl || ""}
              address={userData.address}
              width={size}
              height={size}
            />
          </View>
        ))
      }
      {
        !hasUsers &&
        <UserAvatar
          avatarUrl=""
          address=""
          width={size}
          height={size}
        />
      }

      {/* Always render the black avatar on top */}
      <View
        style={[
          styles.avatarWrapper,
          { left: (hasUsers ? users.length : 1) * offset, zIndex: totalAvatars + 1 },
        ]}
      >
        <View style={{ width: size, height: size, borderRadius: size, backgroundColor: "#000000" }} />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    position: "relative",
  },
  avatarWrapper: {
    position: "absolute",
  },
});