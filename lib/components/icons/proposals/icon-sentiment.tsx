import Svg, { Path, Circle } from "react-native-svg";
import { ViewStyle } from "react-native";
import { memo } from "react";
import { ECommentSentiment } from "@/lib/types/comment";

interface SentimentIconProps {
  sentiment: ECommentSentiment;
  color?: string;
  iconWidth?: number;
  iconHeight?: number;
  style?: ViewStyle;
}

const IconSentiment = ({
  sentiment,
  color = "#79767D",
  iconWidth = 16,
  iconHeight = 16,
  style,
}: SentimentIconProps) => {
  const commonFace = (
    <>
      <Circle cx="6.25" cy="6.75" r="0.75" fill={color} />
      <Circle cx="10.25" cy="6.75" r="0.75" fill={color} />
    </>
  );

  const faces = {
    [ECommentSentiment.FOR]: (
      <Path
        d="M8.26085 9.77994C9.06774 9.77994 9.87463 9.78228 10.6815 9.77806C10.8699 9.77713 10.9791 9.88398 11.055 10.0293C11.1267 10.1666 11.0868 10.2997 10.9931 10.4206C9.9585 11.7596 8.11372 12.1762 6.61146 11.4038C6.14429 11.1639 5.74788 10.8344 5.42831 10.415C5.254 10.1863 5.32381 9.92803 5.59278 9.83383C5.68555 9.8015 5.78817 9.78181 5.88657 9.78134C6.678 9.77713 7.46942 9.779 8.26038 9.779L8.26085 9.77994Z"
        fill={color}
      />
    ),
    [ECommentSentiment.SLIGHTLY_FOR]: (
      <Path
        d="M5.5 10.3333C6.10808 11.1429 7.0762 11.6667 8.16667 11.6667C9.25713 11.6667 10.2253 11.1429 10.8333 10.3333"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    [ECommentSentiment.NEUTRAL]: (
      <Path d="M5 10.5H11.5" stroke={color} strokeLinecap="round" />
    ),
    [ECommentSentiment.SLIGHTLY_AGAINST]: (
      <Path
        d="M5.49985 11.3333C6.10793 10.5237 7.07605 10 8.16651 10C9.25698 10 10.2251 10.5237 10.8332 11.3333"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    ),
    [ECommentSentiment.AGAINST]: (
      <Path
        d="M5.428 10.4206C5.74757 10.0012 6.14398 9.6717 6.61115 9.43177C8.11341 8.6594 9.95819 9.076 10.9928 10.415C11.0865 10.5359 11.1264 10.669 11.0547 10.8063C10.9788 10.9516 10.8697 11.0585 10.6813 11.0575C9.87443 11.0533 9.06754 11.0557 8.26066 11.0557C7.46924 11.0552 6.67782 11.0571 5.88639 11.0529C5.788 11.0524 5.68537 11.0327 5.5926 11.0003C5.32363 10.9061 5.25382 10.6478 5.428 10.4206Z"
        fill={color}
      />
    ),
  };

  return (
    <Svg
      width={iconWidth}
      height={iconHeight}
      viewBox="0 0 16 16"
      fill="none"
      style={style}
    >
      <Path
        d="M8 14.6667C11.6819 14.6667 14.6667 11.6819 14.6667 8C14.6667 4.3181 11.6819 1.33334 8 1.33334C4.3181 1.33334 1.33334 4.3181 1.33334 8C1.33334 11.6819 4.3181 14.6667 8 14.6667Z"
        fill="#161616"
        stroke={color}
        strokeLinecap="round"
        strokeLinejoin="round"
      />
      {commonFace}
      {faces[sentiment]}
    </Svg>
  );
}

export default memo(IconSentiment);