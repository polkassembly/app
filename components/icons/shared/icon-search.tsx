import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconSearch({ style, color, iconHeight = 14, iconWidth = 14 }: IconProps) {
  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 14 14" fill="none" style={style}>
      <Path
        d="M5.82975 10.5023C8.40708 10.5023 10.4964 8.41294 10.4964 5.83561C10.4964 3.25828 8.40708 1.16895 5.82975 1.16895C3.25242 1.16895 1.16309 3.25828 1.16309 5.83561C1.16309 8.41294 3.25242 10.5023 5.82975 10.5023Z"
        stroke={color || "#9B9B9B"}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.8308 12.832L9.09741 9.09863"
        stroke={color || "#9B9B9B"}
        strokeWidth="1.5"
        strokeMiterlimit="10"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
