import React from 'react';
import { View, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '@/lib/hooks/useThemeColor';

export const calculateDecisionProgress = (periodEndsAt: Date | string | null, durationInDays: number = 28) => {
  if (!periodEndsAt) return 0;
  const now = dayjs();
  const endDate = dayjs(periodEndsAt);
  const startDate = endDate.subtract(durationInDays, 'days');
  if (now.isAfter(endDate)) return 100;
  if (now.isBefore(startDate)) return 0;
  return (now.diff(startDate, 'minutes') / (durationInDays * 24 * 60)) * 100;
};

function PeriodProgress({ periodEndsAt, periodName }: { periodEndsAt?: Date; periodName: string }) {
  const progress = calculateDecisionProgress(periodEndsAt || null);
  const colorAccent = useThemeColor({}, "accent");
  
  return (
    <View style={styles.periodProgressContainer}>
      <View style={[styles.progressContainer, { backgroundColor: "white" }]}>
        <View style={{ width: `${progress}%`, backgroundColor: colorAccent, borderRadius: 8, height: "100%" }} />
      </View>
      <ThemedText type="bodyMedium3">{periodName}</ThemedText>
    </View>
  );
}

interface ProposalPeriodsProps {
  confirmationPeriodEndsAt?: Date;
  decisionPeriodEndsAt?: Date;
  preparePeriodEndsAt?: Date;
  status?: string;
}

const ProposalPeriodStatus = ({
  confirmationPeriodEndsAt,
  decisionPeriodEndsAt,
  preparePeriodEndsAt,
  status
}: ProposalPeriodsProps) => {
  // Simplified period checks
  const preparePeriodEnded = preparePeriodEndsAt ? dayjs(preparePeriodEndsAt).isBefore(dayjs()) : false;
  const decisionPeriodEnded = decisionPeriodEndsAt ? dayjs(decisionPeriodEndsAt).isBefore(dayjs()) : false;
  const confirmationPeriodEnded = confirmationPeriodEndsAt ? dayjs(confirmationPeriodEndsAt).isBefore(dayjs()) : false;

  const periodsEnded = [preparePeriodEnded, decisionPeriodEnded, confirmationPeriodEnded].filter((period) => period);
  const currentStep = periodsEnded.length + 1 > 3 ? 3 : periodsEnded.length + 1;

  // Simplified header text determination
  let headerText = 'Prepare Period';
  if (confirmationPeriodEnded) {
    headerText = status === 'Passed' || status === 'Executed' ? 'Proposal Passed' : 'Proposal Failed';
  } else if (decisionPeriodEnded) {
    headerText = 'Confirmation Period';
  } else if (preparePeriodEnded) {
    headerText = 'Voting has Started';
  }

  const colorStroke = useThemeColor({}, "mediumText");

  return (
    <ThemedView type="background" style={styles.container}>
      {/* Header with step text and step number */}
      <View style={styles.headerRow}>
        <ThemedText type="titleSmall">{headerText}</ThemedText>
        <View style={styles.stepContainer}>
          <ThemedText style={styles.stepNumber}>{currentStep}</ThemedText>
          <ThemedText style={{ color: colorStroke }}> of 3</ThemedText>
        </View>
      </View>
      
      {/* Progress sections */}
      {confirmationPeriodEnded ? null : preparePeriodEnded ? (
        <View style={styles.periodsContainer}>
          {decisionPeriodEndsAt && (
            <PeriodProgress
              periodEndsAt={decisionPeriodEndsAt}
              periodName="Decision Period"
            />
          )}
          {confirmationPeriodEndsAt && (
            <PeriodProgress
              periodEndsAt={confirmationPeriodEndsAt}
              periodName="Confirmation Period"
            />
          )}
        </View>
      ) : (
        <View>
          {preparePeriodEndsAt && (
            <PeriodProgress
              periodEndsAt={preparePeriodEndsAt}
              periodName="Prepare Period"
            />
          )}
        </View>
      )}
    </ThemedView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    borderRadius: 8,
    gap: 12,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  stepContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 2,
  },
  stepNumber: {
    backgroundColor: "#E5E5FD",
    paddingHorizontal: 5,
    borderRadius: 6,
  },
  periodsContainer: {
    gap: 24,
  },
  periodProgressContainer: {
    gap: 8,
  },
  progressContainer: {
    height: 8,
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 4,
  },
});

export default ProposalPeriodStatus;