import React, { memo, useEffect, useRef } from "react";
import { Animated, Easing, ViewStyle } from "react-native";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

const IconTwinkleAnimated = ({ style, color, iconWidth, iconHeight }: IconProps) => {
  const opacity = useRef(new Animated.Value(1)).current;
  const scale = useRef(new Animated.Value(1)).current;

  useEffect(() => {
		const delay = Math.random() * 1000; // Initial random delay before loop starts
		const duration = 400;
	
		const animation = Animated.loop(
			Animated.parallel([
				Animated.sequence([
					Animated.timing(opacity, {
						toValue: 0.3,
						duration,
						delay,
						useNativeDriver: true,
						easing: Easing.inOut(Easing.ease),
					}),
					Animated.delay(1000), // Stay invisible for 1 second
					Animated.timing(opacity, {
						toValue: 1,
						duration,
						useNativeDriver: true,
						easing: Easing.inOut(Easing.ease),
					}),
				]),
				Animated.sequence([
					Animated.timing(scale, {
						toValue: 0.8,
						duration,
						delay,
						useNativeDriver: true,
						easing: Easing.inOut(Easing.ease),
					}),
					Animated.delay(1000), // Keep scale in sync with opacity
					Animated.timing(scale, {
						toValue: 1,
						duration,
						useNativeDriver: true,
						easing: Easing.inOut(Easing.ease),
					}),
				]),
			])
		);
	
		animation.start();
		return () => animation.stop();
	}, []);
	
  return (
    <Animated.View
      style={[
        {
          opacity,
          transform: [{ scale }],
        },
        style as ViewStyle, 
      ]}
    >
      <Svg
        width={iconWidth || 21}
        height={iconHeight || 21}
        viewBox="0 0 21 21"
        fill="none"
      >
        <Path
          d="M21 10.4925C16.8809 10.8667 14.5143 11.211 13.0613 12.3485C11.3538 13.6807 10.9494 16.1205 10.5 21C10.0357 15.9408 9.61626 13.516 7.74394 12.2138C6.29101 11.196 3.93937 10.8667 0 10.5075C4.10414 10.1333 6.48573 9.78902 7.92368 8.66643C9.64622 7.31932 10.0506 4.89451 10.5 0C10.9194 4.50535 11.2939 6.91518 12.6869 8.3072C14.0799 9.69922 16.5064 10.0884 21 10.4925Z"
          fill={color || "white"}
        />
      </Svg>
    </Animated.View>
  );
}

export default memo(IconTwinkleAnimated);