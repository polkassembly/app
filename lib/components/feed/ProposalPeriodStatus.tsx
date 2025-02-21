import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { IStatusHistoryItem, Post } from '@/lib/types';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '@/lib/hooks/useThemeColor';
import { pascalToNormal } from '@/lib/util/stringUtil';

export const calculateDecisionProgress = (decisionPeriodEndsAt: Date | string | null, durationInDays: number = 28) => {
	if (!decisionPeriodEndsAt) return 0;
	const now = dayjs();
	const endDate = dayjs(decisionPeriodEndsAt);
	const startDate = endDate.subtract(durationInDays, 'days');
	if (now.isAfter(endDate)) return 100;
	if (now.isBefore(startDate)) return 0;
	return (now.diff(startDate, 'minutes') / (durationInDays * 24 * 60)) * 100;
};


interface ReferendumPeriodStatusProps {
	proposal: Post;
}

const ProposalPeriodStatus = ({ proposal }: ReferendumPeriodStatusProps) => {
	const { onChainInfo } = proposal;
	if (!onChainInfo) return null;

	const {
		preparePeriodEndsAt,
		decisionPeriodEndsAt,
		confirmationPeriodEndsAt,
		status,
	} = onChainInfo;

	const now = dayjs();
	const preparePeriodEnded = preparePeriodEndsAt ? dayjs(preparePeriodEndsAt).isBefore(dayjs()) : false;
	const decisionPeriodEnded = decisionPeriodEndsAt ? dayjs(decisionPeriodEndsAt).isBefore(dayjs()) : false;
	const confirmationPeriodEnded = confirmationPeriodEndsAt ? dayjs(confirmationPeriodEndsAt).isBefore(dayjs()) : false;

	const periodsEnded = [preparePeriodEnded, decisionPeriodEnded, confirmationPeriodEnded].filter((period) => period);

	const StepText =
		confirmationPeriodEnded
			? status === 'Passed' || status === 'Executed'
				? 'Proposal Passed'
				: 'Proposal Failed'
			: decisionPeriodEnded
				? 'Confirmation Period'
				: preparePeriodEnded
					? 'Voting has Started'
					: 'Prepare Period';

	const colorStroke = useThemeColor({}, "mediumText")

	return (
		<ThemedView type="background" style={styles.container}>
			{/* Row 1: Header with step text and step number */}
			<View style={styles.row}>
				<ThemedText type="titleSmall">{StepText}</ThemedText>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
					<ThemedText style={{ color: colorStroke, backgroundColor: "#E5E5FD", paddingHorizontal: 5, borderRadius: 6 }}>Step {periodsEnded.length + 1}</ThemedText>
					<ThemedText style={{ color: colorStroke }}> of 3</ThemedText>
				</View>
			</View>
			{confirmationPeriodEnded ? null : preparePeriodEnded ? (
				<View className='flex flex-col gap-y-6'>
					{
						decisionPeriodEndsAt && (
							<PeriodProgress
								periodEndsAt={new Date(decisionPeriodEndsAt)}
								periodName={"Voting Period"}
							/>
						)
					}
					{
						confirmationPeriodEndsAt && (
							<PeriodProgress
								periodEndsAt={new Date(confirmationPeriodEndsAt)}
								periodName={"Confirmation Period"}
							/>
						)
					}
				</View>
			) : (
				<View>
					{
						preparePeriodEndsAt && (
							<PeriodProgress
								periodEndsAt={new Date(preparePeriodEndsAt)}
								periodName={"Prepare Period"}
							/>
						)
					}
				</View>
			)}
		</ThemedView>
	);
};

function PeriodProgress({ periodEndsAt, periodName }: { periodEndsAt: Date, periodName: string }) {
	const now = dayjs();
	const periodEnd = dayjs(periodEndsAt);
	const progress = calculateDecisionProgress(periodEndsAt);

	const colorAccent = useThemeColor({}, "accent");
	const colorStroke = useThemeColor({}, "mediumText")

	return (
		<View style={{ flexDirection: "column" }}>
			<View style={[styles.progressContainer, { backgroundColor: "white" }]}>
				<View style={{ width: `${progress}%`, backgroundColor: colorAccent, borderRadius: 8, height: "100%" }} />
			</View>
			<View style={styles.row}>
				<ThemedText type="bodyMedium3">{periodName}</ThemedText>
				<ThemedText style={{ color: colorStroke }}>
					{periodEnd.diff(now, 'days')} days
				</ThemedText>
			</View>
		</View>
	);
}

const styles = StyleSheet.create({
	container: {
		padding: 16,
		borderRadius: 8,
		gap: 12,
	},
	row: {
		flexDirection: 'row',
		justifyContent: 'space-between',
		alignItems: 'center',
		marginBottom: 8,
	},
	stepNumber: {
		fontSize: 16,
		color: '#555',
	},
	progressContainer: {
		height: 8,
		borderRadius: 5,
		overflow: 'hidden',
		marginBottom: 8,
	},
	periodLabel: {
		fontSize: 14,
		color: '#333',
	},
	periodRange: {
		fontSize: 12,
		color: '#555',
	},
	finalStatusContainer: {
		marginTop: 16,
	},
	finalStatusText: {
		fontSize: 16,
		fontWeight: 'bold',
		color: '#E5007A',
		textAlign: 'center',
	},
});

export default ProposalPeriodStatus;
