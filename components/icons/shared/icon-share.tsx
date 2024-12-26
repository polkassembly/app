import React from "react";
import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconShare({ color, style }: IconProps) {
  return (
    <Svg width="16" height="16" viewBox="0 0 16 16" fill="none" style={style}>
      <Path
        d="M14.0316 2.03535C12.5796 0.471636 1.65749 4.30219 1.66651 5.70073C1.67674 7.28666 5.9319 7.77453 7.1113 8.10546C7.82057 8.30439 8.0105 8.50839 8.17404 9.25213C8.9147 12.6204 9.28657 14.2957 10.1341 14.3331C11.485 14.3929 15.4487 3.56139 14.0316 2.03535Z"
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M7.6665 8.33339L9.99984 6.00006"
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
