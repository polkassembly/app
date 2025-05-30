import Svg, { Path } from "react-native-svg";
import { IconProps } from "./types";
import { useThemeColor } from "@/lib/hooks";
import { memo } from "react";

const IconBrowser = ({ color, style, iconHeight, iconWidth }: IconProps) => {
  const iconColor = color || useThemeColor({}, "text");
  return (
    <Svg width={iconWidth || 32} height={iconHeight || 32} viewBox="0 0 32 32" fill="none" color={iconColor} style={style}>
      <Path
        d="M6.74933 17.3333C5.10972 18.2432 4 19.992 4 22C4 24.9454 6.38781 27.3333 9.33333 27.3333C12.2789 27.3333 14.6667 24.9454 14.6667 22H22.6667"
        stroke={iconColor}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M16 10L20.0761 17.3369C20.8431 16.91 21.7265 16.6667 22.6667 16.6667C25.6121 16.6667 28 19.0545 28 22C28 24.9455 25.6121 27.3333 22.6667 27.3333C21.4055 27.3333 20.2464 26.8955 19.3333 26.1636"
        stroke={iconColor}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M15.9998 11.3334C16.7362 11.3334 17.3332 10.7364 17.3332 10C17.3332 9.26365 16.7362 8.66669 15.9998 8.66669M15.9998 11.3334C15.2634 11.3334 14.6665 10.7364 14.6665 10C14.6665 9.26365 15.2634 8.66669 15.9998 8.66669M15.9998 11.3334V8.66669"
        stroke={iconColor}
        stroke-width="1.5"
      />
      <Path
        d="M9.33333 23.3334C10.0697 23.3334 10.6667 22.7364 10.6667 22C10.6667 21.2636 10.0697 20.6667 9.33333 20.6667M9.33333 23.3334C8.59696 23.3334 8 22.7364 8 22C8 21.2636 8.59696 20.6667 9.33333 20.6667M9.33333 23.3334V20.6667"
        stroke={iconColor}
        stroke-width="1.5"
      />
      <Path
        d="M22.6668 23.3334C23.4032 23.3334 24.0002 22.7364 24.0002 22C24.0002 21.2636 23.4032 20.6667 22.6668 20.6667M22.6668 23.3334C21.9304 23.3334 21.3335 22.7364 21.3335 22C21.3335 21.2636 21.9304 20.6667 22.6668 20.6667M22.6668 23.3334V20.6667"
        stroke={iconColor}
        stroke-width="1.5"
      />
      <Path
        d="M21.3335 10C21.3335 7.0545 18.9456 4.66669 16.0002 4.66669C13.0546 4.66669 10.6668 7.0545 10.6668 10C10.6668 12.0054 11.7736 13.7522 13.4096 14.6631L9.3335 22"
        stroke={iconColor}
        stroke-width="1.5"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
    </Svg>
  );
}

export default memo(IconBrowser)