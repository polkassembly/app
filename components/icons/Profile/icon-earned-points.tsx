import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export default function IconEarnedPoints({ style, color }: IconProps) {
  return (
    <Svg width="21" height="17" viewBox="0 0 21 17" fill="none" style={style}>
      <Path
        d="M0.654297 14.3526C0.654297 13.2434 0.654297 12.6888 0.94719 12.3442C1.24008 11.9997 1.71149 11.9997 2.6543 11.9997H18.6543C19.5971 11.9997 20.0685 11.9997 20.3614 12.3442C20.6543 12.6888 20.6543 13.2434 20.6543 14.3526C20.6543 15.4618 20.6543 16.0164 20.3614 16.361C20.0685 16.7055 19.5971 16.7055 18.6543 16.7055H2.6543C1.71149 16.7055 1.24008 16.7055 0.94719 16.361C0.654297 16.0164 0.654297 15.4618 0.654297 14.3526Z"
        fill={color}
      />
      <Path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M11.1731 0.235352H10.1351C6.22029 0.235352 4.2629 0.235352 3.04673 1.21973C1.83057 2.20411 1.83057 3.78843 1.83057 6.9571V10.5001C1.9813 10.4983 2.1929 10.4984 2.3496 10.4984H18.9586C19.1153 10.4984 19.3269 10.4983 19.4776 10.5001V6.9571C19.4776 3.78843 19.4776 2.20411 18.2615 1.21973C17.0453 0.235352 15.0879 0.235352 11.1731 0.235352ZM13.5948 3.36526C13.8977 3.63572 13.924 4.10054 13.6536 4.40346L10.1522 8.32503C10.0127 8.48127 9.81314 8.57061 9.60368 8.57061C9.39422 8.57061 9.1947 8.48127 9.0552 8.32503L7.65464 6.7564C7.38418 6.45348 7.41049 5.98866 7.7134 5.7182C8.01632 5.44774 8.48114 5.47405 8.75161 5.77697L9.60368 6.73129L12.5566 3.42403C12.8271 3.12111 13.2919 3.0948 13.5948 3.36526Z"
        fill={color}
      />
    </Svg>
  );
}
