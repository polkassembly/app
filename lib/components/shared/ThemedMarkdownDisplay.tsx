import React, { memo, useMemo } from 'react';
import Markdown from 'react-native-markdown-display';
import { ColorName, useThemeColor } from "@/lib/hooks/useThemeColor";
import { bgColors, Colors } from "@/lib/constants/Colors";
import { TextStyle } from 'react-native';

interface ThemedMarkdownDisplayProps {
  content: string;
  textColor?: ColorName;
}

const ThemedMarkdownDisplay = ({
  content,
  textColor = "text",
}: ThemedMarkdownDisplayProps) => {

  if (!content) return null;

  // Retrieve theme colors using our hook
  const colorText = useThemeColor({}, textColor);
  const accentColor = useThemeColor({}, "accent");
  const codeBlockColor = useThemeColor({}, "background");


  // Memoize markdown styles to prevent unnecessary recalculations
  const markdownStyles = useMemo(() => ({
    body: {
      color: colorText,
      backgroundColor: "transparent",
    },
    paragraph: {
      color: colorText,
      fontSize: 14,
      marginBottom: 8,
      marginTop: 0,
    },
    // Headings
    heading1: {
      color: colorText,
      fontSize: 24,
      marginBottom: 12,
      fontWeight: 'bold',
    },
    heading2: {
      color: colorText,
      fontSize: 20,
      marginBottom: 10,
      fontWeight: 'bold',
    },
    heading3: {
      color: colorText,
      fontSize: 18,
      marginBottom: 8,
      fontWeight: 'bold',
    },
    heading4: {
      color: colorText,
      fontSize: 16,
      marginBottom: 6,
      fontWeight: 'bold',
    },
    heading5: {
      color: colorText,
      fontSize: 14,
      marginBottom: 4,
      fontWeight: 'bold',
    },
    heading6: {
      color: colorText,
      fontSize: 12,
      marginBottom: 2,
      fontWeight: 'bold',
    },
    // Links
    link: {
      color: accentColor,
      textDecorationLine: "underline" as TextStyle["textDecorationLine"],
      backgroundColor: "transparent",
    },
    // Blockquote
    blockquote: {
      color: colorText,
      borderLeftWidth: 4,
      borderLeftColor: accentColor,
      paddingLeft: 8,
      marginVertical: 8,
    },
    // Inline code
    code_inline: {
      color: colorText,
      fontFamily: 'monospace',
      backgroundColor: codeBlockColor,
      padding: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
    },
    // Code block (fenced)
    code_block: {
      color: colorText,
      fontFamily: 'monospace',
      backgroundColor: codeBlockColor,
      padding: 8,
      borderRadius: 4,
      marginVertical: 8,
    },
    fence: {
      color: colorText,
      fontFamily: 'monospace',
      backgroundColor: codeBlockColor,
      padding: 8,
      borderRadius: 4,
      marginVertical: 8,
    },
    // Horizontal rule
    hr: {
      borderBottomColor: accentColor,
      borderBottomWidth: 1,
      marginVertical: 8,
    },
    // Lists
    list_item: {
      color: colorText,
      fontSize: 14,
      marginBottom: 4,
    },
    bullet_list: {
      marginVertical: 4,
      marginLeft: 16,
    },
    ordered_list: {
      marginVertical: 4,
      marginLeft: 16,
    },
    // Text styling
    strong: {
      fontWeight: 'bold' as TextStyle["fontWeight"],
    },
    em: {
      fontStyle: "italic" as TextStyle["fontStyle"],
    },
    s: {
      textDecorationLine: 'line-through' as TextStyle["textDecorationLine"],
    },

    // Table styling
    table: {
      borderWidth: 1,
      borderColor: accentColor,
      marginVertical: 8,
    },
    table_row: {
      borderBottomWidth: 1,
      borderColor: accentColor,
    },
    table_cell: {
      padding: 8,
      borderRightWidth: 1,
      borderColor: accentColor,
    },
    table_header: {
      padding: 8,
      borderRightWidth: 1,
      borderColor: accentColor,
      fontWeight: 'bold',
      backgroundColor: "transparent",
    },
  }), [colorText, accentColor, codeBlockColor]);

  return (
    <Markdown style={markdownStyles}>
      {content}
    </Markdown>
  );
}

export default memo(ThemedMarkdownDisplay);
