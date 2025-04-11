import { useGetUserByAddress } from "@/lib/net/queries/profile";
import ProfileCard from "../../profile/ProfileCard";
import { useBottomSheet } from "@/lib/context/bottomSheetContext";
import { Text } from "react-native";
import { memo } from "react";
import { openBrowserAsync } from "expo-web-browser";

interface MarkdownLinkProps {
  content: string;
  target: string;
  children: React.ReactNode;
  styles: { [key: string]: any };
}

const MarkdownLink = memo(({ content, target, children, styles }: MarkdownLinkProps) => {
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
      <Text
        style={[{ paddingVertical: 0 }]}
        onPress={handleMentionPress}
      >
        {children}
      </Text>
    ) : (
      <Text
        style={styles}
        onPress={() => {
          openBrowserAsync(target)
        }}
      >
        {children}
      </Text>
    )
  );
});

export default MarkdownLink;