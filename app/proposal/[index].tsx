import IconArrowRightEnclosed from "@/lib/components/icons/icon-arrow-right-enclosed";
import BottomButton from "@/lib/components/shared/BottomButton";
import HorizontalSeparator from "@/lib/components/shared/HorizontalSeparator";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { TopBar } from "@/lib/components/Topbar";
import { Colors } from "@/lib/constants/Colors";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Link, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Rect } from "react-native-svg";
import { BottomSheet } from "@/lib/components/shared";
import { EProposalType } from "@/lib/types";
import { useProposalComments } from "@/lib/net/queries/post/useProposalComment";
import { CommentList, PostFullDetails } from "@/lib/components/feed";
import { ENetwork, IVoteMetrics, Post } from "@/lib/types/post";
import { formatBnBalance } from "@/lib/util";
import BN from "bn.js";
import { calculatePercentage } from "@/lib/util/calculatePercentage";
import { ProposalCard } from "@/lib/components/proposal/ProposalCard";
import { useProposalStore } from "@/lib/store/proposalStore";
import StatusTag from "@/lib/components/feed/StatusTag";
import { useProposalByIndex } from "@/lib/net/queries/post";

const getTotalLength = (arr: any[]) =>
  arr.reduce((sum, item) => {
    const childrenLength = Array.isArray(item.children) ? getTotalLength(item.children) : 0;
    return sum + 1 + childrenLength;
  }, 0);


export default function ProposalDetailScreenImpl() {
  const [open, setOpen] = useState(false);
  const { index, proposalType } = useLocalSearchParams<{ index: string, proposalType: EProposalType }>();

  const { data, isLoading} = useProposalByIndex({ proposalType, indexOrHash: index });
  const storeProposal = useProposalStore(state => state.proposal);
  let proposal: Post | undefined;
  
  const backgroundColor = useThemeColor({}, "container");
  const accentColor = useThemeColor({}, "accent");

  // If the proposal is already in the store, use that instead of the fetched data
  if (storeProposal?.index !== undefined && storeProposal?.index === index) {
    proposal = storeProposal;
  }else {
    proposal = data;
  }

  // Fetch comments for the proposal
  const { data: comments, isLoading: commentsLoading } = useProposalComments({ proposalType: proposalType, proposalId: index });

  if (isLoading && proposal === undefined) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator color={accentColor} size="large" />
      </View>
    );
  }

  if (!proposal) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ThemedText type="titleLarge" style={{ textAlign: "center"}}>Proposal not found</ThemedText>
      </View>
    );
  }

  const ayeValue = new BN(proposal.onChainInfo?.voteMetrics?.aye.value || '0');
  const nayValue = new BN(proposal.onChainInfo?.voteMetrics?.nay.value || '0');
  const totalValue = ayeValue.add(nayValue);
  const ayePercent = calculatePercentage(proposal.onChainInfo?.voteMetrics?.aye.value || '0', totalValue);
  const nayPercent = calculatePercentage(proposal.onChainInfo?.voteMetrics?.nay.value || '0', totalValue);

  return (
    <View style={{ flex: 1, backgroundColor }}>
      <SafeAreaView style={{ flex: 1, paddingHorizontal: 16 }}>
        <TopBar />
        <ScrollView>
          <View style={{ paddingBottom: 16, gap: 8, marginTop: 20 }}>
            <ThemedText type="titleMedium" style={{ fontWeight: 500, marginBottom: 20 }}>Proposal #{index}</ThemedText>

            <ProposalCard
              post={proposal}
              withoutViewMore
              containerType="background"
              withoutIndex
            />

            <Summary
              status={proposal?.onChainInfo?.status}
              voteMetrics={proposal.onChainInfo?.voteMetrics}
              ayePercent={ayePercent}
              nayPercent={nayPercent}
            />

            <SeeDetails setOpen={() => {
              setOpen(true);
            }} />

            {/* Comments Section */}
            <ThemedView type="background" style={[
              styles.box,
              {
                alignContent: "stretch",
                gap: 16,
                marginBottom: 50
              },
            ]}>
              <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
                <ThemedText type="bodyLarge">Replies </ThemedText>
                {comments && (
                  <View style={{ backgroundColor: "#E5E5FD", paddingHorizontal: 4, borderRadius: 4 }}>
                    <ThemedText type="bodySmall1" style={{ color: "#79767D", lineHeight: 18 }}>{getTotalLength(comments)}</ThemedText>
                  </View>
                )
                }
              </View>
              {commentsLoading ? (
                <ThemedText type="bodyMedium1">
                  Loading comments...
                </ThemedText>
              ) : (
                <CommentList comments={comments || []} />
              )}
            </ThemedView>
          </View>
        </ScrollView>

      </SafeAreaView>
      <View style={{ position: "absolute", bottom: -10, left: 0, right: 0 }}>
        <Link asChild href={`/proposal/vote/${index}?proposalType=${proposalType}`}>
          <BottomButton>Cast Your Vote</BottomButton>
        </Link>
      </View>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <PostFullDetails onClose={() => setOpen(false)} post={proposal} />
      </BottomSheet>
    </View>
  );
}

interface SummaryProps {
  status: string | undefined;
  voteMetrics: IVoteMetrics | undefined;
  ayePercent: number;
  nayPercent: number;
}

function Summary({ ayePercent, status, voteMetrics, nayPercent }: SummaryProps) {
  const backgroundColor = useThemeColor({}, "background");

  const formatter = new Intl.NumberFormat('en-US', { notation: 'compact' });
  const formatBalance = (balance: string) => {
    return formatter.format(Number(formatBnBalance(balance, { withThousandDelimitor: false }, ENetwork.POLKADOT)));
  };

  return (
    <ThemedView
      type="background"
      style={[
        styles.box,
        {
          alignContent: "stretch",
          gap: 16,
        },
      ]}
    >
      <View
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <ThemedText type="bodyLarge">Summary</ThemedText>

        <StatusTag status={status} />
      </View>

      <View style={{ gap: 4 }}>
        <VoteRatioIndicator ayePercent={ayePercent} nayPercent={nayPercent} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText type="bodySmall1" colorName="mediumText">
            Aye: {ayePercent}%
          </ThemedText>
          <ThemedText type="bodySmall1" colorName="mediumText">
            To pass: 50%
          </ThemedText>
          <ThemedText type="bodySmall" colorName="mediumText">
            Nay: {nayPercent}%
          </ThemedText>
        </View>
      </View>

      <HorizontalSeparator />

      <View
        style={{
          padding: 16,
          gap: 16,
        }}
      >
        <View
          style={{
            marginHorizontal: 8,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <View style={{ flexDirection: "row", gap: 16 }}>
            <ThemedText>Aye</ThemedText>
            <ThemedText colorName="mediumText">{
              formatBnBalance(
                voteMetrics?.aye.value || '0',
                {
                  withUnit: true,
                  numberAfterComma: 2,
                  compactNotation: true,
                },
                ENetwork.POLKADOT,
              )
            }</ThemedText>
          </View>

          <View style={{ flexDirection: "row", gap: 16 }}>
            <ThemedText>Nay</ThemedText>
            <ThemedText colorName="mediumText">{
              formatBnBalance(
                voteMetrics?.nay.value || '0',
                {
                  withUnit: true,
                  numberAfterComma: 2,
                  compactNotation: true,
                },
                ENetwork.POLKADOT,
              )
            }
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

interface VoteRatioIndicatorProps {
  ayePercent: number;
  nayPercent: number
}

function VoteRatioIndicator({ ayePercent, nayPercent }: VoteRatioIndicatorProps) {
  const colorAye = "#31C766";
  const colorNay = "#E5304F";

  const ayePerc = ayePercent < 1 ? ayePercent * 100 : ayePercent;
  const nayPerc = nayPercent < 1 ? nayPercent * 100 : nayPercent;

  return (
    <Svg height={5}>
      <Rect
        width={`${ayePerc}%`}
        height={"100%"}
        rx={"5"}
        ry={"5"}
        fill={colorAye}
      />

      <Rect
        width={`${nayPerc}%`}
        x={`${ayePerc}%`}
        height={"100%"}
        rx={"2.5"}
        ry={"2.5"}
        fill={colorNay}
      />
    </Svg>
  );
}

interface SeeDetailsProps {
  setOpen: (open: boolean) => void;
}

function SeeDetails({ setOpen }: SeeDetailsProps) {
  const backgroundColor = useThemeColor({}, "background");

  return (
    <TouchableOpacity onPress={() => setOpen(true)}>
      <View
        style={[
          styles.box,
          {
            flexDirection: "row",
            paddingHorizontal: 16,
            paddingVertical: 16,
            backgroundColor: backgroundColor,
            alignItems: "center",
            justifyContent: "space-between",
            gap: 16,
          },
        ]}
      >
        <ThemedText type="bodyMedium1">See Full Details</ThemedText>
        <IconArrowRightEnclosed iconWidth={30} iconHeight={30} color="#FFF" />
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  box: {
    borderColor: Colors.dark.stroke,
    borderWidth: 1,
    paddingHorizontal: 12,
    paddingVertical: 12,
    borderRadius: 12,
  },
});
