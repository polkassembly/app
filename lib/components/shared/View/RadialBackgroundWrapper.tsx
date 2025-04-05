import { PropsWithChildren } from "react";
import Svg, { Defs, RadialGradient, Stop, Ellipse } from "react-native-svg";
import { Colors } from "react-native/Libraries/NewAppScreen";
import { ThemedView } from "../../ThemedView";

const RadialBackgroundWrapper = ({ children }: PropsWithChildren) => {
  return (
    <ThemedView type="secondaryBackground">
      <RadialBackgroundSVG />
      {children}
    </ThemedView>
  );
}

const RadialBackgroundSVG = () => {
  return (
    <Svg
        viewBox="0 0 10 10"
        style={{
          zIndex: 0,
          position: "absolute",
          top: 0,
          width: "100%",
          height: "100%",
        }}
      >
        <Defs>
          <RadialGradient id="grad">
            <Stop offset="0" stopColor={Colors.dark.ctaStroke} stopOpacity={1} />
            <Stop offset="1" stopColor={Colors.dark.ctaStroke} stopOpacity={0} />
          </RadialGradient>
        </Defs>
        <Ellipse cx="5" cy="40" rx="40" ry="40" fill="url(#grad)" />
      </Svg>
  )
}

export default RadialBackgroundWrapper;