import React, { useState } from "react";
import { useLocalSearchParams } from "expo-router";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  View,
  Platform,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";

import { ProposalDetails } from "@/lib/components/proposal";
import PostFullDetails from "@/lib/components/proposal/full-details";
import { BottomSheet, TopBar } from "@/lib/components/shared";
import { BottomButton } from "@/lib/components/shared/button";
import { ThemedText } from "@/lib/components/shared/text/ThemedText";
import { ThemedView } from "@/lib/components/shared/View/ThemedView";
import { useProposalStore } from "@/lib/store/proposalStore";
import { useProfileStore } from "@/lib/store/profileStore";
import { useAuthModal } from "@/lib/context/authContext";
import { useProposalByIndex } from "@/lib/net/queries/post";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { EProposalType, Post, UserProfile } from "@/lib/types";
import { useCommentSheet } from "@/lib/context/commentContext";
import { useGetUserByAddress } from "@/lib/net/queries/profile";

const getTotalLength = (arr: any[]) =>
  arr.reduce((sum, item) => {
    const childrenLength = Array.isArray(item.children) ? getTotalLength(item.children) : 0;
    return sum + 1 + childrenLength;
  }, 0);

export default function ProposalDetailScreenImpl() {
  const [open, setOpen] = useState(false);
  const { openCommentSheet } = useCommentSheet();

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

  let proposal: Post | undefined;

  // Prefer store proposal if available
  if (storeProposal?.index !== undefined && String(storeProposal.index) === index) {
    proposal = storeProposal;
  } else {
    proposal = data;
  }
  // Fetch author data
  const { data: author } = useGetUserByAddress(proposal?.onChainInfo?.proposer || "")
  const handleComment = () => {
    if (!user) {
      openLoginModal("Please login to comment", false);
      return;
    }
    openCommentSheet({
      author: author as UserProfile,
      isReply: false,
      proposalTitle: proposal?.title,
      proposalType: proposalType,
      proposalIndex: index,
      createdAt: proposal?.createdAt,
      postOrigin: proposal?.onChainInfo?.origin,
    })
  };

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
    </ThemedView>
  );
}
