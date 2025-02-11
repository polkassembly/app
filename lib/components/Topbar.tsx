import { Link } from "expo-router";
import { View } from "moti";
import { TouchableOpacity } from "react-native-gesture-handler";
import { useThemeColor } from "../hooks/useThemeColor";
import IconBack from "./icons/icon-back";
import { IconPoints } from "./icons/icon-points";
import { ThemedText } from "./ThemedText";

export function TopBar() {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "secondaryBackground");

  // FIXME: fetch balance
  const coins = 7896;

  return (
    <View
      style={{
        paddingInline: 8,
        paddingBlock: 16,
        backgroundColor: backgroundColor,
        flexDirection: "row",
        justifyContent: "space-between",
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
        <ThemedText type="titleLarge">{coins}</ThemedText>
      </View>
    </View>
  );
}
