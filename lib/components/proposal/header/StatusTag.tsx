import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { ThemedText } from '../../ThemedText';

interface StatusTagProps {
	status?: string;
	colorInverted?: boolean;
	style?: ViewStyle;
}

// JSON object for status texts
const ProposalStatusTexts: { [key: string]: string } = {
	cancelled: "Cancelled",
	timedout: "Timed Out",
	confirmed: "Confirmed",
	approved: "Approved",
	rejected: "Rejected",
	executed: "Executed",
	killed: "Killed",
	executionfailed: "Execution Failed",
	decisiondepositplaced: "Decision Deposit Placed",
	deciding: "Deciding",
	confirmstarted: "Confirm Started",
	confirmaborted: "Confirm Aborted",
	opened: "Opened",
	retracted: "Retracted",
	slashed: "Slashed",
	active: "Active",
	extended: "Extended",
	claimed: "Claimed",
	unrequested: "Unrequested",
	requested: "Requested",
	submitted: "Submitted",
	cleared: "Cleared",
	voting: "Voting",
	votingended: "Voting Ended",
	votingstarted: "Voting Started",
	invalid: "Invalid",
	missing: "Missing",
	reaped: "Reaped",
	disapproved: "Disapproved",
	closed: "Closed",
	awarded: "Awarded",
	added: "Added",
	notpassed: "Not Passed",
	started: "Started",
	passed: "Passed",
	proposed: "Proposed",
	created: "Created"
};

// Map groups to their color styles
const groupStyles: Record<
string,
{ backgroundColor: string; borderColor: string; textColor: string }
> = {
orange: { backgroundColor: '#F97316', borderColor: '#F97316', textColor: '#FFFFFF' },
blue: { backgroundColor: '#3B82F6', borderColor: '#3B82F6', textColor: '#FFFFFF' },
red: { backgroundColor: '#EF4444', borderColor: '#EF4444', textColor: '#FFFFFF' },
green: { backgroundColor: '#22C55E', borderColor: '#22C55E', textColor: '#FFFFFF' },
gray: { backgroundColor: '#666666', borderColor: '#666666', textColor: '#FFFFFF' },
};

const StatusTag: React.FC<StatusTagProps> = ({ status, colorInverted, style }) => {
	// Normalize the status string (lowercase and underscores)
	const normalizedStatus = status ? status.toLowerCase().replace(/\s+/g, '_') : '';

	// Determine color group
	let group = 'blue';
	if (['deciding', 'active', 'extended', 'decisiondepositplaced'].includes(normalizedStatus)) {
		group = 'orange';
	} else if (['created', 'submitted', 'proposed', 'confirmstarted'].includes(normalizedStatus)) {
		group = 'blue';
	} else if (['killed', 'rejected', 'cancelled', 'timedout', 'executionfailed', 'confirmaborted'].includes(normalizedStatus)) {
		group = 'red';
	} else if (['confirmed', 'claimed', 'executed'].includes(normalizedStatus)) {
		group = 'green';
	} else if (['curatorunassigned'].includes(normalizedStatus)) {
		group = 'gray';
	}

	const statusText = ProposalStatusTexts[normalizedStatus] || status || '';

	const containerStyle: ViewStyle = {
		backgroundColor: colorInverted ? '#FFFFFF' : groupStyles[group].backgroundColor,
		borderColor: groupStyles[group].borderColor,
		borderWidth: 2,
		paddingHorizontal: 4,
		paddingVertical: 2,
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
	};

	const textStyle: TextStyle = {
		color: colorInverted ? '#4B5563' : groupStyles[group].textColor,
	};

	return (
		<View style={[containerStyle, style]}>
			<ThemedText type='bodySmall3' style={[textStyle]}>{statusText}</ThemedText>
		</View>
	);
};

export default StatusTag;
