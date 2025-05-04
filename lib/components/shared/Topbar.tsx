import React, { memo, ReactNode } from "react";
import { StyleProp, ViewStyle, TouchableOpacity, StyleSheet } from "react-native";
import { router } from "expo-router";
import { View } from "moti";
import { useThemeColor } from "../../hooks/useThemeColor";
import IconBack from "../icons/icon-back";
import { useProfileStore } from "../../store/profileStore";
import UserAvatar from "./UserAvatar";
import IconProfile from "../icons/icon-profile";
import { useAuthModal } from "@/lib/context/authContext";

interface TopBarProps {
  style?: StyleProp<ViewStyle>;
  childrenLink?: string;
  children?: ReactNode;
  handleBackPress?: () => void;
}

const TopBar = ({
  style,
  children,
  handleBackPress
}: TopBarProps): JSX.Element => {
  const [isNavigating, setIsNavigating] = React.useState(false);

  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "secondaryBackground");

  const user = useProfileStore((state) => state.profile);
  const address = user?.addresses.length ? user?.addresses[0] : "";

  const { openLoginModal } = useAuthModal();

  const handleProfilePress = () => {
    if (isNavigating) return;
    setIsNavigating(true);

    if (user) {
      router.push(`/profile/${user.id}`);
    } else {
      openLoginModal("Login to access your profile", false);
    }
    setTimeout(() => {
      setIsNavigating(false);
    }, 1000);
  };

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
        <TouchableOpacity
          onPress={() => {
            if (handleBackPress) {
              handleBackPress();
            } else {
              router.back();
            }
          }}
        >
          <View>
            <IconBack color={textColor} iconWidth={24} iconHeight={24} />
          </View>
        </TouchableOpacity>
        {
          children
        }
      </View>
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <TouchableOpacity
          onPress={handleProfilePress}
          disabled={isNavigating}
        >
          {
            user ? (
              <UserAvatar
                address={address}
                avatarUrl={user?.profileDetails.image || ""}
                width={24}
                height={24} />
            ) : (
              <View style={[styles.iconContainer, { backgroundColor: backgroundColor }]}>
                <IconProfile
                  iconWidth={20}
                  iconHeight={20}
                />
              </View>
            )
          }
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default memo(TopBar);