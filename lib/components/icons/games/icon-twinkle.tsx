import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconTwinkle({ style, color, iconWidth, iconHeight }: IconProps) {
  return (
    <Svg
      width={iconWidth || 21}
      height={iconHeight || 21}
      viewBox="0 0 21 21"
      fill="none"
      style={style}
    >
      <Path
        d="M21 10.4925C16.8809 10.8667 14.5143 11.211 13.0613 12.3485C11.3538 13.6807 10.9494 16.1205 10.5 21C10.0357 15.9408 9.61626 13.516 7.74394 12.2138C6.29101 11.196 3.93937 10.8667 0 10.5075C4.10414 10.1333 6.48573 9.78902 7.92368 8.66643C9.64622 7.31932 10.0506 4.89451 10.5 0C10.9194 4.50535 11.2939 6.91518 12.6869 8.3072C14.0799 9.69922 16.5064 10.0884 21 10.4925Z"
        fill={color || "white"}
      />
    </Svg>
  );
}
