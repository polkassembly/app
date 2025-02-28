import Svg, { Path } from "react-native-svg";
import { IconProps } from "./types";

export function IconPoints({ iconWidth, iconHeight, style, color }: IconProps) {
  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 24 24" style={style}>
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M12.0001 0.00492859C9.81044 5.9063 5.83681 9.84167 0 12.0006C5.90498 14.18 9.83493 18.1643 12.0001 23.9951V0.00492859Z"
        fill={color ?? "white"}
      />
      <Path
        opacity="0.6"
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.9999 0.00492859C14.1896 5.9063 18.1632 9.84167 24 12.0006C18.095 14.18 14.1651 18.1643 11.9999 23.9951V0.00492859Z"
        fill={color ?? "white"}
      />
    </Svg>
  );
}
