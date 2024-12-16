import Svg, { Path } from "react-native-svg";
import { IconProps } from "./types";

export function IconProfile({ color, style }: IconProps) {
  return (
    <Svg
      width="44"
      height="44"
      viewBox="0 0 44 44"
      fill="none"
      style={style}
    >
      <Path
        d="M14.2679 31.3705C12.2505 32.5288 6.96112 34.894 10.1827 37.8535C11.7564 39.2993 13.5092 40.3333 15.7128 40.3333H28.2869C30.4906 40.3333 32.2432 39.2993 33.817 37.8535C37.0385 34.894 31.7491 32.5288 29.7317 31.3705C25.0012 28.6542 18.9985 28.6542 14.2679 31.3705Z"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
        stroke-linejoin="round"
      />
      <Path
        d="M28.4168 18.3334C28.4168 21.8772 25.544 24.75 22.0002 24.75C18.4563 24.75 15.5835 21.8772 15.5835 18.3334C15.5835 14.7895 18.4563 11.9167 22.0002 11.9167C25.544 11.9167 28.4168 14.7895 28.4168 18.3334Z"
        stroke={color}
        stroke-width="2"
      />
      <Path
        d="M5.23217 29.3334C4.22569 27.0718 3.6665 24.5685 3.6665 21.9351C3.6665 11.8457 11.8746 3.66669 21.9998 3.66669C32.125 3.66669 40.3332 11.8457 40.3332 21.9351C40.3332 24.5685 39.774 27.0718 38.7675 29.3334"
        stroke={color}
        stroke-width="2"
        stroke-linecap="round"
      />
    </Svg>
  );
}
