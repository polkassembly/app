import React from 'react';
import { View, ViewStyle, TextStyle } from 'react-native';
import { ThemedText } from '../../../shared/text/ThemedText';

interface StatusTagProps {
	status?: string;
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
{ backgroundColor: string; borderColor: string; }
> = {
orange: { backgroundColor: '#D05704', borderColor: '#D05704' },
blue: { backgroundColor: '#3866CE', borderColor: '#3866CE' },
red: { backgroundColor: '#BD2020', borderColor: '#BD2020' },
green: { backgroundColor: '#478F37', borderColor: '#478F37' },
gray: { backgroundColor: '#666666', borderColor: '#666666' },
};

const StatusTag: React.FC<StatusTagProps> = ({ status, style }) => {
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
		backgroundColor: groupStyles[group].backgroundColor,
		borderColor: groupStyles[group].borderColor,
		borderWidth: 2,
		paddingHorizontal: 4,
		paddingVertical: 2,
		borderRadius: 4,
		alignItems: 'center',
		justifyContent: 'center',
	};

	const textStyle: TextStyle = {
		color: '#FFFFFF',
	};

	return (
		<View style={[containerStyle, style]}>
			<ThemedText type='bodySmall3' style={[textStyle]}>{statusText}</ThemedText>
		</View>
	);
};

export default StatusTag;
