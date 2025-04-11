import { useGetUserByAddress } from "@/lib/net/queries/profile";
import { View, ActivityIndicator, TouchableOpacity } from "react-native";
import ProfileCard from "../../profile/ProfileCard";
import { ThemedView } from "../View";
import { ThemedText } from "../text";
import { useThemeColor } from "@/lib/hooks";
import { useBottomSheet } from "@/lib/context/bottomSheetContext";
import { Text } from "react-native";
import { memo, useEffect, useState } from "react";

interface MarkdownLinkProps {
  content: string;
  target: string;
  children: React.ReactNode;
  styles: { [key: string]: any };
  key: string;
}

const MarkdownLink = memo(({ content, target, children, styles, key }: MarkdownLinkProps) => {
  const isMention = content.startsWith("@");
  const address = target.split("-")[0];
  const { openBottomSheet } = useBottomSheet();
	const { data: user, isLoading } = useGetUserByAddress(address);

  const handleMentionPress = () => {
		if(isLoading) return;
		if (!user) return;
		
    openBottomSheet(
      <ProfileCard user={user} />
    );
  };

  return (
    isMention ? (
      <TouchableOpacity
        key={key}
        style={[{ paddingVertical: 0 }]}
        onPress={handleMentionPress}
      >
        {children}
      </TouchableOpacity>
    ) : (
      <Text
        key={key}
        style={styles}
        onPress={() => {
          console.log(`Link pressed: ${target}`);
        }}
      >
        {children}
      </Text>
    )
  );
});

export default MarkdownLink;