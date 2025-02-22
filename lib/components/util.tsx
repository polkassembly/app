import { View } from "react-native";

/**
 * EmptyViewWithTabBarHeight
 * 
 * This utility component serves as a spacer with a fixed height equivalent 
 * to the tab bar's height. It is useful for layout adjustments where you 
 * need to reserve space for the tab bar, preventing overlap between the 
 * tab bar and the screen content.
 * 
 * By inserting this component at the bottom of a scrollable view or 
 * layout, you ensure that the content is fully visible and does not get 
 * obstructed by the tab bar.
 * 
 * @returns A view element with a fixed height of 80 units, matching the tab bar height.
 */
export function EmptyViewWithTabBarHeight({ children }: { children?: React.ReactNode }) {
  return(
    <View style={{ marginBottom: 60 }}>
      {children}
    </View>
  );
}
