import React from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconDislike({ color, filled = false, style }: IconProps) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style}>
      <Path
        d="M4.5 7.4616L6.39247 13.5024C6.63817 14.2866 7.52898 14.6629 8.26253 14.2923V14.2923C8.71065 14.0659 8.9932 13.6066 8.9932 13.1045V12.3078V10.6924H12.8405C13.9644 10.6924 14.8135 9.67374 14.6111 8.56818L13.8532 4.42921C13.6294 3.20696 12.8738 2.14751 11.791 1.53793V1.53793C11.1646 1.18531 10.458 1.00006 9.7392 1.00006L4.5 1.00006M4.5 7.4616H1.8C1.35817 7.4616 1 7.10343 1 6.6616V1.80006C1 1.35823 1.35817 1.00006 1.8 1.00006H4.5M4.5 7.4616V1.00006"
        stroke={filled ? "none" : color}
        fill={filled ? color : "none"}
        strokeWidth="1.6"
      />
    </Svg>
  );
}
