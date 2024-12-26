import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconViewMore({ style, color }: IconProps) {
  return (
    <Svg width="14" height="14" viewBox="0 0 14 14" fill="none" style={style}>
      <Path
        d="M6.40051 1.00145C3.96791 1.00582 2.69406 1.06554 1.87999 1.8796C1.00146 2.7581 1.00146 4.17203 1.00146 6.99986C1.00146 9.82773 1.00146 11.2417 1.87999 12.1201C2.75851 12.9987 4.17249 12.9987 7.00045 12.9987C9.82831 12.9987 11.2423 12.9987 12.1208 12.1201C12.9349 11.3061 12.9946 10.0323 12.999 7.59979"
        stroke={color || "#E5007A"}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M12.6536 1.34507L8.9541 5.0344M12.6536 1.34507C12.3243 1.0154 10.1059 1.04613 9.6369 1.0528M12.6536 1.34507C12.9829 1.67474 12.9522 3.89559 12.9456 4.36509"
        stroke={color || "#E5007A"}
        strokeWidth="1.25"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
