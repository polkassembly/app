import React, { ReactNode } from "react";
import { StyleProp, ViewStyle, TouchableOpacity } from "react-native";
import { Link } from "expo-router";
import { View } from "moti";
import { useThemeColor } from "../hooks/useThemeColor";
import IconBack from "./icons/icon-back";
import { IconPoints } from "./icons/icon-points";
import { ThemedText } from "./ThemedText";
import { KEY_ID, storage } from "../store";
import { useGetUserById } from "../net/queries/profile";
import { Skeleton } from "moti/skeleton";

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

  const id = storage.getString(KEY_ID);
  const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserById(id || "");

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
        {isUserInfoLoading ? (
          <Skeleton width={50} />
        ) : (
          <ThemedText type="titleMedium" style={{ fontWeight: 700 }}>
            {userInfo?.profileScore}
          </ThemedText>
        )}
      </View>
    </View>
  );
}
