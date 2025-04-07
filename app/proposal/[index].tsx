import React, { useState } from "react";
import { router, useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Toast from "react-native-toast-message";
import dayjs from "dayjs";

import { ProposalDetails } from "@/lib/components/proposal";
import PostFullDetails from "@/lib/components/proposal/full-details";
import { CommentSheet } from "@/lib/components/proposal/comments";
import { BottomSheet, TopBar } from "@/lib/components/shared";
import { BottomButton } from "@/lib/components/shared/button";
import { ThemedText } from "@/lib/components/shared/text/ThemedText";
import { ThemedView } from "@/lib/components/shared/View/ThemedView";
import { useProposalStore } from "@/lib/store/proposalStore";
import { useProfileStore } from "@/lib/store/profileStore";
import { useAuthModal } from "@/lib/context/authContext";
import { useProposalByIndex } from "@/lib/net/queries/post";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { canVote } from "@/lib/util/vote/canVote";
import { EProposalType, Post } from "@/lib/types";

const getTotalLength = (arr: any[]) =>
  arr.reduce((sum, item) => {
    const childrenLength = Array.isArray(item.children) ? getTotalLength(item.children) : 0;
    return sum + 1 + childrenLength;
  }, 0);

export default function ProposalDetailScreenImpl() {
  const [open, setOpen] = useState(false);
  const [showCommentBox, setShowCommentBox] = useState(false);

  const { index, proposalType } = useLocalSearchParams<{
    index: string;
    proposalType: EProposalType;
  }>();

  const { data, isLoading } = useProposalByIndex({
    proposalType,
    indexOrHash: index,
  });

  const storeProposal = useProposalStore((state) => state.proposal);
  const user = useProfileStore((state) => state.profile);
  const insets = useSafeAreaInsets();
  const { openLoginModal } = useAuthModal();
  const accentColor = useThemeColor({}, "accent");

  const handleComment = () => {
    if (!user) {
      openLoginModal("Please login to comment", true);
      return;
    }
    setShowCommentBox(true);
  };

  let proposal: Post | undefined;

  // Prefer store proposal if available
  if (storeProposal?.index !== undefined && String(storeProposal.index) === index) {
    proposal = storeProposal;
  } else {
    proposal = data;
  }

  if (isLoading && proposal === undefined) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ActivityIndicator color={accentColor} size="large" />
      </View>
    );
  }

  if (!proposal) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ThemedText type="titleLarge" style={{ textAlign: "center" }}>
          Proposal not found
        </ThemedText>
      </View>
    );
  }

  const handleVote = () => {
    if (
      !canVote(
        proposal.onChainInfo?.status,
        proposal.onChainInfo?.preparePeriodEndsAt
      )
    ) {
      Toast.show({
        type: "error",
        text1: "Voting ended",
        text2: proposal.onChainInfo?.decisionPeriodEndsAt
          ? `Voting ended at ${dayjs(proposal.onChainInfo.decisionPeriodEndsAt).format("YYYY-MM-DD HH:mm")}`
          : "You cannot vote on this proposal.",
      });
      return;
    }

    router.push(`/proposal/vote/${index}?proposalType=${proposalType}`);
  };

  return (
    <ThemedView type="container" style={{ flex: 1 }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top}
      >
        <View style={{ flex: 1, paddingHorizontal: 16, gap: 16 }}>
          <TopBar />
          <ProposalDetails
            post={proposal}
            openFullDetails={() => setOpen(true)}
          />
        </View>
      </KeyboardAvoidingView>

      {/* Bottom button outside of KeyboardAvoidingView */}
      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <BottomButton onPress={handleComment}>Add a Comment</BottomButton>
      </View>

      {/* Full Proposal Details Sheet */}
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <PostFullDetails
          onClose={() => setOpen(false)}
          post={proposal}
          proposalType={proposalType}
          indexOrHash={index}
        />
      </BottomSheet>

      {/* Comment Sheet */}
      <BottomSheet open={showCommentBox} onClose={() => setShowCommentBox(false)}>
        <CommentSheet onClose={() => setShowCommentBox(false)} />
      </BottomSheet>
    </ThemedView>
  );
}
