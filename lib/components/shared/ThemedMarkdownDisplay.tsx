import React, { memo, useMemo } from 'react';
import Markdown from 'react-native-markdown-display';
import { ColorName, useThemeColor } from "@/lib/hooks/useThemeColor";
import { TextStyle, View, Text, ViewStyle, ImageStyle } from 'react-native';

interface ThemedMarkdownDisplayProps {
  content: string;
  textColor?: ColorName;
  accentColor?: ColorName;
  codeBackgroundColor?: ColorName;
  fontSize?: {
    base?: number;
    heading1?: number;
    heading2?: number;
    heading3?: number;
    heading4?: number;
    heading5?: number;
    heading6?: number;
  };
}

const ThemedMarkdownDisplay = ({
  content,
  textColor = "text",
  accentColor = "accent",
  codeBackgroundColor = "background",
  fontSize = {
    base: 14,
    heading1: 24,
    heading2: 20,
    heading3: 18,
    heading4: 16,
    heading5: 14,
    heading6: 12,
  },
}: ThemedMarkdownDisplayProps) => {
  if (!content) return null;

  // Retrieve theme colors using our hook
  const colorText = useThemeColor({}, textColor);
  const colorAccent = useThemeColor({}, accentColor);
  const colorCodeBackground = useThemeColor({}, codeBackgroundColor);

  // Extract font sizes with defaults
  const baseFontSize = fontSize.base || 14;
  const h1FontSize = fontSize.heading1 || 24;
  const h2FontSize = fontSize.heading2 || 20;
  const h3FontSize = fontSize.heading3 || 18;
  const h4FontSize = fontSize.heading4 || 16;
  const h5FontSize = fontSize.heading5 || 14;
  const h6FontSize = fontSize.heading6 || 12;

  // Memoize markdown styles to prevent unnecessary recalculations
  const markdownStyles = useMemo(() => ({
    body: {
      color: colorText,
      backgroundColor: "transparent",
      fontSize: baseFontSize,
      fontFamily: 'PoppinsRegular',
    } as TextStyle,
    paragraph: {
      color: colorText,
      fontSize: baseFontSize,
      marginBottom: 8,
      marginTop: 0,
      lineHeight: baseFontSize * 1.65,
      fontFamily: 'PoppinsRegular',
      fontWeight: 100,
    } as TextStyle,

    // Headings
    heading1: {
      color: colorText,
      fontSize: h1FontSize,
      marginBottom: 12,
      fontWeight: 'bold',
      lineHeight: h1FontSize * 1.3,
      fontFamily: 'PoppinsSemiBold',
    } as TextStyle,
    heading2: {
      color: colorText,
      fontSize: h2FontSize,
      marginBottom: 10,
      fontWeight: 'bold',
      lineHeight: h2FontSize * 1.3,
      fontFamily: 'PoppinsSemiBold',
    } as TextStyle,
    heading3: {
      color: colorText,
      fontSize: h3FontSize,
      marginBottom: 8,
      fontWeight: 'bold',
      lineHeight: h3FontSize * 1.3,
      fontFamily: 'PoppinsSemiBold',
    } as TextStyle,
    heading4: {
      color: colorText,
      fontSize: h4FontSize,
      marginBottom: 6,
      fontWeight: 'bold',
      lineHeight: h4FontSize * 1.3,
      fontFamily: 'PoppinsMedium',
    } as TextStyle,
    heading5: {
      color: colorText,
      fontSize: h5FontSize,
      marginBottom: 4,
      fontWeight: 'bold',
      lineHeight: h5FontSize * 1.3,
      fontFamily: 'PoppinsMedium',
    } as TextStyle,
    heading6: {
      color: colorText,
      fontSize: h6FontSize,
      marginBottom: 2,
      fontWeight: 'bold',
      lineHeight: h6FontSize * 1.3,
      fontFamily: 'PoppinsMedium',
    } as TextStyle,

    // Links
    link: {
      color: colorAccent,
      textDecorationLine: "underline",
      fontFamily: 'PoppinsRegular',
    } as TextStyle,

    // Blockquote
    blockquote: {
      color: colorText,
      borderLeftWidth: 4,
      borderLeftColor: colorAccent,
      paddingLeft: 8,
      marginVertical: 8,
      opacity: 0.8,
      backgroundColor: colorCodeBackground,
    } as ViewStyle,

    // Inline code
    code_inline: {
      color: colorText,
      fontFamily: 'SpaceMono',
      backgroundColor: colorCodeBackground,
      padding: 4,
      paddingHorizontal: 8,
      borderRadius: 4,
    } as TextStyle,

    // Code block (fenced)
    code_block: {
      color: colorText,
      fontFamily: 'SpaceMono',
      backgroundColor: colorCodeBackground,
      padding: 8,
      borderRadius: 4,
      marginVertical: 8,
    } as TextStyle,
    fence: {
      color: colorText,
      fontFamily: 'SpaceMono',
      backgroundColor: colorCodeBackground,
      padding: 8,
      borderRadius: 4,
      marginVertical: 8,
    } as TextStyle,

    // Horizontal rule
    hr: {
      borderBottomColor: colorAccent,
      borderBottomWidth: 1,
      marginVertical: 16,
    } as ViewStyle,

    // Lists
    list_item: {
      color: colorText,
      fontSize: baseFontSize,
      marginBottom: 4,
      flexDirection: 'row' as ViewStyle["flexDirection"],
      fontFamily: 'PoppinsRegular',
    } as TextStyle & ViewStyle,
    bullet_list: {
      marginVertical: 8,
      marginLeft: 16,
    } as ViewStyle,
    ordered_list: {
      marginVertical: 8,
      marginLeft: 16,
    } as ViewStyle,

    // Text styling
    strong: {
      fontWeight: 'bold',
      fontFamily: 'PoppinsSemiBold',
    } as TextStyle,
    em: {
      fontStyle: "italic",
      fontFamily: 'PoppinsRegular',
    } as TextStyle,
    s: {
      textDecorationLine: 'line-through',
      fontFamily: 'PoppinsRegular',
    } as TextStyle,

    // Table styling
    table: {
      borderWidth: 1,
      borderColor: colorAccent,
      marginVertical: 12,
      borderRadius: 4,
      overflow: 'hidden',
    } as ViewStyle,
    table_row: {
      borderBottomWidth: 1,
      borderColor: colorAccent,
      flexDirection: 'row' as ViewStyle["flexDirection"],
    } as ViewStyle,
    table_cell: {
      padding: 8,
      borderRightWidth: 1,
      borderColor: colorAccent,
      flex: 1,
      fontFamily: 'PoppinsRegular',
    } as TextStyle & ViewStyle,
    thead: {
      backgroundColor: colorCodeBackground,
      borderBottomWidth: 2,
      borderColor: colorAccent,
    } as ViewStyle,
    table_header_cell: {
      padding: 8,
      borderRightWidth: 1,
      borderColor: colorAccent,
      fontWeight: 'bold',
      flex: 1,
      fontFamily: 'PoppinsSemiBold',
    } as TextStyle & ViewStyle,

    // Custom mention style
    mention_container: {
      flexDirection: 'row' as ViewStyle["flexDirection"],
      alignItems: 'center' as ViewStyle["alignItems"],
      backgroundColor: colorCodeBackground,
      borderRadius: 4,
      paddingHorizontal: 8,
      paddingVertical: 2,
      marginVertical: 2,
      alignSelf: 'flex-start' as ViewStyle["alignSelf"],
    } as ViewStyle,
    mention: {
      color: colorAccent,
      fontWeight: 'bold',
      fontSize: baseFontSize,
      fontFamily: 'PoppinsMedium',
    } as TextStyle,
  }), [colorText, colorAccent, colorCodeBackground, baseFontSize, h1FontSize, h2FontSize, h3FontSize, h4FontSize, h5FontSize, h6FontSize]);

  return (
    <Markdown
      style={markdownStyles}
    >
      {content}
    </Markdown>
  );
}

export default memo(ThemedMarkdownDisplay);