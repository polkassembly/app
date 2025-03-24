import React, { memo } from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

const IconBookmark = ({ color, filled = false, style }: IconProps) => {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={style}>
      <Path
        d="M2 0.8C2 0.357647 2.35765 0 2.8 0H11.2C11.6424 0 12 0.357647 12 0.8V12.8C12 13.1233 11.6647 13.3094 11.3985 13.1381L7 10.2L2.6015 13.1381C2.33526 13.3094 2 13.1233 2 12.8V0.8Z"
        stroke={filled ? "none" : color}
        fill={filled ? color : "none"}
      />
    </Svg>
  );
}

export default memo(IconBookmark);