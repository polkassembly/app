import React, { ReactNode } from "react";
import { StyleProp, ViewStyle, TouchableOpacity } from "react-native";
import { Link, router } from "expo-router";
import { View } from "moti";
import { useThemeColor } from "../../hooks/useThemeColor";
import IconBack from "../icons/icon-back";
import { IconPoints } from "../icons/icon-points";
import { ThemedText } from "./text/ThemedText";
import { useProfileStore } from "../../store/profileStore";
import UserAvatar from "./UserAvatar";

interface TopBarProps {
  style?: StyleProp<ViewStyle>;
  childrenLink?: string;
  children?: ReactNode;
}

export default function TopBar({
  style,
  children,
}: TopBarProps): JSX.Element {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "secondaryBackground");

  const userProfile = useProfileStore((state) => state.profile);

  return (
    <View
      style={[
        {
          backgroundColor,
          flexDirection: "row",
          alignItems: "center",
          
        },
        style,
      ]}
    >
      <View style={{ flex: 1, flexDirection: "row", alignItems: "center" }}>
        <Link asChild href="..">
          <TouchableOpacity>
            <View>
              <IconBack color={textColor} iconWidth={24} iconHeight={24} />
            </View>
          </TouchableOpacity>
        </Link>
        {
          children
        }
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        {
          userProfile?.profileScore && (
            <TouchableOpacity
              onPress={() => router.push("/profile")}
            >
              <UserAvatar avatarUrl={userProfile?.profileDetails.image} width={24} height={24} />
            </TouchableOpacity>
          )
        }
      </View>
    </View>
  );
}
