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
  childrenLink,
}: TopBarProps): JSX.Element {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "secondaryBackground");

  const id = storage.getString(KEY_ID);
  const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserById({
    pathParams: { userId: id || "" },
  });

  return (
    <View
      style={[
        {
          paddingHorizontal: 8,
          backgroundColor,
          flexDirection: "row",
          alignItems: "center",
          marginTop: 20,
        },
        style,
      ]}
    >
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "flex-start" ,alignItems: "center", gap: 10}}>
        <Link asChild href="..">
          <TouchableOpacity>
            <View style={{ padding: 8 }}>
              <IconBack color={textColor} iconWidth={24} iconHeight={24} />
            </View>
          </TouchableOpacity>
        </Link>
        {
          children
        }
      </View>

      <IconPoints />
      {isUserInfoLoading ? (
        <Skeleton width={50} />
      ) : (
        <ThemedText type="titleLarge">
          {userInfo?.profileScore}
        </ThemedText>
      )}
    </View>
  );
}
