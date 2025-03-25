import React, { memo, useMemo } from 'react';
import Markdown from 'react-native-markdown-display';
import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { Colors } from "@/lib/constants/Colors";

type ColorName = keyof typeof Colors.dark & keyof typeof Colors.light;
interface ThemedMarkdownDisplayProps {
	content: string;
	backgroundColor?: ColorName;
}

const ThemedMarkdownDisplay = ({
	content,
	backgroundColor = "secondaryBackground"
}: ThemedMarkdownDisplayProps) => {

	if (!content) return null;
	console.log("content", content)

	const colorText = useThemeColor({}, "text");

	// Memoize markdown styles
	const markdownStyles = useMemo(() => ({
		body: {
			color: colorText,
			backgroundColor: backgroundColor,
		},
		paragraph: {
			color: colorText,
			fontSize: 12,
			marginBottom: 8,
			marginTop: 0,
		},
		heading1: {
			color: colorText,
			fontSize: 16,
			marginBottom: 8,
			fontWeight: 'bold',
		},
		heading2: {
			color: colorText,
			fontSize: 14,
			marginBottom: 6,
			fontWeight: 'bold',
		},
		heading3: {
			color: colorText,
			fontSize: 12,
			marginBottom: 4,
			fontWeight: 'bold',
		},
		link: {
			color: Colors.dark.accent,
			textDecorationLine: "underline" as "underline",
		},
	}), [colorText, backgroundColor]);

	return (
		<Markdown style={markdownStyles}>
			{content}
		</Markdown>
	);
}

export default memo(ThemedMarkdownDisplay);