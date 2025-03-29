import React, { useState } from "react";
import {
  ActivityIndicator,
  ScrollView,
  StyleSheet,
  TouchableOpacity,
  View,
} from "react-native";
import { useSafeAreaInsets } from "react-native-safe-area-context";
import Svg, { Rect } from "react-native-svg";

import IconArrowRightEnclosed from "@/lib/components/icons/icon-arrow-right-enclosed";
import HorizontalSeparator from "@/lib/components/shared/HorizontalSeparator";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { Colors } from "@/lib/constants/Colors";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { ProposalCard } from "@/lib/components/proposal/ProposalCard";
import StatusTag from "@/lib/components/feed/StatusTag";
import CommentList from "@/lib/components/feed/CommentList";
import { formatBnBalance } from "@/lib/util";
import { calculatePercentage } from "@/lib/util/calculatePercentage";
import BN from "bn.js";
import { ENetwork, EProposalType, IVoteMetrics } from "@/lib/types/post";
import { useProposalComments } from "@/lib/net/queries/post";

interface ProposalDetailsProps {
  post: any;
  withoutFullDetails?: boolean
  withoutHeaderText?: boolean
  withoutProposalCardIndex?: boolean
  openFullDetails?: () => void
}

export function ProposalDetails({ post, openFullDetails, withoutFullDetails, withoutHeaderText, withoutProposalCardIndex=true }: ProposalDetailsProps) {
  const accentColor = useThemeColor({}, "accent");

  if (!post) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignContent: "center" }}>
        <ActivityIndicator color={accentColor} size="large" />
      </View>
    );
  }

  // Calculate vote percentages using the aye logic
  const ayeValue = new BN(post.onChainInfo?.voteMetrics?.aye.value || "0");
  const nayValue = new BN(post.onChainInfo?.voteMetrics?.nay.value || "0");
  const totalValue = ayeValue.add(nayValue);
  const ayePercent = totalValue.isZero() ? 0 : calculatePercentage(post.onChainInfo?.voteMetrics?.aye.value || "0", totalValue);
  const nayPercent = totalValue.isZero() ? 0 : calculatePercentage(post.onChainInfo?.voteMetrics?.nay.value || "0", totalValue);

  return (
    <ScrollView style={{ flex: 1 }}>
      <View style={{ paddingBottom: 16, gap: 8 }}>
        {
          !withoutHeaderText && (
            <ThemedText
              type="titleMedium"
              style={{ fontWeight: "500", marginBottom: 8 }}
            >
              Proposal #{post.index}
            </ThemedText>
          )
        }

        <ProposalCard
          post={post}
          withoutViewMore
          containerType="background"
          withoutIndex={withoutProposalCardIndex}
        />

        <Summary
          status={post.onChainInfo?.status}
          voteMetrics={post.onChainInfo?.voteMetrics}
          ayePercent={ayePercent}
          nayPercent={nayPercent}
        />

        {
          !withoutFullDetails && openFullDetails !== undefined && (
            <SeeDetails setOpen={() => openFullDetails()} />
          )
        }

        <Comments
          proposalIndex={post.index}
          proposalType={post.proposalType as EProposalType}
        />
      </View>
    </ScrollView>
  );
}

interface SummaryProps {
  status: string | undefined;
  voteMetrics: IVoteMetrics | undefined;
  ayePercent: number;
  nayPercent: number;
}

function Summary({ ayePercent, status, voteMetrics, nayPercent }: SummaryProps) {
  const formatter = new Intl.NumberFormat("en-US", { notation: "compact" });
  const formatBalance = (balance: string) =>
    formatter.format(
      Number(formatBnBalance(balance, { withThousandDelimitor: false }, ENetwork.POLKADOT))
    );
  return (
    <ThemedView
      type="background"
      style={[styles.box, { alignContent: "stretch", gap: 16 }]}
    >
      <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center" }}>
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

      <View style={{ padding: 16, gap: 16 }}>
        <View style={{ marginHorizontal: 8, flexDirection: "row", justifyContent: "space-between" }}>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <ThemedText type="bodySmall1">Aye</ThemedText>
            <ThemedText colorName="mediumText" type="bodySmall1" style={{ lineHeight: 22}}>
              {formatBnBalance(
                voteMetrics?.aye.value || "0",
                { withUnit: true, numberAfterComma: 2, compactNotation: true },
                ENetwork.POLKADOT
              )}
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <ThemedText type="bodySmall1">Nay</ThemedText>
            <ThemedText colorName="mediumText" type="bodySmall1" style={{ lineHeight: 22}}>
              {formatBnBalance(
                voteMetrics?.nay.value || "0",
                { withUnit: true, numberAfterComma: 2, compactNotation: true },
                ENetwork.POLKADOT
              )}
            </ThemedText>
          </View>
        </View>
      </View>
    </ThemedView>
  );
}

interface VoteRatioIndicatorProps {
  ayePercent: number;
  nayPercent: number;
}

function VoteRatioIndicator({ ayePercent, nayPercent }: VoteRatioIndicatorProps) {
  const colorAye = "#31C766";
  const colorNay = "#E5304F";

  const ayePerc = ayePercent < 1 ? ayePercent * 100 : ayePercent;
  const nayPerc = nayPercent < 1 ? nayPercent * 100 : nayPercent;

  return (
    <Svg height={5}>
      <Rect width={`${ayePerc}%`} height="100%" rx="5" ry="5" fill={colorAye} />
      <Rect
        width={`${nayPerc}%`}
        x={`${ayePerc}%`}
        height="100%"
        rx="2.5"
        ry="2.5"
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

function Comments({ proposalIndex, proposalType }: { proposalIndex: string; proposalType: EProposalType }) {
  const { data: comments, isLoading } = useProposalComments({
    proposalType: proposalType.toString(),
    proposalId: proposalIndex.toString(),
  });
  const insets = useSafeAreaInsets();

  const getTotalLength = (arr: any[]) =>
    arr.reduce((sum, item) => {
      const childrenLength = Array.isArray(item.children) ? getTotalLength(item.children) : 0;
      return sum + 1 + childrenLength;
    }, 0);

  return (
    <ThemedView
      type="background"
      style={[
        styles.box,
        {
          alignContent: "stretch",
          gap: 16,
          marginBottom: 50 + insets.bottom,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", gap: 6 }}>
        <ThemedText type="bodyLarge">Replies </ThemedText>
        {comments && (
          <View style={{ backgroundColor: "#E5E5FD", paddingHorizontal: 4, borderRadius: 4 }}>
            <ThemedText type="bodySmall1" style={{ color: "#79767D", lineHeight: 18 }}>
              {getTotalLength(comments)}
            </ThemedText>
          </View>
        )}
      </View>
      <View style={{ gap: 16 }}>
        {isLoading ? (
          <ActivityIndicator />
        ) : (
          <CommentList comments={comments || []} />
        )}
      </View>
    </ThemedView>
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

export default ProposalDetails;
