import { useState, useEffect } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { TopBar } from "@/lib/components/Topbar";
import { Colors } from "@/lib/constants/Colors";
import { Vote, Note, BatchVoteForm } from "@/lib/components/feed/BatchVoteForm";
import { IconVote } from "@/lib/components/icons/Profile";
import { useQueryClient } from "@tanstack/react-query";
import { activityFeedFunction, buildActivityFeedQueryKey } from "@/lib/net/queries/post";
import { buildCartItemsQueryKey, getCartItemsFunction } from "@/lib/net/queries/actions";
import { useProfileStore } from "@/lib/store/profileStore";
import { useThemeColor } from "@/lib/hooks/useThemeColor";

export default function BatchVotingScreen() {
  const [vote, setVote] = useState<Vote>("aye");
  const [ayeAmount, setAyeAmount] = useState<number>(1);
  const [nayAmount, setNayAmount] = useState<number>(1);
  const [abstainAmount, setAbstainAmount] = useState<number>(1);
  const [conviction, setConviction] = useState<number>(0);
  const [noteContent, setNoteContent] = useState<string>();
  const [ noteColor, setNoteColor ] = useState<string>();

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
  }
    , [queryClient]);

  function onSaveAndNext() {
    if( ayeAmount === 0 || nayAmount === 0 || abstainAmount === 0 ) setNoteColor("#F53C3C");

    if (ayeAmount === 0) {
      setNoteContent("Please set non zero value for Aye votes");
      return;
    }
    if (nayAmount === 0) {
      setNoteContent("Please set non zero value for Nay votes");
      return;
    }
    if (abstainAmount === 0) {
      setNoteContent("Please set non zero value for Abstain votes");
      return
    }

    router.push(
      `/batch-vote/cards?defaultConviction=${conviction}&defaultAyeAmount=${ayeAmount}&defaultNayAmount=${nayAmount}&defaultAbstainAmount=${abstainAmount}`
    );
  }

  return (
    <SafeAreaView style={styles.root}>
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
    </SafeAreaView>
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
