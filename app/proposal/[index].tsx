import IconArrowRightEnclosed from "@/components/icons/icon-arrow-right-enclosed";
import IconBack from "@/components/icons/icon-back";
import { IconPoints } from "@/components/icons/icon-points";
import HorizontalSeparator from "@/components/shared/HorizontalSeparator";
import { ThemedText } from "@/components/ThemedText";
import { ThemedView } from "@/components/ThemedView";
import { PostCard } from "@/components/timeline/postCard";
import { Colors } from "@/constants/Colors";
import { useThemeColor } from "@/hooks/useThemeColor";
import useProposalByIndex from "@/net/queries/useProposalByIndex";
import { Link, useLocalSearchParams } from "expo-router";
import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Rect } from "react-native-svg";

export function TopBar() {
  const textColor = useThemeColor({}, "text");
  const backgroundColor = useThemeColor({}, "secondaryBackground");

  // FIXME: fetch balance
  const coins = 7896;

  return (
    <View
      style={{
        paddingInline: 8,
        paddingBlock: 16,
        backgroundColor: backgroundColor,
        flexDirection: "row",
        justifyContent: "space-between",
      }}
    >
      <Link asChild href={".."}>
        <TouchableOpacity>
          <View style={{ padding: 8 }}>
            <IconBack color={textColor} iconWidth={24} iconHeight={24} />
          </View>
        </TouchableOpacity>
      </Link>

      <View
        style={{
          flexDirection: "row",
          gap: 16,
          paddingInline: 8,
          alignItems: "center",
        }}
      >
        <IconPoints />
        <ThemedText type="titleLarge">{coins}</ThemedText>
      </View>
    </View>
  );
}

export default function ProposalDetailScreen() {
  const { index } = useLocalSearchParams<{ index: string }>();
  const { data: proposal, isLoading } = useProposalByIndex({
    pathParams: {
      // FIXME: are other possible values any good?
      proposalType: "ReferendumV2",

      indexOrHash: index,
    },
  });

  const backgroundColor = useThemeColor({}, "secondaryBackground");

  if (isLoading || !proposal) {
    // FIXME: Loading screen?
    return <></>;
  }

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor }}>
      <View>
        <TopBar />

        <View style={{ paddingInline: 16, paddingBottom: 16, gap: 8 }}>
          <ThemedText type="titleLarge">Proposal #{index}</ThemedText>

          <StatusBar status={proposal.onChainInfo.status} dot={2500} />

          <PostCard
            post={proposal}
            withoutViewMore
            containerType="background"
          />

          <Summary status={proposal.onChainInfo.status} />

          <SeeDetails />
        </View>
      </View>
    </SafeAreaView>
  );
}

interface StatusBarProps {
  status: string;
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
  status: string;
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
  status: string;
}

function StatusChip({ status }: StatusChipProps) {
  return (
    <View
      style={{
        paddingBlock: 2,
        paddingInline: 4,
        borderRadius: 4,
        backgroundColor: "#5BC044",
      }}
    >
      <ThemedText
        type="bodySmall"
        colorName="background"
        style={{ textTransform: "uppercase" }}
      >
        {status}
      </ThemedText>
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
    <Svg height={5} viewBox="0 0 100% 100%">
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

interface SeeDetailsProps {}

function SeeDetails({}: SeeDetailsProps) {
  const backgroundColor = useThemeColor({}, "background");

  return (
    <Link href={".."} asChild>
      <TouchableOpacity>
        <View
          style={[
            styles.box,
            {
              flexDirection: "row",
              paddingInline: 16,
              paddingBlock: 16,
              backgroundColor: backgroundColor,
              alignContent: "center",
              justifyContent: "space-between",
              gap: 16,
            },
          ]}
        >
          <ThemedText type="bodyMedium1">See Full Details</ThemedText>
          <IconArrowRightEnclosed />
        </View>
      </TouchableOpacity>
    </Link>
  );
}

const styles = StyleSheet.create({
  box: {
    borderColor: Colors.dark.stroke,
    borderWidth: 1,
    paddingInline: 12,
    paddingBlock: 12,
    borderRadius: 12,
  },
});
