import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { forwardRef } from "react";
import {
  ActivityIndicator,
  TouchableOpacity,
  TouchableOpacityProps,
  View,
  ViewProps,
  ViewStyle,
} from "react-native";
import { ThemedText } from "../text";
import Svg, { Defs, LinearGradient, Stop, Ellipse } from "react-native-svg";

interface BottomButtonProps extends TouchableOpacityProps {
  containerStyle?: ViewStyle;
  children: string;
  loading?: boolean;
}

const BottomButton = forwardRef<View, BottomButtonProps>(
  ({ containerStyle, children, loading, ...touchableProps }, ref) => {
    const accentColor = useThemeColor({}, "accent");

    return (
      <View
        ref={ref}
        style={[
          {
            paddingHorizontal: 16,
            position: "sticky",
            bottom: 0,
          },
          containerStyle,
        ]}
      >
        <TouchableOpacity {...touchableProps} style={[{ paddingVertical: 24 }, touchableProps.style]}>
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0 }}>
            <TabBarBackground />
          </View>

          {
            loading ? (
              <ActivityIndicator
                color={accentColor}
              />
            ) :
              <ThemedText colorName="ctaText" style={{ textAlign: "center" }}>
                {children}
              </ThemedText>
          }
        </TouchableOpacity>
      </View>
    );
  }
);

function TabBarBackground() {
  return (
    <Svg width={"100%"} height={"100%"} fill={"transparent"} style={{ zIndex: 0 }}>
      <Defs>
        <LinearGradient id="borderGradient" x1="100%" y1="0%" x2="0%" y2="0%">
          <Stop offset="9.13%" stopColor="#000000" />
          <Stop offset="50.62%" stopColor="#666666" />
          <Stop offset="88.92%" stopColor="#000000" />
        </LinearGradient>
      </Defs>
      <Ellipse
        fill="#000000"
        stroke="url(#borderGradient)"
        strokeWidth={1}
        cx="50%"
        cy={250 / 2}
        rx={660 / 2}
        ry={250 / 2}
      />
    </Svg>
  );
}

export default BottomButton;
