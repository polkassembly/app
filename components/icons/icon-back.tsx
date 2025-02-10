import Svg, { Path } from "react-native-svg";
import { IconProps } from "./types";

export default function IconBack({ color, iconHeight, iconWidth }: IconProps) {
  return (
    <Svg
      width={iconWidth ?? 16}
      height={iconHeight ?? 16}
      viewBox="0 0 16 16"
      fill="none"
    >
      <Path
        d="M2.6665 7.99976H13.3332"
        stroke={color ?? "#E5007A"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M5.99982 11.3334C5.99982 11.3334 2.66652 8.87848 2.6665 8.00008C2.6665 7.12168 5.99984 4.66675 5.99984 4.66675"
        stroke={color ?? "#E5007A"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
