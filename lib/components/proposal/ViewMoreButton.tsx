import { Link } from "expo-router";
import { IconViewMore } from "../icons/shared";
import ThemedButton from "../ThemedButton";
import { ThemedText } from "../ThemedText";
import { StyleSheet } from "react-native";

interface ViewMoreButtonProps {
	index: number | string;
	proposalType: string;
}

function ViewMoreButton({ index, proposalType }: ViewMoreButtonProps) {
	return (
		<Link href={`/proposal/${index}?proposalType=${proposalType}`} asChild>
			<ThemedButton bordered style={styles.viewMoreButton}>
				<ThemedText type="bodySmall" colorName="accent">
					View More
				</ThemedText>
				<IconViewMore />
			</ThemedButton>
		</Link>
	);
}

const styles = StyleSheet.create({
	viewMoreButton: {
		borderRadius: 5,
		padding: 0,
		height: 40,
		flexDirection: "row",
		gap: 10,
	}
})

export default ViewMoreButton;