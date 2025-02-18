import IconAbstain from "@/lib/components/icons/shared/icon-abstain";
import IconAye from "@/lib/components/icons/shared/icon-aye";
import IconInfo from "@/lib/components/icons/shared/icon-info";
import IconNay from "@/lib/components/icons/shared/icon-nay";
import IconPadlock from "@/lib/components/icons/shared/icon-padlock";
import { IconProps } from "@/lib/components/icons/types";
import ThemedButton from "@/lib/components/ThemedButton";
import { ThemedText } from "@/lib/components/ThemedText";
import { ThemedView } from "@/lib/components/ThemedView";
import { Colors } from "@/lib/constants/Colors";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import Slider from "@react-native-community/slider";
import { FunctionComponent } from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableOpacity,
  View,
} from "react-native";

export type Vote = "aye" | "nay" | "abstain";

function getLockPeriodText(conviction: number): string {
  if (conviction === 0) return "No Lockup Period";
  return `${(2 ** (conviction - 1)) * 7} Days Lockup`;
}

interface BatchVoteFormProps {
  vote: Vote;
  onVoteChange: (value: Vote) => void;
  ayeAmount: number;
  setAyeAmount: (value: number) => void;
  nayAmount: number;
  setNayAmount: (value: number) => void;
  abstainAmount: number;
  setAbstainAmount: (value: number) => void;
  conviction: number;
  setConviction: (value: number) => void;
  onSaveAndNext?: () => void;
  singleVoteMode?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
}

export function BatchVoteForm({
  vote,
  onVoteChange,
  ayeAmount,
  setAyeAmount,
  nayAmount,
  setNayAmount,
  abstainAmount,
  setAbstainAmount,
  conviction,
  setConviction,
  onSaveAndNext,
  singleVoteMode = false,
  onConfirm,
  onCancel,
}: BatchVoteFormProps) {
  const handleVoteChange = (nextVote: Vote) => {
    onVoteChange(nextVote);
    if (singleVoteMode) {
      if (nextVote !== "aye") setAyeAmount(0);
      if (nextVote !== "nay") setNayAmount(0);
      if (nextVote !== "abstain") setAbstainAmount(0);
    }
  };

  return (
    <ThemedView style={[styles.card, { gap: 16 }]}>
      <TriStateButtons selected={vote} onSelectionChanged={handleVoteChange} />
      {vote === "aye" && (
        <>
          <SectionHeader title="Aye Amount" Icon={IconAye} color="#2ED47A" />
          <AmountInput value={ayeAmount} onChange={setAyeAmount} />
        </>
      )}
      {vote === "nay" && (
        <>
          <SectionHeader title="Nay Amount" Icon={IconNay} color="#F53C3C" />
          <AmountInput value={nayAmount} onChange={setNayAmount} />
        </>
      )}
      {vote === "abstain" && (
        <>
          <SectionHeader title="Abstain Amount" Icon={IconAbstain} color="#FFA013" />
          <AmountInput value={abstainAmount} onChange={setAbstainAmount} />
        </>
      )}
      <ThemedText type="bodyMedium1">Conviction</ThemedText>
      <ConvictionSlider conviction={conviction} onConvictionChange={setConviction} />
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
        <ThemedText>{getLockPeriodText(conviction)}</ThemedText>
      </ThemedView>
      {singleVoteMode ? (
        <View style={{ flexDirection: "row", gap: 8 }}>
          <ThemedButton
            onPress={onCancel}
            text="Cancel"
            textType="titleMedium"
            style={{ flex: 1, paddingVertical: 8 }}
          />
          <ThemedButton
            onPress={onConfirm}
            text="Confirm"
            textType="titleMedium"
            style={{ flex: 1, paddingVertical: 8 }}
          />
        </View>
      ) : (
        <ThemedButton
          onPress={onSaveAndNext}
          text="Save and Next"
          textType="titleMedium"
          style={{ paddingVertical: 8 }}
        />
      )}
    </ThemedView>
  );
}

interface SectionHeaderProps {
  title: string;
  Icon: FunctionComponent<IconProps>;
  color: string;
}

function SectionHeader({ title, Icon, color }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Icon color={color} />
      <ThemedText type="bodyMedium1">{title}</ThemedText>
    </View>
  );
}

interface ConvictionSliderProps {
  conviction: number;
  onConvictionChange: (value: number) => void;
}

function ConvictionSlider({ conviction, onConvictionChange }: ConvictionSliderProps) {
  const STEPS = 6;
  const transformOut = (value: number) => Math.round(value * STEPS);
  const transformIn = (value: number) => value / STEPS;
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
        onValueChange={(value: number) => onConvictionChange(transformOut(value))}
      />
      <View style={{ flex: 1, flexDirection: "row", justifyContent: "space-between" }}>
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

function TriStateButtons({ selected, onSelectionChanged }: TriStateButtonsProps) {
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

function TriStateButton({ color, Icon, selected, onPress, children }: TriStateButtonProps) {
  return (
    <TouchableOpacity onPress={onPress} style={{ flex: 1 }}>
      <View
        style={[
          styles.triStateButton,
          { backgroundColor: selected ? color : Colors.dark.secondaryBackground },
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
  const color = useThemeColor({}, "mediumText");

  return (
    <View
      style={{
        borderColor,
        borderWidth: 1,
        borderRadius: 8,
        flexDirection: "row",
        justifyContent: "space-between",
        alignItems: "center",
        overflow: "hidden",
      }}
    >
      <View
        style={{
          flexDirection: "row",
          backgroundColor,
          padding: 4,
          paddingHorizontal: 8,
          gap: 8,
          alignItems: "center",
        }}
      >
        <Image
          style={{ height: 32, width: 32 }}
          source={require("@/assets/images/icon-polkadot.png")}
        />
        <ThemedText>DOT</ThemedText>
      </View>
      <TextInput
        keyboardType="numeric"
        value={value === 0 ? "" : value.toString()}
        onChangeText={(text) => {
          const parsed = parseInt(text);
          onChange(isNaN(parsed) ? 0 : parsed);
        }}
        placeholder="Add default amount"
        placeholderTextColor={color}
        style={{ flex: 1, textAlign: "right", color }}
      />
    </View>
  );
}

interface NoteProps {
  content: string;
}

export function Note({ content }: NoteProps) {
  return (
    <View
      style={{
        backgroundColor: "#002C4F",
        padding: 8,
        borderRadius: 8,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
      }}
    >
      <IconInfo />
      <ThemedText type="bodyMedium3" style={{ flex: 1 }}>
        {content}
      </ThemedText>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.dark.stroke,
    borderRadius: 12,
  },
  sectionHeader: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  triStateButton: {
    flexDirection: "row",
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 2,
    borderRadius: 16,
    alignItems: "center",
    justifyContent: "center",
  },
});
