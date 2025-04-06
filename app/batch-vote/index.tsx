import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { Colors } from "@/lib/constants/Colors";
import { BatchVoteForm } from "@/lib/components/voting/batch-voting/BatchVoteForm";
import { IconVote } from "@/lib/components/icons/Profile";
import { useQueryClient } from "@tanstack/react-query";
import { activityFeedFunction, buildActivityFeedQueryKey } from "@/lib/net/queries/post";
import { buildCartItemsQueryKey, getCartItemsFunction } from "@/lib/net/queries/actions";
import { useProfileStore } from "@/lib/store/profileStore";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Note, TopBar } from "@/lib/components/shared";
import { useBatchVotingStore } from "@/lib/store/batchVotingStore";
import { ThemedText } from "@/lib/components/shared/text";
import { ThemedView } from "@/lib/components/shared/View";
import { router } from "expo-router";

export default function BatchVotingScreen() {
  // Get values and setters from the Zustand store
  const { 
    vote, setVote,
    ayeAmount, setAyeAmount,
    nayAmount, setNayAmount,
    abstainAmount, setAbstainAmount,
    conviction, setConviction
  } = useBatchVotingStore();

  const [noteContent, setNoteContent] = useState<string>();
  const [noteColor, setNoteColor] = useState<string>();

  const queryClient = useQueryClient();
  const userId = useProfileStore((state) => state.profile?.id) ? String(useProfileStore((state) => state.profile?.id)) : "";
  const backgroundColor = useThemeColor({}, "background");

  useEffect(() => {
    queryClient.prefetchInfiniteQuery({
      queryKey: buildActivityFeedQueryKey({
        limit: 20
      }),
      initialPageParam: 1,
      queryFn: () => activityFeedFunction({
        params: { limit: 20 },
        pageParam: 1
      })
    });
    queryClient.prefetchQuery({
      queryKey: buildCartItemsQueryKey(userId),
      queryFn: () => getCartItemsFunction({ userId }),
    })
  }, [queryClient, userId]);

  function onSaveAndNext() {
    // Fixed the validation logic
    if (ayeAmount === 0 || nayAmount === 0 || 
        abstainAmount.abstain === 0 || abstainAmount.aye === 0 || abstainAmount.nay === 0) {
      setNoteColor("#F53C3C");
    }

    if (ayeAmount === 0) {
      setNoteContent("Please set non zero value for Aye votes");
      return;
    }
    if (nayAmount === 0) {
      setNoteContent("Please set non zero value for Nay votes");
      return;
    }
    if (abstainAmount.abstain === 0 || abstainAmount.aye === 0 || abstainAmount.nay === 0) {
      setNoteContent("Please set non zero value for Abstain votes");
      return;
    }

    // Navigate to cards screen without query params - the store will provide the values
    router.push('/batch-vote/cards');
  }

  return (
    <View style={styles.root}>
      <TopBar style={{ paddingHorizontal: 8 }} />
      <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 16, marginTop: 12 }}>
        <View style={{ flexDirection: "row", alignItems: "center", gap: 4 }}>
          <IconVote iconWidth={21} iconHeight={21} color="white" />
          <ThemedText type="titleMedium" style={{ fontWeight: 500 }}>Batch Voting</ThemedText>
        </View>
        <ThemedView type="container" style={[styles.card, { gap: 15 }]}>
          <ThemedText type="titleMedium1">Set Defaults</ThemedText>
          <Note content="Select default values for votes. These can be edited before making a final transaction" />
          <BatchVoteForm
            vote={vote}
            onVoteChange={setVote}
            ayeAmount={ayeAmount}
            setAyeAmount={setAyeAmount}
            nayAmount={nayAmount}
            setNayAmount={setNayAmount}
            abstainAmount={abstainAmount}
            setAbstainAmount={setAbstainAmount}
            conviction={conviction}
            setConviction={setConviction}
            onSaveAndNext={onSaveAndNext}
          />
          {
            noteContent && <Note content={noteContent} textColor={noteColor} bgColor={backgroundColor} iconColor={noteColor}/>
          }
        </ThemedView>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.secondaryBackground,
  },
  scrollView: {
    flex: 1,
    padding: 8,
  },
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.stroke,
    borderRadius: 12,
  },
});