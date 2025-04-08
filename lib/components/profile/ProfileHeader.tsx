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

const ProfileHeader = () => {
  const user = useProfileStore((state) => state.profile);
  const { data: cart } = useGetCartItems()
  const { openLoginModal } = useAuthModal();

  const accentColor = useThemeColor({}, "accent");

  const handleCartPress = () => {
    if (user) {
      router.push("/batch-vote/voted-proposals");
    } else {
      openLoginModal("Login to access your cart", false);
    }
  }

  return (
    <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignContent: "center", marginVertical: 20, paddingHorizontal: 16 }}>
      <TouchableOpacity onPress={() => router.back()} >
        <IconBack iconHeight={24} iconWidth={24} />
      </TouchableOpacity>
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
            (cart?.length ?? 0) > 0 && (
              <View
                style={{ backgroundColor: accentColor, position: "absolute", top: 0, right: 0, width: 8, height: 8, borderRadius: 4 }}
              />
            )
          }
        </View>
        <TouchableOpacity disabled >
          <UserAvatar avatarUrl={user?.profileDetails.image || ""} width={30} height={30} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProfileHeader;