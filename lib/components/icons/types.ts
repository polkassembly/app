import { StyleProp, ViewStyle } from "react-native";

export interface IconProps {
  style?: StyleProp<ViewStyle>;
  color?: string;
  filled?: boolean;
  iconWidth?: number,
  iconHeight?: number,
}