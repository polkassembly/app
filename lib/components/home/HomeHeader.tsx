import { useAuthModal } from "@/lib/context/authContext";
import { getUserIdFromStorage } from "@/lib/net/queries/utils";
import { useProfileStore } from "@/lib/store/profileStore";
import { router } from "expo-router";
import { View, TouchableOpacity } from "react-native";
import { IconVote } from "../icons/Profile";
import { UserAvatar } from "../shared";
import { ActionButton } from "../shared/button";
import { RadialBackgroundWrapper } from "../shared/View";
import { Image } from "react-native";

const HomeHeader = () => {
  const userId = getUserIdFromStorage();
  const user = useProfileStore((state) => state.profile);
  const { openLoginModal } = useAuthModal();

  const handleProfilePress = () => {
    if (userId) {
      //TODO: route to profile
    }else {
      openLoginModal("Login to access your profile", false);
    }
  }

  return (
    <RadialBackgroundWrapper>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', marginVertical: 20, paddingHorizontal: 16 }}>
        <Image
          source={require('@/assets/images/logo-wide.png')}
          style={{ width: 132, height: 40 }}
          resizeMode='cover'
        />
        <View style={{ flexDirection: 'row', gap: 12 }}>
          <ActionButton
            Icon={IconVote}
            containerSize={30}
            containerType="background"
            iconSize={20}
            onPress={() => router.push("/batch-vote")}
          />
          <TouchableOpacity
            onPress={handleProfilePress}
          >
            <UserAvatar avatarUrl={user?.profileDetails.image || ""} width={30} height={30} />
          </TouchableOpacity>
        </View>
      </View>
    </RadialBackgroundWrapper>
  )
}

export default HomeHeader;