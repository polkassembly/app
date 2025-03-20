import BottomButton from "@/lib/components/shared/BottomButton";
import { TopBar } from "@/lib/components/Topbar";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Link, router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  KeyboardAvoidingView,
  View,
  Platform,
} from "react-native";
import { ProposalDetails } from "@/lib/components/proposal";
import { PostFullDetails } from "@/lib/components/feed";
import { BottomSheet } from "@/lib/components/shared";
import { EProposalType, Post } from "@/lib/types";
import { useProposalStore } from "@/lib/store/proposalStore";
import { useProposalByIndex } from "@/lib/net/queries/post";
import { ThemedText } from "@/lib/components/ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import { ThemedView } from "@/lib/components/ThemedView";

const getTotalLength = (arr: any[]) =>
  arr.reduce((sum, item) => {
    const childrenLength = Array.isArray(item.children) ? getTotalLength(item.children) : 0;
    return sum + 1 + childrenLength;
  }, 0);

export default function ProposalDetailScreenImpl() {
  const [open, setOpen] = useState(false);
  const { index, proposalType } = useLocalSearchParams<{ index: string, proposalType: EProposalType }>();

  const { data, isLoading } = useProposalByIndex({ proposalType, indexOrHash: index });
  const storeProposal = useProposalStore(state => state.proposal);
  const insets = useSafeAreaInsets();

  let proposal: Post | undefined;

  const accentColor = useThemeColor({}, "accent");

  // If the requested proposal is already in the store, use that instead of the fetched data
  if (storeProposal?.index !== undefined && String(storeProposal?.index) === index) {
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
        <ThemedText type="titleLarge" style={{ textAlign: "center" }}>Proposal not found</ThemedText>
      </View>
    );
  }

  return (
    <ThemedView type="container" style={{ flex: 1, paddingBottom: insets.bottom, paddingTop: insets.top }}>
      <KeyboardAvoidingView
        style={{ flex: 1 }}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={insets.top}
      >
        <View style={{ flex: 1, paddingHorizontal: 16, gap: 16 }}>
          <TopBar />
          <ProposalDetails post={proposal} openFullDetails={() => setOpen(true)} />
        </View>
      </KeyboardAvoidingView>

      {/* Bottom button outside of KeyboardAvoidingView */}

      <View style={{ position: "absolute", bottom: 0, width: "100%" }}>
        <BottomButton onPress={() => router.push(`/proposal/vote/${index}?proposalType=${proposalType}`)} >Cast Your Vote</BottomButton>
      </View>
      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <PostFullDetails onClose={() => setOpen(false)} post={proposal} />
      </BottomSheet>
    </ThemedView>
  );
}