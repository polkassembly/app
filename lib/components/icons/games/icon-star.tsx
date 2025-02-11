import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconStar({ style, color, iconHeight=8, iconWidth=8 }: IconProps) {
  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 8 8" fill="none" style={style}>
      <Path
        d="M4.18503 1.59994L4.71297 2.66455C4.78497 2.81275 4.97694 2.9549 5.13894 2.98212L6.09582 3.14241C6.70775 3.24524 6.85175 3.69287 6.41078 4.13444L5.66688 4.8845C5.54088 5.01152 5.47191 5.2565 5.51088 5.43194L5.72387 6.36044C5.89185 7.09538 5.50488 7.37969 4.85997 6.99557L3.96306 6.46025C3.80109 6.36347 3.53412 6.36347 3.36912 6.46025L2.47223 6.99557C1.8303 7.37969 1.44034 7.09235 1.60832 6.36044L1.8213 5.43194C1.86029 5.2565 1.7913 5.01152 1.66532 4.8845L0.9214 4.13444C0.483448 3.69287 0.624433 3.24524 1.23636 3.14241L2.19326 2.98212C2.35224 2.9549 2.54422 2.81275 2.61621 2.66455L3.14415 1.59994C3.43212 1.02227 3.90006 1.02227 4.18503 1.59994Z"
        fill={color || "#FFBF60"}
        stroke={color || "#FFBF60"}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
