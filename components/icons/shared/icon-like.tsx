import React from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconLike({ color, filled = false, style }: IconProps) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style}>
      <Path
        d="M4.5 8.53852L6.39247 2.49777C6.63817 1.7135 7.52898 1.33721 8.26253 1.70782V1.70782C8.71065 1.93423 8.9932 2.39356 8.9932 2.89562V3.69237V5.30775H12.8405C13.9644 5.30775 14.8135 6.32639 14.6111 7.43194L13.8532 11.5709C13.6294 12.7932 12.8738 13.8526 11.791 14.4622V14.4622C11.1646 14.8148 10.458 15.0001 9.7392 15.0001L4.5 15.0001M4.5 8.53852H1.8C1.35817 8.53852 1 8.89669 1 9.33852V14.2001C1 14.6419 1.35817 15.0001 1.8 15.0001H4.5M4.5 8.53852V15.0001"
        stroke={filled ? "none" : color}
        fill={filled ? color : "none"}
        strokeWidth="1.6"
      />
    </Svg>
  );
}
