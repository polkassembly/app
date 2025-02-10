import IconBack from "@/components/icons/icon-back";
import { IconPoints } from "@/components/icons/icon-points";
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

        <View style={{ paddingInline: 16, paddingBottom: 16 }}>
          <ThemedText type="titleLarge" style={{ marginBottom: 8 }}>
            Proposal #{index}
          </ThemedText>

          <StatusBar status={proposal.onChainInfo.status} dot={2500} />

          <PostCard
            post={proposal}
            withoutViewMore
            containerType="background"
          />
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

      <ThemedText type="bodyLarge">{dot}</ThemedText>
    </ThemedView>
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
