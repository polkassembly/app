import { useAuthModal } from "@/lib/context/authContext";
import { useProfileStore } from "@/lib/store/profileStore";
import { router } from "expo-router";
import { View, TouchableOpacity, Image, StyleSheet } from "react-native";
import { IconVote } from "../icons/Profile";
import { UserAvatar } from "../shared";
import { ActionButton } from "../shared/button";
import { RadialBackgroundWrapper } from "../shared/View";
import { useGetCartItems } from "@/lib/net/queries/actions";
import { useThemeColor } from "@/lib/hooks";
import { useState } from "react";
import IconProfile from "../icons/icon-profile";

const HomeHeader = () => {
  // Get user from profile store
  const user = useProfileStore((state) => state.profile);
  const address = user?.addresses.length ? user?.addresses[0] : "";

  const accentColor = useThemeColor({}, "accent");
  const backgroundColor = useThemeColor({}, "background");

  const [isNavigating, setIsNavigating] = useState(false);

  const { openLoginModal } = useAuthModal();
  const { data: cart } = useGetCartItems();

  const navigateOnce = async (path: string) => {
    if (isNavigating) return; // Prevent navigation if already navigating

    setIsNavigating(true);

    try {
      router.push(path as any);
    } catch (error) {
      console.error("Navigation error:", error);
    } finally {
      setTimeout(() => {
        setIsNavigating(false);
      }, 800);
    }
  };

  const handleProfilePress = () => {
    if (isNavigating) return;

    if (user) {
      navigateOnce(`/profile/${user.id}`);
    } else {
      openLoginModal("Login to access your profile", false);
    }
  };

  const handleCartPress = () => {
    if (isNavigating) return;

    if (user) {
      navigateOnce("/batch-vote/voted-proposals");
    } else {
      openLoginModal("Login to access your cart", false);
    }
  };

  return (
    <RadialBackgroundWrapper>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 16 }}>
        <Image
          source={require('@/assets/images/logo-wide.png')}
          style={{ width: 132, height: 41 }}
          resizeMode='contain'
        />
        <View style={{ flexDirection: 'row', gap: 12, alignItems: "center" }}>
          <View>
            <ActionButton
              Icon={IconVote}
              containerSize={30}
              containerType="background"
              iconSize={20}
              onPress={handleCartPress}
              disabled={isNavigating}
            />
            {
              cart && (
                <View
                  style={{ backgroundColor: accentColor, position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: 4 }}
                />
              )
            }
          </View>
          <TouchableOpacity
            onPress={handleProfilePress}
            disabled={isNavigating}
          >
            {
              user ? (
                <UserAvatar
                  address={address}
                  avatarUrl={user?.profileDetails.image || ""}
                  width={30}
                  height={30} />
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
    </RadialBackgroundWrapper>
  );
};

const styles = StyleSheet.create({
  iconContainer: {
    width: 30,
    height: 30,
    borderRadius: 15,
    justifyContent: "center",
    alignItems: "center",
  }
});

export default HomeHeader;