import { ThemedText } from "@/lib/components/shared/text";
import { EPostOrigin } from "@/lib/types/post";
import { getOriginBadgeStyle } from "@/lib/util";
import { StyleSheet } from "react-native";

const formatOriginText = (text: string): string => {
	return text.replace(/([A-Z])/g, " $1").trim();
};

function OriginBadge({ origin }: { origin: EPostOrigin }) {
	return (
		<ThemedText
			type="bodySmall3"
			style={[styles.originBadge, getOriginBadgeStyle(origin)]}
		>
			{formatOriginText(origin)}
		</ThemedText>
	);
}

const styles = StyleSheet.create({
	originBadge: {
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 4,
  },
})

export default OriginBadge;