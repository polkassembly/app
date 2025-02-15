import { useThemeColor } from "@/lib/hooks/useThemeColor";
import { PropsWithChildren } from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";

interface BottomSheetProps extends PropsWithChildren {
  open: boolean;
  onClose: () => void;
  style?: StyleProp<ViewStyle>;
}

export default function BottomSheet({ open, onClose, children, style }: BottomSheetProps) {
  const backdropColor = useThemeColor({}, "backdrop");
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
        onTouchStart={(e) => e.stopPropagation()} // Prevent closing when tapping on the sheet
        style={{ flex: 1, justifyContent: "flex-end" }}
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
    top: 0,
    left: 0,
    zIndex: 100,

    // put the sheet on bottom
    flexDirection: "column",
    justifyContent: "flex-end",
    opacity: 65,
  },
});
