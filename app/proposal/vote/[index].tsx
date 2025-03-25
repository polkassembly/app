import { AxiosError } from "axios";
import { router, useLocalSearchParams } from "expo-router";
import React, { useState } from "react";
import { ScrollView, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import BottomButton from "@/lib/components/shared/BottomButton";
import { ThemedText } from "@/lib/components/ThemedText";
import { TopBar } from "@/lib/components/Topbar";
import useAddCartItem from "@/lib/net/queries/actions/useAddCartItem";
import { Colors } from "@/lib/constants/Colors";
import { BatchVoteForm } from "@/lib/components/voting/batch-voting/BatchVoteForm";
import { EProposalType } from "@/lib/types";
import { Note } from "@/lib/components/shared";
import { Vote, Abstain } from "@/lib/types/voting";

const ERROR_DEFAULT = "Something went wrong";

type Params = {
  index: string;
  proposalType: EProposalType
};

export default function BatchVotingScreen() {
  const { index, proposalType } = useLocalSearchParams<Params>();
  const { mutateAsync, error } = useAddCartItem();

  const [vote, setVote] = useState<Vote>("aye");
  const [ayeAmount, setAyeAmount] = useState<number>(1);
  const [nayAmount, setNayAmount] = useState<number>(1);
  const [abstainAmount, setAbstainAmount] = useState<Abstain>({
    abstain: 1,
    aye: 1,
    nay: 1
  });
  const [conviction, setConviction] = useState<number>(0);

  async function onPressAddToCart() {
    let amount: { aye?: string, nay?: string, abstain?: string} = {};
    let amountSuccess;
    
    if (vote === "aye") {
      amount.aye = ayeAmount.toString();
      amountSuccess = amount.aye;
    } else if (vote === "nay") {
      amount.nay = nayAmount.toString();
      amountSuccess = amount.nay;
    } else if (vote === "splitAbstain") {
      amount.aye = abstainAmount.aye.toString();
      amount.nay = abstainAmount.nay.toString();
      amount.abstain = abstainAmount.abstain.toString();
      amountSuccess = amount.abstain;
    }

    await mutateAsync({
      amount,
      conviction,
      decision: vote,
      postIndexOrHash: index,
      proposalType: proposalType,
    });

    router.push(`/proposal/vote/success/${index}?dot=${amountSuccess}&conviction=${conviction}&decision=${vote}&proposalType=${proposalType}`);
  }

  return (
    <View style={styles.root}>
      <TopBar />
      <ScrollView style={styles.scrollView} contentContainerStyle={{ marginTop: 20, gap: 20 }}>
        <ThemedText type="bodyLarge">Proposal #{index}</ThemedText>

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
          hideButtons={true}
        />

        <Note content="NOTE: Login Via web view to confirm your vote" />

        {error && (
          <Note
            content={
              error instanceof AxiosError &&
                error.response &&
                error.response.data?.message
                ? error.response.data.message
                : ERROR_DEFAULT
            }
          />
        )}
      </ScrollView>

      <View style={{ position: "absolute", bottom: 0, left: 0, right: 0 }}>
        <BottomButton onPress={onPressAddToCart}>Add to Cart</BottomButton>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: Colors.dark.secondaryBackground,
    paddingHorizontal: 16
  },
  scrollView: {
    flex: 1,
    padding: 8,
  },
});