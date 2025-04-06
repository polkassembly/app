import React from "react";
import { TouchableOpacity, StyleSheet } from "react-native";
import Ionicons from "@expo/vector-icons/Ionicons";
import { ThemedView } from "../View";

type NavigateButtonProps = {
  onPress: () => void;
  containerSize?: number; // Custom size for the container (width & height)
  iconSize?: number; // Custom size for the icon
};

const NavigateButton: React.FC<NavigateButtonProps> = ({
  onPress,
  containerSize = 52, // Default container size
  iconSize = 32, // Default icon size
}) => {
  return (
    <TouchableOpacity onPress={onPress}>
      <ThemedView
        style={[styles.navigateButtonContainer, { width: containerSize, height: containerSize }]}
        type="secondaryContainer"
      >
        <Ionicons name="chevron-forward" size={iconSize} color="white" />
      </ThemedView>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  navigateButtonContainer: {
    borderRadius: 25,
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
});

export default NavigateButton;