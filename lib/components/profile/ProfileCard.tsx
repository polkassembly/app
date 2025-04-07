import React from "react";
import {
  View,
  StyleSheet,
  Image,
  TouchableOpacity,
} from "react-native";
import { MaterialCommunityIcons, Feather } from "@expo/vector-icons";
import { UserProfile } from "@/lib/types";
import { ThemedText } from "../shared/text";
import { formatTime } from "../util/time";
import { ThemedButton } from "../shared/button";
import { ThemedView } from "../shared/View";
import { UserAvatar } from "../shared";
import { formatAddress } from "@/lib/util/stringUtil";
import { useThemeColor } from "@/lib/hooks";
import { IconPoints } from "../icons/icon-points";
import { openBrowserAsync } from "expo-web-browser";
import { POLKASSEMBLY_WEB_URL } from "@/lib/constants/web";
import * as Clipboard from "expo-clipboard";
import Toast from "react-native-toast-message";

export default function ProfileCard({ user }: { user: UserProfile }) {
  const colorMediumText = useThemeColor({}, "mediumText");
  const coverImage = user.profileDetails.coverImage
    ? { uri: user.profileDetails.coverImage }
    : require("@/assets/images/profile/cover-image1.webp");

  const handleCopy = async (text: string, label: string) => {
    await Clipboard.setStringAsync(text);
    Toast.show({
      type: "success",
      text1: `${label} copied to clipboard`,
    })
  };

  return (
    <ThemedView type="secondaryBackground" style={styles.card}>
      {/* Top Background */}
      <View style={styles.headerBg}>
        <Image source={coverImage} style={styles.headerBg} resizeMode="cover" />
      </View>

      {/* Profile Avatar */}
      <View style={styles.avatarWrapper}>
        <UserAvatar
          avatarUrl={user.profileDetails.image}
          width={60}
          height={60}
        />
      </View>

      {/* Name and Address */}
      <TouchableOpacity
        onPress={() => handleCopy(user.addresses[0], "Address")}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8, marginTop: 16 }}>
          <ThemedText type="titleMedium">{user.username}</ThemedText>
          <View style={[styles.flexRowAlignCenter, { gap: 4 }]}>
            <ThemedText type="titleMedium1" colorName="mediumText">{formatAddress(user.addresses[0])}</ThemedText>
            <Feather name="copy" size={12} color={colorMediumText} />
          </View>
        </View>
      </TouchableOpacity>

      {/* Tags */}
      <View style={styles.tagsRow}>
        <View style={[styles.tag, { backgroundColor: "#6366f1" }]}>
          <ThemedText type="bodySmall">Rank #{user.rank}</ThemedText>
        </View>
        <View style={[styles.tag, { backgroundColor: "#FCC636" }]}>
          <IconPoints iconWidth={16} iconHeight={16} color="grey" />
          <ThemedText type="bodySmall" colorName="mediumText">
            {user.profileScore}
          </ThemedText>
        </View>
      </View>

      {/* Date Row */}
      <View style={styles.dateRow}>
        <ThemedText type="bodySmall">User Since: </ThemedText>
        <MaterialCommunityIcons name="calendar" size={16} color="#ff6b6b" />
        <ThemedText type="bodySmall" colorName="mediumText">
          {formatTime(new Date(user.createdAt))}
        </ThemedText>
      </View>

      {/* Button */}
      <ThemedButton
        text="View Full Profile"
        bordered
        style={{ paddingVertical: 4, marginVertical: 8 }}
        onPress={() =>
          openBrowserAsync(POLKASSEMBLY_WEB_URL + "/user/" + user.username)
        }
      />
    </ThemedView>
  );
}

const styles = StyleSheet.create({
  card: {
    borderTopEndRadius: 16,
    borderTopStartRadius: 16,
    alignItems: "center",
    overflow: "hidden",
    gap: 4,
  },
  headerBg: {
    width: "100%",
    height: 60,
    marginBottom: 30,
  },
  avatarWrapper: {
    backgroundColor: "#fff",
    borderRadius: 50,
    padding: 4,
    position: "absolute",
    top: 30,
    zIndex: 10,
  },
  flexRowAlignCenter: {
    flexDirection: "row",
    alignItems: "center",
  },
  tagsRow: {
    gap: 8,
    flexDirection: "row",
    alignItems: "center",
    marginTop: 8,
  },
  tag: {
    flexDirection: "row",
    alignItems: "center",
    gap: 4,
    paddingVertical: 4,
    paddingHorizontal: 10,
    borderRadius: 12,
  },
  dateRow: {
    flexDirection: "row",
    alignItems: "center",
    gap: 6,
  },
});
