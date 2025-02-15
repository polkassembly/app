import IconAbstain from "@/lib/components/icons/shared/icon-abstain";
import IconAye from "@/lib/components/icons/shared/icon-aye";
import IconInfo from "@/lib/components/icons/shared/icon-info";
import IconNay from "@/lib/components/icons/shared/icon-nay";
import IconPadlock from "@/lib/components/icons/shared/icon-padlock";
import { IconProps } from "@/lib/components/icons/types";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { TopBar } from "@/lib/components/Topbar";
import { Colors } from "@/lib/constants/Colors";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import Slider from "@react-native-community/slider";
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
  const [conviction, setConviction] = useState<number>(0);

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
          conviction={conviction}
          onChangeConviction={setConviction}
        />

        <Note />
      </ScrollView>
    </SafeAreaView>
  );
}

interface VoteCardProps {
  vote: Vote;
  onVoteChange: (vote: Vote) => void;

  amount: number;
  onChangeAmount: (amount: number) => void;

  conviction: number;
  onChangeConviction: (conviction: number) => void;
}

function VoteCard({
  vote,
  onVoteChange,
  amount,
  onChangeAmount,
  conviction,
  onChangeConviction,
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

      <ThemedText type="bodyMedium1">Conviction</ThemedText>
      <ConvictionSlider
        conviction={conviction}
        onConvictionChange={onChangeConviction}
      />

      <ThemedView
        type="secondaryBackground"
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderColor: Colors.dark.stroke,
          padding: 16,
          borderRadius: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <IconPadlock />
          <ThemedText colorName="mediumText">Locking Period</ThemedText>
        </View>
        <ThemedText>No Lockup Period</ThemedText>
      </ThemedView>
    </ThemedView>
  );
}

interface ConvictionSliderProps {
  conviction: number;
  onConvictionChange: (value: number) => void;
}

function ConvictionSlider({
  conviction,
  onConvictionChange,
}: ConvictionSliderProps) {
  const STEPS = 6;

  function transformOut(value: number) {
    return Math.floor(Math.max(Math.min(value * STEPS, STEPS), 0));
  }

  function transformIn(value: number) {
    return value / STEPS;
  }

  const color = useThemeColor({}, "accent");

  return (
    <View>
      <Slider
        style={{ flex: 1 }}
        value={transformIn(conviction)}
        thumbImage={require("@/assets/images/slider-thumb.png")}
        thumbTintColor={color}
        minimumTrackTintColor={color}
        step={1 / STEPS}
        lowerLimit={0}
        upperLimit={1}
        onValueChange={(value) => {
          onConvictionChange(transformOut(value));
        }}
      />
      <View
        style={{
          flex: 1,
          flexDirection: "row",
          justifyContent: "space-between",
        }}
      >
        <ThemedText>0.1x</ThemedText>
        <ThemedText>1x</ThemedText>
        <ThemedText>2x</ThemedText>
        <ThemedText>3x</ThemedText>
        <ThemedText>4x</ThemedText>
        <ThemedText>5x</ThemedText>
        <ThemedText>6x</ThemedText>
      </View>
    </View>
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

function Note() {
  return (
    <View
      style={{
        backgroundColor: "#002C4F",
        padding: 8,
        gap: 16,
        borderRadius: 8,
        flexDirection: "row",
        alignItems: "center",
      }}
    >
      <IconInfo />
      <ThemedText>NOTE: Login Via web view to confirm your vote</ThemedText>
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
