import IconAbstain from "@/lib/components/icons/shared/icon-abstain";
import IconAye from "@/lib/components/icons/shared/icon-aye";
import IconNay from "@/lib/components/icons/shared/icon-nay";
import { IconProps } from "@/lib/components/icons/types";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { TopBar } from "@/lib/components/Topbar";
import { Colors } from "@/lib/constants/Colors";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { useLocalSearchParams } from "expo-router";
import { FunctionComponent, useState } from "react";
import {
    Image,
    ScrollView,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    View,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";

type Vote = "aye" | "nay" | "abstain";

export default function BatchVotingScreen() {
  const { index } = useLocalSearchParams();

  const [vote, setVote] = useState<Vote>("aye");
  const [amount, setAmount] = useState<number>(0);

  return (
    <SafeAreaView style={styles.root}>
      <TopBar />

      <ScrollView style={styles.scrollView} contentContainerStyle={{ gap: 16 }}>
        <ThemedText type="titleLarge">Proposal #{index}</ThemedText>

        <VoteCard
          vote={vote}
          onVoteChange={setVote}
          amount={amount}
          onChangeAmount={setAmount}
        />
      </ScrollView>
    </SafeAreaView>
  );
}

interface VoteCardProps {
  vote: Vote;
  onVoteChange: (vote: Vote) => void;

  amount: number;
  onChangeAmount: (amount: number) => void;
}

function VoteCard({
  vote,
  onVoteChange,
  amount,
  onChangeAmount,
}: VoteCardProps) {
  return (
    <ThemedView style={[styles.card, { gap: 16 }]}>
      <TriStateButtons selected={vote} onSelectionChanged={onVoteChange} />

      <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
        <ThemedText type="bodyMedium1">Amount</ThemedText>

        <View style={{ flexDirection: "row", gap: 2 }}>
          <ThemedText type="bodySmall" colorName="mediumText">
            Available:{" "}
          </ThemedText>
          <ThemedText type="bodySmall" colorName="ctaText">
            25k DOT{" "}
          </ThemedText>
        </View>
      </View>

      <AmountInput value={amount} onChange={onChangeAmount} />
    </ThemedView>
  );
}

interface TriStateButtonsProps {
  selected: Vote;
  onSelectionChanged: (next: Vote) => void;
}

function TriStateButtons({
  selected,
  onSelectionChanged,
}: TriStateButtonsProps) {
  const colorAye = "#2ED47A";
  const colorNay = "#F53C3C";
  const colorAbstain = "#FFA013";

  return (
    <View style={{ flexDirection: "row", gap: 8, alignItems: "center" }}>
      <TriStateButton
        Icon={IconAye}
        color={colorAye}
        selected={selected === "aye"}
        onPress={() => onSelectionChanged("aye")}
      >
        AYE
      </TriStateButton>

      <TriStateButton
        Icon={IconNay}
        color={colorNay}
        selected={selected === "nay"}
        onPress={() => onSelectionChanged("nay")}
      >
        NAY
      </TriStateButton>

      <TriStateButton
        Icon={IconAbstain}
        color={colorAbstain}
        selected={selected === "abstain"}
        onPress={() => onSelectionChanged("abstain")}
      >
        ABSTAIN
      </TriStateButton>
    </View>
  );
}

interface TriStateButtonProps {
  selected: boolean;
  Icon: FunctionComponent<IconProps>;
  color: string;
  onPress: () => void;
  children: string;
}

function TriStateButton({
  color,
  Icon,
  selected,
  onPress,
  children,
}: TriStateButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
      <View
        style={[
          styles.triStateButton,
          {
            backgroundColor: selected ? color : Colors.dark.secondaryBackground,
          },
        ]}
      >
        <Icon color={selected ? Colors.dark.secondaryBackground : color} />

        <ThemedText
          darkColor={selected ? Colors.dark.secondaryBackground : color}
          lightColor={selected ? Colors.dark.secondaryBackground : color}
          type="bodyMedium1"
        >
          {children}
        </ThemedText>
      </View>
    </TouchableOpacity>
  );
}

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
}

function AmountInput({ value, onChange }: AmountInputProps) {
  const borderColor = useThemeColor({}, "stroke");
  const backgroundColor = useThemeColor({}, "secondaryBackground");
  const color = useThemeColor({}, "text");

  return (
    <View
      style={{
        borderColor,
        borderWidth: 1,
        borderRadius: 8,
        padding: 4,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor,
          padding: 4,
          gap: 8,
          alignItems: "center",
        }}
      >
        <Image
          style={{ height: 32, width: 32 }}
          source={require("@/assets/images/icon-polkadot.png")}
        ></Image>

        <ThemedText>DOT</ThemedText>
      </View>

      <TextInput
        keyboardType="numeric"
        value={isNaN(value) ? "" : value.toString()}
        onChangeText={(text) => {
          const parsed = parseInt(text);
          if (isNaN(parsed)) {
            return;
          }

          onChange(parsed);
        }}
        style={{ flex: 1, textAlign: "right", color }}
      />
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
    paddingBlock: 8,
    paddingInline: 16,
    backgroundColor: Colors.dark.background,
    borderWidth: 1,
    borderColor: Colors.dark.stroke,
    borderRadius: 12,
  },

  triStateButton: {
    flexDirection: "row",
    gap: 8,
    paddingInline: 16,
    paddingBlock: 2,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
