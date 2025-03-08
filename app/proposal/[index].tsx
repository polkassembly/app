import BottomButton from "@/lib/components/shared/BottomButton";
import { TopBar } from "@/lib/components/Topbar";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  View,
} from "react-native";
import { ProposalDetails } from "@/lib/components/proposal";
import { PostFullDetails } from "@/lib/components/feed";
import { BottomSheet } from "@/lib/components/shared";
import { useProposalStore } from "@/lib/store/proposalStore";
import { EProposalType } from "@/lib/types";
import { useSafeAreaInsets } from "react-native-safe-area-context";

const getTotalLength = (arr: any[]) =>
  arr.reduce((sum, item) => {
    const childrenLength = Array.isArray(item.children) ? getTotalLength(item.children) : 0;
    return sum + 1 + childrenLength;
  }, 0);


export default function ProposalDetailScreenImpl() {
  const [open, setOpen] = useState(false);
  const { index, proposalType } = useLocalSearchParams<{ index: string, proposalType: EProposalType }>();
  const proposal = useProposalStore(state => state.proposal);
  const insets = useSafeAreaInsets();

  const backgroundColor = useThemeColor({}, "container");
  const accentColor = useThemeColor({}, "accent");

  if (!proposal) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator color={accentColor} size="large" />
      </View>
    );
  }

  return (
    <View style={{ flex: 1, backgroundColor }}>
      {/* FIXME: SafeAreaView doesn't works when placed with absolute elements in a view, hence use insets */}
      <View style={{ flex: 1, paddingHorizontal: 16, marginTop: insets.top }}>
        <TopBar />
        <ProposalDetails post={proposal} openFullDetails={() => setOpen(true)} />
      </View >

      {/* Bottom button outside of SafeAreaView */}
      < View style={{
        position: "absolute",
        bottom: 0,
        left: 0,
        right: 0,
        paddingBottom: insets.bottom // Use insets to respect safe area
      }
      }>
        <Link asChild href={`/proposal/vote/${index}?proposalType=${proposalType}`}>
          <BottomButton>Cast Your Vote</BottomButton>
        </Link>
      </View >

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <PostFullDetails onClose={() => setOpen(false)} post={proposal} />
      </BottomSheet>
    </View >
  );
}