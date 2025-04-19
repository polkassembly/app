import { useAuthModal } from "@/lib/context/authContext";
import { useProfileStore } from "@/lib/store/profileStore";
import { router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { IconVote } from "../icons/Profile";
import { UserAvatar } from "../shared";
import { ActionButton } from "../shared/button";
import IconBack from "../icons/icon-back";
import { useThemeColor } from "@/lib/hooks";
import { useGetCartItems } from "@/lib/net/queries/actions";
import { useState } from "react";
import { Menu } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";
import queryClient from "@/lib/net/queryClient";

const ProfileHeader = () => {
  const user = useProfileStore((state) => state.profile);
  const { data: cart } = useGetCartItems();
  const { openLoginModal } = useAuthModal();
  const [menuVisible, setMenuVisible] = useState(false);

  // Assuming there's a logout function in the profile store
  const logout = useProfileStore((state) => state.clearProfile);

  const accentColor = useThemeColor({}, "accent");
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "background");

  const handleCartPress = () => {
    if (user) {
      router.push("/batch-vote/voted-proposals");
    } else {
      openLoginModal("Login to access your cart", false);
    }
  };

  const openMenu = () => setMenuVisible(true);
  const closeMenu = () => setMenuVisible(false);

  const handleLogout = () => {
    if (logout) {
      logout();
      queryClient.clear();
      router.replace("/");
    }
    closeMenu();
  };

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: "center", marginBottom: 20, paddingHorizontal: 16 }}>
      <TouchableOpacity onPress={() => router.back()}>
        <IconBack iconHeight={24} iconWidth={24} />
      </TouchableOpacity>
      <View style={{ flexDirection: 'row', gap: 12, justifyContent: 'center', alignItems: 'center' }}>
        <View>
          <ActionButton
            Icon={IconVote}
            containerSize={30}
            containerType="background"
            iconSize={20}
            onPress={handleCartPress}
          />
          {
            (cart?.length ?? 0) > 0 && (
              <View
                style={{ backgroundColor: accentColor, position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: 4 }}
              />
            )
          }
        </View>

        <Menu
          visible={menuVisible}
          onDismiss={closeMenu}
          anchor={
            <TouchableOpacity onPress={openMenu} style={{ justifyContent: 'center' }}>
              <Ionicons name="ellipsis-vertical" size={20} color={textColor} />
            </TouchableOpacity>
          }
          anchorPosition="bottom"
          style={{ backgroundColor: backgroundColor, borderRadius: 8, marginTop: 24, marginRight: 20 }}
          contentStyle={{ backgroundColor: backgroundColor }}
        >
          {user ? (
            <Menu.Item
              onPress={handleLogout}
              title="Logout"
              titleStyle={{ fontSize: 14, color: textColor}}
              style={{ height: 40, width: 100 }}
            />
          ) : (
            <Menu.Item
              onPress={() => {
                closeMenu();
                openLoginModal("Login to your account", false);
              }}
              title="Login"
            />
          )}
        </Menu>
      </View>
    </View>
  );
};

export default ProfileHeader;