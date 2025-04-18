import React, { useEffect, useState } from "react";
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
import { Colors } from "@/lib/constants/Colors";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { CommentList } from "@/lib/components/proposal/comments";
import { formatBnBalance } from "@/lib/util";
import { calculatePercentage } from "@/lib/util/calculatePercentage";
import BN from "bn.js";
import { ENetwork, EProposalType, IVoteMetrics, Post } from "@/lib/types/post";
import { useProposalComments } from "@/lib/net/queries/post";
import StatusTag from "./card/header/StatusTag";
import { router } from "expo-router";
import { ProposalCard } from "./card";
import { ThemedButton } from "../shared/button";
import { ThemedText } from "../shared/text";
import { ThemedView, HorizontalSeparator } from "../shared/View";
import { useProfileStore } from "@/lib/store/profileStore";
import { useAuthModal } from "@/lib/context/authContext";
import { ICommentResponse } from "@/lib/types";
import { ECommentSentiment } from "@/lib/types/comment";
import { IconSentiment } from "../icons/proposals";
import { canVote } from "@/lib/util/vote/canVote";

interface ProposalDetailsProps {
  post: Post;
  withoutFullDetails?: boolean
  withoutHeaderText?: boolean
  withoutProposalCardIndex?: boolean
  withVotingButton?: boolean
  openFullDetails?: () => void
}

export function ProposalDetails({ post, openFullDetails, withoutFullDetails, withoutHeaderText, withoutProposalCardIndex = true, withVotingButton = true }: ProposalDetailsProps) {
  const accentColor = useThemeColor({}, "accent");
  const [isNavigating, setIsNavigating] = useState(false);
  const user = useProfileStore((state) => state.profile);
  const { openLoginModal } = useAuthModal();

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

  const handleVote = () => {
    if (isNavigating) return; // Prevent navigation if already navigating
    setIsNavigating(true);
    if (!user) {
      openLoginModal("Login to vote on proposal", false);
      return;
    }
    router.push(`/proposal/vote/${post.index}?proposalType=${post.proposalType}`)
    setTimeout(() => {
      setIsNavigating(false);
    }, 800);
  }

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
          containerType="background"
          withoutIndex={withoutProposalCardIndex}
          childrenEnd={
            withVotingButton && canVote(post.onChainInfo?.status, post.onChainInfo?.preparePeriodEndsAt) && (
              <ThemedButton
                text="Cast Your Vote"
                textType="bodyMedium2"
                style={{ paddingVertical: 8, borderRadius: 8 }}
                onPress={handleVote}
                disabled={isNavigating}
              />
            )
          }
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
            <ThemedText colorName="mediumText" type="bodySmall1" style={{ lineHeight: 22 }}>
              {formatBnBalance(
                voteMetrics?.aye.value || "0",
                { withUnit: true, numberAfterComma: 2, compactNotation: true },
                ENetwork.POLKADOT
              )}
            </ThemedText>
          </View>
          <View style={{ flexDirection: "row", gap: 16 }}>
            <ThemedText type="bodySmall1">Nay</ThemedText>
            <ThemedText colorName="mediumText" type="bodySmall1" style={{ lineHeight: 22 }}>
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
  const [sortedSentiments, setSortedSentiments] = useState<[ECommentSentiment, number][]>([]);
  const accentColor = useThemeColor({}, "accent");

  // Helper: Flatten nested comments and remove comments without sentiment
  const flattenComments = (comments: ICommentResponse[]): ICommentResponse[] => {
    return comments.reduce((acc: ICommentResponse[], comment) => {
      if (comment.aiSentiment) acc.push(comment);
      if (comment.children?.length) {
        acc.push(...flattenComments(comment.children));
      }
      return acc;
    }, []);
  };

  // Calculate sentiment percentages
  useEffect(() => {
    if (!comments) return;

    const allComments = flattenComments(comments);
    const total = allComments.length;

    const count: Record<ECommentSentiment, number> = {
      [ECommentSentiment.AGAINST]: 0,
      [ECommentSentiment.SLIGHTLY_AGAINST]: 0,
      [ECommentSentiment.NEUTRAL]: 0,
      [ECommentSentiment.SLIGHTLY_FOR]: 0,
      [ECommentSentiment.FOR]: 0,
    };

    for (const comment of allComments) {
      if (comment.aiSentiment && Object.hasOwn(count, comment.aiSentiment)) {
        count[comment.aiSentiment]++;
      }
    }

    const percentages = Object.fromEntries(
      Object.entries(count).map(([key, value]) => [key, total ? Math.round((value / total) * 100) : 0])
    ) as Record<ECommentSentiment, number>;

    const sorted = (Object.entries(percentages) as [ECommentSentiment, number][])
      .sort(([, aPct], [, bPct]) => bPct - aPct);
    setSortedSentiments(sorted)
  }, [comments]);

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
          marginBottom: 50,
        },
      ]}
    >
      <View style={{ flexDirection: "row", alignItems: "center", justifyContent: "space-between" }}>
        <View style={{ flexDirection: "row", gap: 4, alignItems: "center" }}>
          <ThemedText type="bodyLarge">Replies </ThemedText>
          {comments && (
            <View style={{ backgroundColor: "#E5E5FD", paddingHorizontal: 4, borderRadius: 4 }}>
              <ThemedText type="bodySmall1" style={{ color: "#79767D", lineHeight: 18 }}>
                {getTotalLength(comments)}
              </ThemedText>
            </View>
          )}
        </View>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 4 }}>
          {sortedSentiments.map(([sentiment, pct], index) => {
            const isFirst = index === 0;
            return (
              <View
                key={sentiment}
                style={{
                  flexDirection: 'row',
                  alignItems: 'center',
                  gap: 2,
                  backgroundColor: isFirst ? '#FEF2F8' : 'transparent',
                  borderRadius: isFirst ? 4 : 0,
                  padding: 4,
                }}
              >
                <IconSentiment
                  sentiment={sentiment}
                  iconWidth={13}
                  iconHeight={13}
                  color={isFirst ? accentColor : undefined}
                />
                <ThemedText
                  type="bodySmall1"
                  colorName={isFirst ? "accent" : "mediumText"}
                >
                  {pct}%
                </ThemedText>
              </View>
            );
          })}
        </View>
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
