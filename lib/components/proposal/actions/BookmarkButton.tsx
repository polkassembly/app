import { IconBookmark } from "../../icons/shared";
import ThemedButton from "../../ThemedButton";
import { StyleSheet } from "react-native";
import { EProposalType } from "@/lib/types";
import { useSubscribeProposal, useUnsubscribeProposal } from "@/lib/net/queries/actions";
import { useState } from "react";

interface BookmarkButtonProps {
  proposalId: string;
  proposalType: EProposalType;
  initialSubscribed: boolean;
}

function BookmarkButton({ proposalId, proposalType, initialSubscribed }: BookmarkButtonProps) {
  const { mutate: subscribeProposal } = useSubscribeProposal();
  const { mutate: unsubscribeProposal } = useUnsubscribeProposal();
  const [subscribed, setSubscribed] = useState(initialSubscribed);
  const [isUpdatingSubscription, setIsUpdatingSubscription] = useState(false);

  const handleBookmark = () => {
    if (isUpdatingSubscription) return;
    setIsUpdatingSubscription(true);
    if (subscribed) {
      unsubscribeProposal(
        { pathParams: { postIndexOrHash: proposalId, proposalType } },
        {
          onSuccess: () => setSubscribed(false),
          onSettled: () => setIsUpdatingSubscription(false),
        }
      );
    } else {
      subscribeProposal(
        { pathParams: { postIndexOrHash: proposalId, proposalType } },
        {
          onSuccess: (data: any) => setSubscribed(true),
          onSettled: () => setIsUpdatingSubscription(false),
        }
      );
    }
  };

  return (
    <ThemedButton
      onPress={handleBookmark}
      buttonBgColor="selectedIcon"
      style={styles.iconButton}
      disabled={isUpdatingSubscription}
    >
      <IconBookmark color="white" filled={subscribed} />
    </ThemedButton>
  );
}

const styles = StyleSheet.create({
  iconButton: {
    height: 26,
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    gap: 4,
  },
});

export default BookmarkButton;
