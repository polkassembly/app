import Svg, { Path, Rect } from "react-native-svg";
import { IconProps } from "./types";

export default function IconArrowRightEnclosed( { color, filled, iconHeight, iconWidth, style} : IconProps) {
  return (
    <Svg width={iconWidth} height={iconHeight} viewBox="0 0 26 26" fill={filled && color || "none"} style={style}>
      <Path
        d="M10.2437 16.8854L13.4771 13.6521L10.2437 10.4188C9.91875 10.0938 9.91875 9.56875 10.2437 9.24375C10.5687 8.91875 11.0937 8.91875 11.4187 9.24375L15.2437 13.0687C15.5688 13.3937 15.5688 13.9187 15.2437 14.2437L11.4187 18.0687C11.0938 18.3937 10.5688 18.3937 10.2437 18.0687C9.92708 17.7438 9.91875 17.2104 10.2437 16.8854Z"
        fill={color}
      />
    </Svg>
  );
}
