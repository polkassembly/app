import IconAbstain from "@/lib/components/icons/shared/icon-abstain";
import IconAye from "@/lib/components/icons/shared/icon-aye";
import IconNay from "@/lib/components/icons/shared/icon-nay";
import IconPadlock from "@/lib/components/icons/shared/icon-padlock";
import { IconProps } from "@/lib/components/icons/types";
import { ThemedButton } from "@/lib/components/shared/button";
import { ThemedText } from "@/lib/components/shared/text";
import { ThemedView } from "@/lib/components/shared/View";
import { Colors } from "@/lib/constants/Colors";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import React, { useState, useEffect } from "react";
import { Image, StyleSheet, TextInput, View } from "react-native";
import TriStateButtons from "./TriStateButton";
import ConvictionSlider from "./ConvictionSlider";
import { Vote, Abstain } from "@/lib/types/voting";

function getLockPeriodText(conviction: number): string {
  if (conviction === 0) return "No Lockup Period";
  return `${(2 ** (conviction - 1)) * 7} Days Lockup`;
}

export interface BatchVoteFormProps {
  vote: Vote;
  onVoteChange: (value: Vote) => void;
  ayeAmount: number;
  setAyeAmount: (value: number) => void;
  nayAmount: number;
  setNayAmount: (value: number) => void;
  abstainAmount: Abstain;
  setAbstainAmount: (abstain: Abstain) => void;
  conviction: number;
  setConviction: (value: number) => void;
  onSaveAndNext?: () => void;
  singleVoteMode?: boolean;
  onConfirm?: () => void;
  onCancel?: () => void;
  hideButtons?: boolean;
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
  hideButtons = false,
}: BatchVoteFormProps) {
  const handleVoteChange = (nextVote: Vote) => {
    onVoteChange(nextVote);
    if (singleVoteMode) {
      if (nextVote !== "aye") setAyeAmount(1);
      if (nextVote !== "nay") setNayAmount(1);
      if (nextVote !== "splitAbstain") setAbstainAmount({ abstain: 1, aye: 1, nay: 1 });
    }
  };

  return (
    <ThemedView style={[styles.card, { gap: 24 }]}>
      <TriStateButtons selected={vote} onSelectionChanged={handleVoteChange} />

      {/* Display appropriate inputs based on selected vote */}
      {vote === "aye" && (
        <View style={{ gap: 8 }}>
          <SectionHeader title="Aye Amount" Icon={IconAye} color="#2ED47A" />
          <AmountInput value={ayeAmount} onChange={setAyeAmount} />
        </View>
      )}

      {vote === "nay" && (
        <View style={{ gap: 8 }}>
          <SectionHeader title="Nay Amount" Icon={IconNay} color="#F53C3C" />
          <AmountInput value={nayAmount} onChange={setNayAmount} />
        </View>
      )}

      {/* Show all three inputs in abstain mode */}
      {vote === "splitAbstain" && (
        <>
          <View style={{ gap: 8 }}>
            <SectionHeader title="Abstain Amount" Icon={IconAbstain} color="#FFA013" />
            <AmountInput value={abstainAmount.abstain} onChange={(value) => {
              setAbstainAmount({
                ...abstainAmount,
                abstain: value
              })
            }} />
          </View>

          <View style={{ gap: 8 }}>
            <SectionHeader title="Aye Amount" Icon={IconAye} color="#2ED47A" />
            <AmountInput
              value={abstainAmount.aye}
              onChange={(value) => {
                setAbstainAmount({
                  ...abstainAmount,
                  aye: value
                });
              }}
            />
          </View>

          <View style={{ gap: 8 }}>
            <SectionHeader title="Nay Amount" Icon={IconNay} color="#F53C3C" />
            <AmountInput
              value={abstainAmount.nay}
              onChange={(value) => {
                setAbstainAmount({
                  ...abstainAmount,
                  nay: value
                });
              }}
            />
          </View>
        </>
      )}

      <View style={{ gap: 8 }}>
        <ThemedText type="bodyMedium2">Set Conviction</ThemedText>
        <ConvictionSlider conviction={conviction} onConvictionChange={setConviction} />
      </View>
      <ThemedView
        type="secondaryBackground"
        style={{
          flexDirection: "row",
          justifyContent: "space-between",
          borderColor: Colors.dark.stroke,
          padding: 12,
          borderRadius: 8,
        }}
      >
        <View style={{ flexDirection: "row", alignItems: "center", gap: 8 }}>
          <IconPadlock />
          <ThemedText colorName="mediumText" type="bodyMedium3">Locking Period</ThemedText>
        </View>
        <ThemedText type="bodyMedium2">{getLockPeriodText(conviction)}</ThemedText>
      </ThemedView>

      {/* Render buttons only if hideButtons is false */}
      {!hideButtons &&
        (singleVoteMode ? (
          <View style={{ flexDirection: "row", gap: 8 }}>
            <ThemedButton
              onPress={onCancel}
              text="Cancel"
              textType="bodyMedium3"
              style={{ flex: 1, paddingVertical: 8 }}
            />
            <ThemedButton
              onPress={onConfirm}
              text="Confirm"
              textType="bodyMedium3"
              style={{ flex: 1, paddingVertical: 8 }}
            />
          </View>
        ) : (
          <ThemedButton
            onPress={onSaveAndNext}
            text="Save and Next"
            textType="bodyMedium3"
            style={{ paddingVertical: 8 }}
          />
        ))}
    </ThemedView>
  );
}

interface SectionHeaderProps {
  title: string;
  Icon: React.FunctionComponent<IconProps>;
  color: string;
}

function SectionHeader({ title, Icon, color }: SectionHeaderProps) {
  return (
    <View style={styles.sectionHeader}>
      <Icon color={color} />
      <ThemedText type="bodyMedium2">{title}</ThemedText>
    </View>
  );
}

interface AmountInputProps {
  value: number;
  onChange: (value: number) => void;
}

const MAX_VOTING_VALUE = 1000000;
const MIN_VOTING_VALUE = 0.00001;

function AmountInput({ value, onChange }: AmountInputProps) {
  const borderColor = useThemeColor({}, "stroke");
  const backgroundColor = useThemeColor({}, "secondaryBackground");
  const color = useThemeColor({}, "mediumText");

  // Initialize with the value or "1" if not provided
  const [inputValue, setInputValue] = useState(
    value ? value.toString() : "1"
  );

  useEffect(() => {
    // Only update if the value changes and is different from current inputValue
    const stringValue = value.toString();
    if (stringValue !== inputValue) {
      setInputValue(stringValue);
    }
  }, [value]);

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
          style={{ height: 24, width: 24 }}
          resizeMode="contain"
          source={require("@/assets/images/icon-polkadot.png")}
        />
        <ThemedText type="bodySmall">DOT</ThemedText>
      </View>
      <TextInput
        keyboardType="numeric"
        value={inputValue}
        placeholder="1"
        placeholderTextColor={color}
        style={{ flex: 1, textAlign: "right", color, paddingHorizontal: 8 }}
        onFocus={() => {
          if (inputValue === "1") {
            setInputValue("");
          }
        }}
        onBlur={() => {
          if (inputValue.trim() === "") {
            setInputValue("1");
            onChange(1);
          }
        }}
        onChangeText={(text) => {
          // Allow decimal values
          const sanitized = text.replace(/[^0-9.]/g, "");
          // Ensure only one decimal point
          const parts = sanitized.split('.');
          const formattedText = parts[0] + (parts.length > 1 ? '.' + parts.slice(1).join('') : '');

          setInputValue(formattedText);

          // Parse as floating point for decimal support
          let parsed = parseFloat(formattedText);

          // Handle validation
          if (isNaN(parsed)) {
            parsed = 1;
          } else if (parsed < MIN_VOTING_VALUE && parsed !== 0) {
            parsed = MIN_VOTING_VALUE;
          } else if (parsed > MAX_VOTING_VALUE) {
            parsed = MAX_VOTING_VALUE;
          }

          // Only update if value has changed
          onChange(parsed);
        }}
      />
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
});

export default BatchVoteForm;