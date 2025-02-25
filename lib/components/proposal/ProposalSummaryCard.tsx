import { ContentSummary, EProposalType } from "@/lib/types";
import { ContainerType, ThemedView } from "../ThemedView";
import { StyleSheet } from "react-native";
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { ThemedText } from "../ThemedText";
import { useContentSummary } from "@/lib/net/queries/post";
import Markdown from "react-native-markdown-display";
import { trimText } from "@/lib/util/stringUtil";

interface ProposalContentSummaryProps {
	proposalType: EProposalType;
	indexOrHash: string;
	containerType?: ContainerType;
}

function ProposalContentSummary({ proposalType, indexOrHash, containerType = "container" }: ProposalContentSummaryProps) {
	const colorStroke = useThemeColor({}, "stroke")
	const colorText = useThemeColor({}, "text")
	const { data: contentSummary, isLoading, isError } = useContentSummary({ proposalType, indexOrHash });

	if (isLoading) {
		return (
			<ThemedView style={[styles.container, { borderColor: colorStroke }]} type={containerType}>
				<ThemedText type="titleMedium">Content Summary</ThemedText>
				<ThemedText type="bodySmall">Loading content summary...</ThemedText>
			</ThemedView>
		)
		
	}

	if (isError || !contentSummary) {
		return (
			<ThemedView style={[styles.container, { borderColor: colorStroke }]} type={containerType}>
				<ThemedText type="titleMedium">Content Summary</ThemedText>
				<ThemedText type="bodySmall">Error loading content summary</ThemedText>
			</ThemedView>
		)
	}

	return (
		<ThemedView style={[styles.container, { borderColor: colorStroke }]} type={containerType}>
			<ThemedText type="titleMedium">Content Summary</ThemedText>
			<Markdown style={{ body: { color: colorText } }}>{trimText(contentSummary.postSummary || "", 500)}</Markdown>
		</ThemedView>
	)
}

const styles = StyleSheet.create({
	container: {
		width: "100%",
		padding: 12,
		gap: 12,
		borderRadius: 12,
		borderWidth: 1,
		overflow: "hidden",
		flexDirection: "column",
	}
})

export default ProposalContentSummary;