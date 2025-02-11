import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface BottomSheetProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function BottomSheet({
  open,
  onClose,
  children,
  style,
}: BottomSheetProps) {
  /**
   * TODO: we probably want to animate this to
   * enter screen white sliding into the view.
   * Or perhaps use a third party library for bottom sheets?
   */

  const backdropColor = useThemeColor({}, "backdrop");
  const sheetColor = useThemeColor({}, "container");

  return (
    <View
      onTouchStart={onClose}
      style={[
        styles.root,
        { backgroundColor: backdropColor, display: open ? "flex" : "none" },
        style,
      ]}
    >
      <View
        onTouchStart={(e) => e.stopPropagation()}
        style={[styles.sheet, { backgroundColor: sheetColor }]}
      >
        {children}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  root: {
    // take up entire screen
    position: "absolute",
    height: "100%",
    width: "100%",
    top: 1,
    left: 1,
    zIndex: 100,

    // put the sheet on bottom
    flexDirection: "column",
    justifyContent: "flex-end",

    opacity: 65,
  },

  sheet: {
    marginInline: 8,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    padding: 24,
  },
});
