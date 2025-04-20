import React, { useState } from "react";
import {
  ScrollView,
  View,
} from "react-native";
import { calculatePercentage } from "@/lib/util/calculatePercentage";
import BN from "bn.js";
import { EProposalType, Post } from "@/lib/types/post";
import { router } from "expo-router";
import { ProposalCard } from "../card";
import { ThemedButton } from "../../shared/button";
import { ThemedText } from "../../shared/text";
import { useProfileStore } from "@/lib/store/profileStore";
import { useAuthModal } from "@/lib/context/authContext";
import { canVote } from "@/lib/util/vote/canVote";
import SummarySection from "./SummarySection";
import CommentSection from "./CommentSection";
import SeeDetails from "./SeeDetails";

interface ProposalDetailsProps {
  post: Post;
  withoutFullDetails?: boolean
  withoutHeaderText?: boolean
  withoutProposalCardIndex?: boolean
  withVotingButton?: boolean
  openFullDetails?: () => void
}

export function ProposalDetails({ post, openFullDetails, withoutFullDetails, withoutHeaderText, withoutProposalCardIndex = true, withVotingButton = true }: ProposalDetailsProps) {
  const [isNavigating, setIsNavigating] = useState(false);
  const user = useProfileStore((state) => state.profile);
  const { openLoginModal } = useAuthModal();

  if(!post) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <ThemedText type="titleMedium">No proposal found</ThemedText>
      </View>
    )
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

        <SummarySection
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

        <CommentSection
          proposalIndex={post.index}
          proposalType={post.proposalType as EProposalType}
        />
      </View>
    </ScrollView>
  );
}

export default ProposalDetails;