import React from "react";
import { Image, ImageSourcePropType } from "react-native";
import { openBrowserAsync } from "expo-web-browser";
import { ThemedView } from "@/lib/components/ThemedView";
import { ThemedText } from "@/lib/components/ThemedText";
import ThemedButton from "@/lib/components/ThemedButton";
import { Colors } from "@/lib/constants/Colors";

export interface QuickActionCardProps {
  title: string;
  subtitle: string;
  url: string;
  imageSource: ImageSourcePropType;
  button: string;
}

const QuickActionCard: React.FC<QuickActionCardProps> = ({
  title,
  subtitle,
  url,
  imageSource,
  button,
}) => {
  return (
    <ThemedView
      type="secondaryBackground"
      style={{
        borderWidth: 1,
        borderColor: "#383838",
        paddingVertical: 16,
        paddingHorizontal: 20,
        shadowColor: "#F100861A",
        shadowRadius: 10,
        shadowOffset: {
          width: 1,
          height: 0,
        },
        borderRadius: 8,
        alignItems: "center",
        alignSelf: "center",
				maxWidth: 200,
      }}
    >
      <ThemedText type="bodySmall4" style={{ textTransform: "uppercase", color: Colors.dark.mediumText }}>
        {title}
      </ThemedText>
      <Image style={{ marginTop: 23, flexGrow: 1, flexBasis: 0}} resizeMode="contain" source={imageSource} />
      <ThemedText type="bodySmall3" style={{ textAlign: "center", marginTop: 16 }}>
        {subtitle}
      </ThemedText>
      <ThemedButton
        style={{ backgroundColor: "white", alignSelf: "stretch", padding: 4, borderRadius: 8, marginTop: 18 }}
        textStyle={{ color: "black" }}
        textType="bodySmall3"
        text={button}
        onPress={() => openBrowserAsync(url)}
      />
    </ThemedView>
  );
};

export default QuickActionCard;
