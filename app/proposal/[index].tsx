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
import { CommentList, PostCard, PostFullDetails } from "@/lib/components/feed";
import { EmptyViewWithTabBarHeight } from "@/lib/components/util";

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

  return (
    <>
      <SafeAreaView style={{ flex: 1, backgroundColor }}>
        <TopBar />
        <ScrollView>
          <View style={{ paddingInline: 16, paddingBottom: 16, gap: 8 }}>
            <ThemedText type="titleLarge">Proposal #{index}</ThemedText>

            <StatusBar status={proposal?.onChainInfo?.status} dot={2500} />

            <PostCard
              post={proposal}
              withoutViewMore
              containerType="background"
            />

            <Summary status={proposal?.onChainInfo?.status} />

            <SeeDetails setOpen={() => {
              setOpen(false);
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
}

function Summary({ status }: SummaryProps) {
  const backgroundColor = useThemeColor({}, "background");

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
        <VoteRatioIndicator aye={0.3} />

        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <ThemedText type="bodySmall" colorName="mediumText">
            Aye:
          </ThemedText>
          <ThemedText type="bodySmall" colorName="mediumText">
            To pass:
          </ThemedText>
          <ThemedText type="bodySmall" colorName="mediumText">
            Nay:
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
            gap: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ThemedText>Aye</ThemedText>
          <ThemedText colorName="mediumText">23K KSM</ThemedText>

          <ThemedText>Issuance</ThemedText>
          <ThemedText colorName="mediumText">23K KSM</ThemedText>
        </View>
        <View
          style={{
            gap: 16,
            flexDirection: "row",
            justifyContent: "space-between",
          }}
        >
          <ThemedText>Nay</ThemedText>
          <ThemedText colorName="mediumText">23K KSM</ThemedText>

          <ThemedText>Support</ThemedText>
          <ThemedText colorName="mediumText">23K KSM</ThemedText>
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
  aye: number;
}

function VoteRatioIndicator({ aye }: VoteRatioIndicatorProps) {
  const colorAye = "#31C766";
  const colorNay = "#E5304F";

  const ayePerc = aye * 100;
  const nayPerc = 100 - ayePerc;

  return (
    <Svg height={5} viewBox="0 0 100 5">
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
        <IconArrowRightEnclosed />
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
