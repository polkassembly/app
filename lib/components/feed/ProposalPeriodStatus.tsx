import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import dayjs from 'dayjs';
import { IStatusHistoryItem, Post } from '@/lib/types';
import { ThemedView } from '../ThemedView';
import { ThemedText } from '../ThemedText';
import { useThemeColor } from '@/lib/hooks/useThemeColor';
import { pascalToNormal } from '@/lib/util/stringUtil';

const getTimelineEvent = (timeline: IStatusHistoryItem[], status: string) => {
	return timeline?.find((e) => e.status === status);
};

const calcProgress = (start: dayjs.Dayjs, end: dayjs.Dayjs, now: dayjs.Dayjs) => {
	const total = end.diff(start);
	const elapsed = now.diff(start);
	let progress = (elapsed / total) * 100;
	if (progress < 0) progress = 0;
	if (progress > 100) progress = 100;
	return progress;
};

interface IAdditionalPeriod {
	text: string;
	start: dayjs.Dayjs;
	end: dayjs.Dayjs;
	progress: number;
}

interface ReferendumPeriodStatusProps {
	proposal: Post;
}

const ProposalPeriodStatus = ({ proposal }: ReferendumPeriodStatusProps) => {
	const { onChainInfo } = proposal;
	if (!onChainInfo) return null;

	const {
		createdAt,
		preparePeriodEndsAt,
		decisionPeriodEndsAt,
		confirmationPeriodEndsAt,
		status,
		timeline,
	} = onChainInfo;

	const now = dayjs();
	const createdTime = dayjs(createdAt);
	const prepareEnd = dayjs(preparePeriodEndsAt);
	const decisionEnd = dayjs(decisionPeriodEndsAt);
	const confirmationEnd = confirmationPeriodEndsAt ? dayjs(confirmationPeriodEndsAt) : null;

	// Variables to hold our display values.
	let displayStepText = '';
	let stepNumber = 1;
	let periodStart: dayjs.Dayjs = createdTime;
	let periodEnd: dayjs.Dayjs = prepareEnd;
	let periodProgress = 0;
	let additionalPeriod: IAdditionalPeriod | null = null;

	const timelineDeciding = timeline ? getTimelineEvent(timeline, 'Deciding') : null;
	const timelineConfirm = timeline ? getTimelineEvent(timeline, 'ConfirmStarted') : null;
	const isProposalPassed = ['Executed', 'Confirmed', 'Approved'].includes(status);
	const isProposalFailed = ['Rejected', 'TimedOut', 'Cancelled', 'Killed', 'ExecutionFailed'].includes(status);
	console.log("timelineDeciding", proposal.onChainInfo?.createdAt, proposal.onChainInfo?.preparePeriodEndsAt, proposal.onChainInfo?.decisionPeriodEndsAt)

	if (now.isBefore(prepareEnd) || !timeline) {
		// Still in Prepare Period
		displayStepText = 'Prepare Period';
		stepNumber = 1;
		periodStart = createdTime;
		periodEnd = prepareEnd;
		periodProgress = calcProgress(periodStart, periodEnd, now);
	} else if (now.isBefore(decisionEnd) && timelineDeciding) {
		// In Decision Period (Voting has started)
		displayStepText = 'Voting has Started';
		stepNumber = 2;
		periodStart = dayjs(timelineDeciding.timestamp);
		periodEnd = decisionEnd;
		periodProgress = calcProgress(periodStart, periodEnd, now);
		// If a confirmation event exists and confirmation period hasn't ended, show additional row.
		if (timelineConfirm && confirmationEnd && now.isBefore(confirmationEnd)) {
			additionalPeriod = {
				text: 'Confirmation Period',
				start: dayjs(timelineConfirm.timestamp),
				end: confirmationEnd,
				progress: calcProgress(dayjs(timelineConfirm.timestamp), confirmationEnd, now),
			};
		}
	} else {
		displayStepText = isProposalFailed ? "Proposal " + pascalToNormal(status) : isProposalPassed ? "Proposal " + pascalToNormal(status) : "Proposal Passed";
		stepNumber = 3;
	}

	const colorStroke = useThemeColor({}, "mediumText")
	const colorAccent = useThemeColor({}, "accent")

	return (
		<ThemedView type="background" style={styles.container}>
			{/* Row 1: Header with step text and step number */}
			<View style={styles.row}>
				<ThemedText type="titleSmall">{displayStepText}</ThemedText>
				<View style={{ flexDirection: 'row', alignItems: 'center', gap: 2 }}>
					<ThemedText style={{ color: colorStroke, backgroundColor: "#E5E5FD", paddingHorizontal: 5, borderRadius: 6 }}>Step {stepNumber}</ThemedText>
					<ThemedText style={{ color: colorStroke }}> of 3</ThemedText>
				</View>
			</View>

			{/* For non-finalized proposals, show the primary progress bar */}
			{stepNumber !== 3 && (
				<>
					<View style={{ flexDirection: "column" }}>
						<View style={[styles.progressContainer, { backgroundColor: "white" }]}>
							<View style={{ width: `${periodProgress}%`, backgroundColor: colorAccent, borderRadius: 8, height: "100%" }} />
						</View>
						<View style={styles.row}>
							<Text style={{ color: colorStroke }}>{displayStepText}</Text>
							<Text style={{ color: colorStroke }}>
								{periodEnd.diff(now, 'days')} days
							</Text>
						</View>
					</View>

					{/* Row 4: Additional confirmation period if applicable */}
					{additionalPeriod && (
						<View style={{ flexDirection: "column" }}>
							<View style={[styles.progressContainer, { backgroundColor: "white" }]}>
								<View style={{ width: `${additionalPeriod.progress}%`, backgroundColor: colorAccent, borderRadius: 8, height: "100%" }} />
							</View>
							<View style={styles.row}>
								<Text style={{ color: colorStroke }}>{additionalPeriod.text}</Text>
								<Text style={{ color: colorStroke }}>
									{additionalPeriod.end.diff(now, 'days')} days
								</Text>
							</View>
						</View>
					)}
				</>
			)}

			{
				stepNumber === 3 && isProposalFailed && (
					<View >
						<ThemedText>The approval was lesser than the threshold for this track.</ThemedText>
					</View>
				)
			}
		</ThemedView>
	);
};

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
