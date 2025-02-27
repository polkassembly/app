import { useState } from "react";
import { ScrollView, StyleSheet } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { router } from "expo-router";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { TopBar } from "@/lib/components/Topbar";
import { Colors } from "@/lib/constants/Colors";
import { Vote, Note, BatchVoteForm } from "@/lib/components/feed/BatchVoteForm";

export default function BatchVotingScreen() {
  const [vote, setVote] = useState<Vote>("aye");
  const [ayeAmount, setAyeAmount] = useState<number>(0);
  const [nayAmount, setNayAmount] = useState<number>(0);
  const [abstainAmount, setAbstainAmount] = useState<number>(0);
  const [conviction, setConviction] = useState<number>(0);

  function onSaveAndNext() {
    router.push(
      `/batch-vote/cards?defaultConviction=${conviction}&defaultAyeAmount=${ayeAmount}&defaultNayAmount=${nayAmount}&defaultAbstainAmount=${abstainAmount}`
    );
  }

  return (
    <SafeAreaView style={styles.root}>
      <TopBar style={{ marginTop: 10 }} />
      <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 16 }}>
        <ThemedText type="titleMedium">Batch Voting</ThemedText>
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
