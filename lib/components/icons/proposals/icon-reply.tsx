import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconReply({
  color = "#79767D",
  filled = false,
  iconHeight = 16,
  iconWidth = 16,
  style,
}: IconProps) {
  return (
    <Svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 16 16"
      fill={filled ? color : "none"}
      style={style}
    >
      <Path
        d="M14.6667 7.71105C14.6667 11.2332 11.6815 14.0889 8.00001 14.0889C7.56714 14.0895 7.13548 14.0494 6.71028 13.9696C6.40423 13.9121 6.2512 13.8833 6.14436 13.8997C6.03752 13.916 5.88613 13.9965 5.58334 14.1575C4.72677 14.6131 3.72798 14.7739 2.76742 14.5953C3.1325 14.1462 3.38184 13.6074 3.49186 13.0298C3.55853 12.6765 3.39334 12.3333 3.14594 12.082C2.02223 10.9409 1.33334 9.40332 1.33334 7.71105C1.33334 4.18897 4.31853 1.33325 8.00001 1.33325C11.6815 1.33325 14.6667 4.18897 14.6667 7.71105Z"
        stroke={color}
        strokeLinejoin="round"
      />
      <Path
        d="M7.99701 8H8.00301M10.6607 8H10.6667M5.33334 8H5.33932"
        stroke={color}
        strokeWidth={1.33333}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
