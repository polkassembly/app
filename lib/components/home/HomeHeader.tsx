import { useAuthModal } from "@/lib/context/authContext";
import { useProfileStore } from "@/lib/store/profileStore";
import { router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { IconVote } from "../icons/Profile";
import { UserAvatar } from "../shared";
import { ActionButton } from "../shared/button";
import { RadialBackgroundWrapper } from "../shared/View";
import { Image } from "react-native";
import { useGetCartItems } from "@/lib/net/queries/actions";
import { useThemeColor } from "@/lib/hooks";

const HomeHeader = () => {
  // Get user from profile store
  const user = useProfileStore((state) => state.profile);
  // Get accent color
  const accentColor = useThemeColor({}, "accent");
  // Get auth modal
  const { openLoginModal } = useAuthModal();
  // Get cart items - place this hook after the other hooks to maintain the same order
  const { data: cart } = useGetCartItems();

  const handleProfilePress = () => {
    if (user) {
      router.push(`/profile/${user.id}`);
    } else {
      openLoginModal("Login to access your profile", false);
    }
  };

  const handleCartPress = () => {
    if (user) {
      router.push("/batch-vote/voted-proposals");
    } else {
      openLoginModal("Login to access your cart", false);
    }
  };

  return (
    <RadialBackgroundWrapper>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginBottom: 20, paddingHorizontal: 16 }}>
        <Image
          source={require('@/assets/images/logo-wide.png')}
          style={{ width: 132, height: 40 }}
          resizeMode='cover'
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <View>
            <ActionButton
              Icon={IconVote}
              containerSize={30}
              containerType="background"
              iconSize={20}
              onPress={handleCartPress}
            />
            {
              cart && (
                <View
                  style={{ backgroundColor: accentColor, position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: 4}}
                />
              )
            }
          </View>
          <TouchableOpacity
            onPress={handleProfilePress}
          >
            <UserAvatar avatarUrl={user?.profileDetails?.image || ""} width={30} height={30} />
          </TouchableOpacity>
        </View>
      </View>
    </RadialBackgroundWrapper>
  );
};

export default HomeHeader;