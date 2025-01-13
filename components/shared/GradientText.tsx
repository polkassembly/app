import React from "react";
import { Text, TextStyle } from "react-native";
import MaskedView from "@react-native-masked-view/masked-view";
import { LinearGradient } from "expo-linear-gradient";

interface GradientTextProps {
  text: string;
  style?: TextStyle;
  colors?: [string, string, ...string[]];
  locations?: [number, number, ...number[]];
}

function GradientText({
  text,
  style,
  colors = ["#D556FF", "#FFFFFF", "#D556FF"],
  locations = [0, 0.52, 1],
}: GradientTextProps) {
  return <Text style={style}>{text}</Text>;

  /* 
   * FIXME: MaskedView library is either buggy or not used correctly here,
   * as it crashes in release builds.
   * We skip rendering gradient as a dirty fix. Investigate in future.
   */
  return (
    <MaskedView maskElement={<Text style={style}>{text}</Text>}>
      <LinearGradient
        colors={colors}
        locations={locations}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={[style, { opacity: 0 }]}>{text}</Text>
      </LinearGradient>
    </MaskedView>
  );
}

export default GradientText;
