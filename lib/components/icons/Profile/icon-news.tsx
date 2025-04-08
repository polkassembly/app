import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconNews({ style, color = "#575756", iconHeight, iconWidth, filled }: IconProps) {
  return (
    <Svg
      width={iconWidth || 30}
      height={iconHeight || 26}
      viewBox="0 0 30 26"
      fill="none"
      style={style}
    >
      <Path
        d="M13 7.66669H23.6667M13 13H16.3333M23.6667 13H20.3333M13 18.3334H16.3333M23.6667 18.3334H20.3333"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M8.33317 7H6.99984C4.48568 7 3.2286 7 2.44756 7.78105C1.6665 8.56209 1.6665 9.81917 1.6665 12.3333V21C1.6665 22.8409 3.15889 24.3333 4.99984 24.3333C6.84078 24.3333 8.33317 22.8409 8.33317 21V7Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M20.3333 1.66669H13.6667C12.4267 1.66669 11.8067 1.66669 11.2981 1.80298C9.91769 2.17285 8.83949 3.25105 8.46963 4.63141C8.33333 5.14007 8.33333 5.76006 8.33333 7.00002V21C8.33333 22.841 6.84095 24.3334 5 24.3334H20.3333C24.1045 24.3334 25.9901 24.3334 27.1617 23.1618C28.3333 21.9902 28.3333 20.1046 28.3333 16.3334V9.66669C28.3333 5.89545 28.3333 4.00983 27.1617 2.83826C25.9901 1.66669 24.1045 1.66669 20.3333 1.66669Z"
        stroke={color}
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
