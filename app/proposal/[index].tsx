import IconArrowRightEnclosed from "@/lib/components/icons/icon-arrow-right-enclosed";
import BottomButton from "@/lib/components/shared/BottomButton";
import HorizontalSeparator from "@/lib/components/shared/HorizontalSeparator";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { TopBar } from "@/lib/components/Topbar";
import { Colors } from "@/lib/constants/Colors";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useProposalByIndex } from "@/lib/net/queries/post/useProposalByIndex";
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
import { ENetwork, IVoteMetrics } from "@/lib/types/post";
import { formatBnBalance } from "@/lib/util";
import BN from "bn.js";
import { calculatePercentage } from "@/lib/util/calculatePercentage";
import ProposalCard from "@/lib/components/proposal/ProposalCard";

export default function ProposalDetailScreenImpl() {
  const [open, setOpen] = useState(false);
  const { index, proposalType } = useLocalSearchParams<{ index: string, proposalType: EProposalType }>();
  const { data: proposal, isLoading } = useProposalByIndex({
    proposalType: proposalType,
    indexOrHash: index,
  });

  // Fetch comments for the proposal using the new hook.
  const { data: comments, isLoading: commentsLoading } = useProposalComments({ proposalType: proposalType, proposalId: index });

  const backgroundColor = useThemeColor({}, "secondaryBackground");

  const accentColor = useThemeColor({}, "accent");

  if (isLoading || !proposal) {
    return (
      <View
        style={{ flex: 1, justifyContent: "center", alignContent: "center" }}
      >
        <ActivityIndicator color={accentColor} size="large" />
      </View>
    );
  }


  const ayeValue = new BN(proposal.onChainInfo?.voteMetrics?.aye.value || '0');
  const nayValue = new BN(proposal.onChainInfo?.voteMetrics?.nay.value || '0');
  const totalValue = ayeValue.add(nayValue);
  const ayePercent = calculatePercentage(proposal.onChainInfo?.voteMetrics?.aye.value || '0', totalValue);
  const nayPercent = calculatePercentage(proposal.onChainInfo?.voteMetrics?.nay.value || '0', totalValue);

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <TopBar />
        <ScrollView>
          <View style={{ paddingInline: 16, paddingBottom: 16, gap: 8 }}>
            <ThemedText type="titleLarge">Proposal #{index}</ThemedText>

            <ProposalCard
              post={proposal}
              withoutViewMore
              containerType="background"
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
              <ThemedText type="titleMedium">Replies</ThemedText>
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
        <Link asChild href={`/proposal/vote/${index}`}>
          <BottomButton>Cast Your Vote</BottomButton>
        </Link>
      </View>

      <BottomSheet open={open} onClose={() => setOpen(false)}>
        <PostFullDetails onClose={() => setOpen(false)} post={proposal} />
      </BottomSheet>
    </>
  );
}

interface StatusBarProps {
  status: string | undefined;
  dot: number;
}

function StatusBar({ status, dot }: StatusBarProps) {
  return (
    <ThemedView
      type="background"
      style={[
        styles.box,
        {
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
        },
      ]}
    >
      <StatusChip status={status} />

      <ThemedText type="bodyLarge">{dot}</ThemedText>
    </ThemedView>
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
        <ThemedText type="titleMedium">Summary</ThemedText>

        <StatusChip status={status} />
      </View>

      <View style={{ gap: 4 }}>
        <VoteRatioIndicator ayePercent={ayePercent} nayPercent={nayPercent} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText type="bodySmall" colorName="mediumText">
            Aye: {ayePercent}%
          </ThemedText>
          <ThemedText type="bodySmall" colorName="mediumText">
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
                voteMetrics?.aye.value,
                {
                  withUnit: true,
                  numberAfterComma: 2,
                  compactNotation: true,
                },
                ENetwork.POLKADOT,
              )
            }</ThemedText>
          </View>

          <View style={{ flexDirection: "row", gap:  16}}>
            <ThemedText>Nay</ThemedText>
            <ThemedText colorName="mediumText">{
              formatBnBalance(
                voteMetrics?.nay.value,
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

interface StatusChipProps {
  status: string | undefined;
}

function StatusChip({ status }: StatusChipProps) {
  return (
    <View
      style={{
        paddingVertical: 2,
        paddingHorizontal: 4,
        borderRadius: 4,
        backgroundColor: "#5BC044",
      }}
    >
      {status && (
        <ThemedText
          type="bodySmall"
          colorName="background"
          style={{ textTransform: "uppercase" }}
        >
          {status}
        </ThemedText>
      )}
    </View>
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
