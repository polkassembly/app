import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconNews({ style, color }: IconProps) {
  return (
    <Svg width="32" height="32" viewBox="0 0 32 32" fill="none" style={style}>
      <Path
        d="M29.3332 16C29.3332 8.6362 23.3636 2.66667 15.9998 2.66667C8.63604 2.66667 2.6665 8.6362 2.6665 16C2.6665 23.3637 8.63604 29.3333 15.9998 29.3333C23.3636 29.3333 29.3332 23.3637 29.3332 16Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
      />
      <Path
        d="M16.5354 11.0639L20.4286 9.7662C21.6102 9.37232 22.2011 9.17537 22.513 9.48725C22.8248 9.79913 22.6279 10.39 22.2339 11.5716L20.9362 15.4648C20.265 17.4784 19.9294 18.4852 19.2074 19.2072C18.4854 19.9292 17.4786 20.2648 15.465 20.936L11.5718 22.2337C10.3901 22.6277 9.7993 22.8247 9.48742 22.5128C9.17554 22.2009 9.37248 21.61 9.76636 20.4284L11.0641 16.5352C11.7353 14.5216 12.0709 13.5148 12.7929 12.7928C13.515 12.0707 14.5218 11.7351 16.5354 11.0639Z"
        stroke="black"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      <Path
        d="M16.0007 16L15.9922 16.0085"
        stroke="black"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </Svg>
  );
}
