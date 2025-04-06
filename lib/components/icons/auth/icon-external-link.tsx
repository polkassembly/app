import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconExternalLink({ color, filled, iconHeight, iconWidth, style }: IconProps) {
  return (
    <Svg
      width={iconWidth || 15}
      height={iconHeight || 15}
      viewBox="0 0 15 15"
      fill={filled ? color : "none"}
      style={style}
    >
      <Path
        d="M6.40027 1.50146C3.96767 1.50584 2.69382 1.56556 1.87975 2.37962C1.00122 3.25812 1.00122 4.67205 1.00122 7.49988C1.00122 10.3277 1.00122 11.7417 1.87975 12.6201C2.75827 13.4987 4.17224 13.4987 7.0002 13.4987C9.82807 13.4987 11.2421 13.4987 12.1206 12.6201C12.9347 11.8061 12.9944 10.5323 12.9988 8.09981"
        stroke={color || "white"}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.6536 1.84493L8.9541 5.53425M12.6536 1.84493C12.3243 1.51525 10.1059 1.54599 9.6369 1.55265M12.6536 1.84493C12.9829 2.1746 12.9522 4.39545 12.9456 4.86495"
        stroke={color || "white"}
        strokeWidth={1.25}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
