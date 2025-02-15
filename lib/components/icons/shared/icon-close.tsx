import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconClose({ color, iconHeight, iconWidth }: IconProps) {
  return (
    <Svg
      width={iconWidth ?? 14}
      height={iconHeight ?? 15}
      viewBox="0 0 14 15"
      fill="none"
    >
      <Path
        d="M14 1.91L12.59 0.5L7 6.09L1.41 0.5L0 1.91L5.59 7.5L0 13.09L1.41 14.5L7 8.91L12.59 14.5L14 13.09L8.41 7.5L14 1.91Z"
        fill={color ?? "#79767D"}
      />
    </Svg>
  );
}
