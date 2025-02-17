import { Link } from "expo-router";
import { View } from "moti";
import { TouchableOpacity } from "react-native";
import { useThemeColor } from "../hooks/useThemeColor";
import IconBack from "./icons/icon-back";
import { IconPoints } from "./icons/icon-points";
import { ThemedText } from "./ThemedText";
import { KEY_ID, storage } from "../store";
import { useGetUserById } from "../net/queries/profile";
import { Skeleton } from "moti/skeleton";

export function TopBar() {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "secondaryBackground");

  const id = storage.getString(KEY_ID);

  const { data: userInfo, isLoading: isUserInfoLoading } = useGetUserById({ pathParams: { userId: id || "" } })

  return (
    <View
      style={{
        paddingInline: 8,
        backgroundColor: backgroundColor,
        flexDirection: "row",
        justifyContent: "space-between",
        marginTop: 40
      }}
    >
      <Link asChild href={".."}>
        <TouchableOpacity>
          <View style={{ padding: 8 }}>
            <IconBack color={textColor} iconWidth={24} iconHeight={24} />
          </View>
        </TouchableOpacity>
      </Link>

      <View
        style={{
          flexDirection: "row",
          gap: 16,
          paddingInline: 8,
          alignItems: "center",
        }}
      >
        <IconPoints />
        {
          isUserInfoLoading ? <Skeleton width={50} /> : <ThemedText type="titleLarge">{userInfo?.profileScore}</ThemedText>
        }
      </View>
    </View>
  );
}
