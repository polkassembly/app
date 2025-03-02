import React, { ReactNode } from "react";
import { StyleProp, ViewStyle, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { View } from "moti";
import { useThemeColor } from "../hooks/useThemeColor";
import IconBack from "./icons/icon-back";
import { IconPoints } from "./icons/icon-points";
import { ThemedText } from "./ThemedText";
import { Skeleton } from "moti/skeleton";
import { useProfileStore } from "../store/profileStore";

interface TopBarProps {
  style?: StyleProp<ViewStyle>;
  childrenLink?: string;
  children?: ReactNode;
}

export function TopBar({
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
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start", alignItems: "center" }}>
        <Link asChild href="..">
          <TouchableOpacity>
            <View style={{ paddingVertical: 10 }}>
              <IconBack color={textColor} iconWidth={30} iconHeight={30} />
            </View>
          </TouchableOpacity>
        </Link>
        {
          children
        }
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <IconPoints iconWidth={24} iconHeight={24} />
        {!userProfile ? (
          <Skeleton width={50} />
        ) : (
          <ThemedText type="titleMedium" style={{ fontWeight: 700 }}>
            {userProfile?.profileScore}
          </ThemedText>
        )}
      </View>
    </View>
  );
}
