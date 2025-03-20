import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { forwardRef } from "react";
import { TouchableOpacity, View, ViewProps, ViewStyle } from "react-native";
import { ThemedText } from "../ThemedText";
import { useSafeAreaInsets } from "react-native-safe-area-context";

interface ButtonButtonProps {
  onPress?: () => void;
  style?: ViewStyle;
  containerProps?: ViewProps;
  children: string;
}

const BottomButton = forwardRef<View, ButtonButtonProps>(
  ({ onPress, containerProps, style, children }: ButtonButtonProps, ref) => {
    const colorStroke = useThemeColor({}, "stroke");
    const insets = useSafeAreaInsets();

    return (
      <View
        ref={ref}
        {...containerProps}
        style={[
          {
            width: "110%",
            paddingInline: 16,
            paddingBlock: 21,
            left: "-5%",
            position: "sticky",
            bottom: insets.bottom,
            borderTopStartRadius: "100%",
            borderTopEndRadius: "100%",
            borderWidth: 1,
            borderBottomWidth: 0,
            borderColor: colorStroke,
            backgroundColor: "#000000",
          },
          style,
        ]}
      >
        <TouchableOpacity onPress={onPress}>
          <ThemedText colorName="ctaText" style={{ textAlign: "center" }}>
            {children}
          </ThemedText>
        </TouchableOpacity>
      </View>
    );
  }
);

export default BottomButton;
