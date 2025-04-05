import { useAuthModal } from "@/lib/context/authContext";
import { useProfileStore } from "@/lib/store/profileStore";
import { router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { IconVote } from "../icons/Profile";
import { UserAvatar } from "../shared";
import { ActionButton } from "../shared/button";
import IconBack from "../icons/icon-back";

const ProfileHeader = () => {
  const user = useProfileStore((state) => state.profile);
  const { openLoginModal } = useAuthModal();

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
        <ActionButton
          Icon={IconVote}
          containerSize={30}
          containerType="background"
          iconSize={20}
          onPress={handleCartPress}
        />
        <TouchableOpacity disabled >
          <UserAvatar avatarUrl={user?.profileDetails.image || ""} width={30} height={30} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

export default ProfileHeader;