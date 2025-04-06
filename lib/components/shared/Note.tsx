import { View } from "react-native";
import IconInfo from "../icons/shared/icon-info";
import { ThemedText } from "./text/ThemedText";

interface NoteProps {
  content: string;
  textColor?: string;
  iconColor?: string;
  iconSize?: number;
  bgColor?: string;
}

export default function Note({ iconColor, iconSize, content, textColor, bgColor }: NoteProps) {
  return (
    <View
      style={{
        backgroundColor: bgColor || "#002C4F",
        padding: 8,
        borderRadius: 8,
        flexDirection: "row",
        flexWrap: "wrap",
        alignItems: "center",
        gap: 10,
      }}
    >
      <IconInfo color={iconColor} iconWidth={iconSize} iconHeight={iconSize} />
      <ThemedText type="bodySmall3" style={{ flex: 1, color: textColor || "#FFFFFF" }}>
        {content}
      </ThemedText>
    </View>
  );
}