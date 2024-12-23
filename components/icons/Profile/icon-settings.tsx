import Svg, { Path } from "react-native-svg";
import { IconProps } from "../types";

export function IconSettings({ style, color }: IconProps) {
  return (
    <Svg width="27" height="28" viewBox="0 0 27 28" fill="none" style={style}>
      <Path
        d="M24.6469 7.92674L24.0299 6.85599C23.5632 6.0462 23.33 5.64132 22.933 5.47985C22.536 5.3184 22.087 5.4458 21.1891 5.7006L19.6639 6.13023C19.0906 6.26243 18.4891 6.18743 17.9657 5.91849L17.5446 5.67553C17.0957 5.38804 16.7505 4.96417 16.5594 4.46593L16.142 3.2192C15.8675 2.39418 15.7302 1.98167 15.4035 1.74572C15.0769 1.50977 14.6429 1.50977 13.7749 1.50977H12.3814C11.5135 1.50977 11.0795 1.50977 10.7527 1.74572C10.4261 1.98167 10.2888 2.39418 10.0144 3.2192L9.59691 4.46593C9.40581 4.96417 9.06056 5.38804 8.61171 5.67553L8.19061 5.91849C7.66717 6.18743 7.06574 6.26243 6.49247 6.13023L4.96719 5.7006C4.06926 5.4458 3.62031 5.3184 3.22334 5.47985C2.82636 5.64132 2.59306 6.0462 2.12644 6.85599L1.50946 7.92674C1.07207 8.6858 0.853373 9.06534 0.895823 9.46937C0.938261 9.87339 1.23104 10.199 1.81657 10.8502L3.10537 12.291C3.42037 12.6898 3.64401 13.3848 3.64401 14.0096C3.64401 14.6348 3.42045 15.3295 3.10541 15.7284L1.81657 17.1693C1.23104 17.8205 0.938273 18.146 0.895823 18.5501C0.853373 18.9541 1.07207 19.3336 1.50946 20.0926L2.12642 21.1634C2.59304 21.9731 2.82636 22.3781 3.22334 22.5395C3.62031 22.701 4.06927 22.5736 4.96721 22.3188L6.49242 21.8891C7.06579 21.7569 7.66734 21.832 8.19084 22.101L8.61187 22.344C9.06064 22.6315 9.4058 23.0553 9.59687 23.5535L10.0144 24.8004C10.2888 25.6254 10.4261 26.0379 10.7527 26.2739C11.0795 26.5098 11.5135 26.5098 12.3814 26.5098H13.7749C14.6429 26.5098 15.0769 26.5098 15.4035 26.2739C15.7302 26.0379 15.8675 25.6254 16.142 24.8004L16.5595 23.5535C16.7505 23.0553 17.0956 22.6315 17.5445 22.344L17.9655 22.101C18.489 21.832 19.0905 21.7569 19.6639 21.8891L21.1891 22.3188C22.087 22.5736 22.536 22.701 22.933 22.5395C23.33 22.3781 23.5632 21.9731 24.0299 21.1634L24.6469 20.0926C25.0842 19.3336 25.3029 18.9541 25.2605 18.5501C25.218 18.146 24.9252 17.8205 24.3397 17.1693L23.0509 15.7284C22.7359 15.3295 22.5122 14.6348 22.5122 14.0096C22.5122 13.3848 22.736 12.6898 23.0509 12.291L24.3397 10.8502C24.9252 10.199 25.218 9.87339 25.2605 9.46937C25.3029 9.06534 25.0842 8.6858 24.6469 7.92674Z"
        fill={color}
        stroke={color}
        strokeWidth="1.5"
        strokeLinecap="round"
      />
      <Path
        d="M17.3994 14C17.3994 16.4162 15.4406 18.375 13.0244 18.375C10.6081 18.375 8.64941 16.4162 8.64941 14C8.64941 11.5838 10.6081 9.625 13.0244 9.625C15.4406 9.625 17.3994 11.5838 17.3994 14Z"
        fill={color}
        stroke="black"
        strokeWidth="1.5"
      />
    </Svg>
  );
}