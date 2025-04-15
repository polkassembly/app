import { useGetUserByAddress } from "@/lib/net/queries/profile";
import ProfileCard from "../../profile/ProfileCard";
import { useBottomSheet } from "@/lib/context/bottomSheetContext";
import { Text } from "react-native";
import { memo, useCallback, useEffect, useState } from "react";
import { openBrowserAsync } from "expo-web-browser";
import { router } from "expo-router";
import { EProposalType } from "@/lib/types";
import queryClient from "@/lib/net/queryClient";
import { buildProposalByIndexQueryKey, getProposalByIndex } from "@/lib/net/queries/post";

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
  const isPolkassemblyReferendum = /polkassembly\.io\/referenda\/\d+/.test(target);
  
  // State to track if navigation or action is in progress
  const [isNavigating, setIsNavigating] = useState(false);

  // Prefetch proposal data if it's a referendum
  useEffect(() => {
    if (isPolkassemblyReferendum) {
      const proposalIndex = target.split("/").pop();
      if (proposalIndex) {
        queryClient.prefetchQuery({
          queryKey: buildProposalByIndexQueryKey({
            proposalType: EProposalType.REFERENDUM_V2,
            indexOrHash: proposalIndex,
          }),
          queryFn: () => getProposalByIndex({
            proposalType: EProposalType.REFERENDUM_V2,
            indexOrHash: proposalIndex,
          }),
        });
      }
    }
  }, [isPolkassemblyReferendum, target]);

  // Handle mention press to show ProfileCard
  const handleMentionPress = useCallback(() => {
    if (!isLoading && user && !isNavigating) {
      setIsNavigating(true);
      openBottomSheet(<ProfileCard user={user} />);
      setIsNavigating(false);
    }
  }, [isLoading, user, isNavigating, openBottomSheet]);

  // Handle link press: navigate to referendum or open the link
  const handleLinkPress = useCallback(() => {
    if (!isNavigating) {
      setIsNavigating(true);
      if (isPolkassemblyReferendum) {
        const referendumId = target.split('/').pop();
        if (referendumId) {
          router.push(`/proposal/${referendumId}?proposalType=${EProposalType.REFERENDUM_V2}`);
        }
      } else {
        openBrowserAsync(target);
      }
      setIsNavigating(false);
    }
  }, [isNavigating, isPolkassemblyReferendum, target]);

  return (
    <Text
      style={isMention ? { paddingVertical: 0 } : styles}
      onPress={isMention ? handleMentionPress : handleLinkPress}
    >
      {children}
    </Text>
  );
});

export default MarkdownLink;
